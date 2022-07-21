/* eslint-disable promise/catch-or-return, promise/always-return */
import toast from 'components/01_atoms/Toast'
import { ICE_SERVER_URL } from 'const'
import {
  CancelMutation,
  CancelMutationVariables,
  HangUpMutation,
  HangUpMutationVariables,
  IceCandidateSubscription,
  PickUpMutation,
  PickUpMutationVariables,
  RingUpMutation,
  RingUpMutationVariables,
  SendIceCandidateMutation,
  SendIceCandidateMutationVariables,
  SignalingSubscription,
  SignalType
} from 'graphql/generated'
import { CallType, MutateFunction, SetState } from 'types'
import { toStr } from 'utils/general/helper'
import { includes, isNullish } from 'utils/general/object'

export class WebRTC {
  /** RTCPeerConnection */
  protected connection?: RTCPeerConnection

  /** Local MediaStream */
  protected localMediaStream?: Promise<MediaStream>

  /** call id */
  protected callId?: string

  /** other user id */
  protected otherUserId?: string

  /** answer set flag */
  protected answered = false

  /**
   * コンストラクタ
   *
   * @param callType - 通話タイプ
   * @param setCallTypeFunc - 通話タイプ setState
   * @param ringUpMutation - 通話架電 mutation
   * @param pickUpMutation - 通話応答 mutation
   * @param hangUpMutation - 通話終了 mutation
   * @param cancelMutation - 通話キャンセル mutation
   * @param sendIceCandidateMutation - ICE Candidate 送信 mutation
   * @param remoteVideo - リモート VideoElement
   * @param localVideo - ローカル VideoElement
   */
  constructor(
    protected callType: CallType,
    protected setCallTypeFunc: SetState<CallType>,
    protected ringUpMutation: MutateFunction<RingUpMutation, RingUpMutationVariables>,
    protected pickUpMutation: MutateFunction<PickUpMutation, PickUpMutationVariables>,
    protected hangUpMutation: MutateFunction<HangUpMutation, HangUpMutationVariables>,
    protected cancelMutation: MutateFunction<CancelMutation, CancelMutationVariables>,
    protected sendIceCandidateMutation: MutateFunction<SendIceCandidateMutation, SendIceCandidateMutationVariables>,
    protected remoteVideo: HTMLVideoElement | null,
    protected localVideo: HTMLVideoElement | null
  ) {
    // ローカルのMediaStreamの取得
    this.localMediaStream = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user' }
    })

    // ローカルのVideoElementの再生
    if (!isNullish(this.localVideo)) {
      this.localMediaStream.then((stream) => {
        if (!isNullish(this.localVideo)) WebRTC.playVideo(this.localVideo, stream)
      })
    }
  }

  /**
   * Offer処理
   *
   * @param contactId - コンタクトID
   * @param otherUserId - 通話相手ユーザーID
   * @returns void
   */
  public offer(contactId: string, otherUserId: string): void {
    this.connection = this.createConnection(contactId)
    this.otherUserId = otherUserId
  }

  /**
   * Answer処理
   *
   * @param signal - シグナルオブジェクト
   * @returns Promise<void>
   */
  public async answer(signal: SignalingSubscription['signalingSubscription']): Promise<void> {
    if (SignalType.Close === signal.signalType) this.purge()
    if (SignalType.Offer !== signal.signalType) return
    const conn = this.createConnection()
    const sessionDesc = JSON.parse(toStr(signal.sdp)) as RTCSessionDescription
    await conn.setRemoteDescription(sessionDesc)
    const answer = await conn.createAnswer()
    await conn.setLocalDescription(answer)
    const sdp = JSON.stringify(conn.localDescription)
    const input = { callId: signal.callId, sdp }
    this.pickUpMutation({ variables: { input } }).catch(toast('UnexpectedError'))

    this.connection = conn
    this.callId = signal.callId
    this.otherUserId = signal.txUserId
    this.answered = true
  }

  /**
   * シグナリング処理
   *
   * @param signal - シグナルオブジェクト
   * @returns void
   */
  public signaling(signal: SignalingSubscription['signalingSubscription']): void {
    if (this.callId !== signal.callId) return

    // Answer取得時
    if (SignalType.Answer == signal.signalType) {
      const sessionDesc = JSON.parse(toStr(signal.sdp)) as RTCSessionDescription
      this.connection?.setRemoteDescription(sessionDesc)
      this.answered = true
    }

    // Close/Cancel取得時
    if (includes(signal.signalType, SignalType.Close, SignalType.Cancel)) {
      this.purge()
    }
  }

  /**
   * ICE Candidate追加処理
   *
   * @param iceCandidate - ICE Candidateオブジェクト
   * @returns void
   */
  public addIceCandidate(iceCandidate: IceCandidateSubscription['iceCandidateSubscription']): void {
    if (this.callId !== iceCandidate.callId) return
    const candidate = JSON.parse(iceCandidate.candidate) as RTCIceCandidate
    this.connection?.addIceCandidate(new RTCIceCandidate(candidate))
  }

  /**
   * 通話終了処理
   *
   * @returns void
   */
  public hangUp(): void {
    if (!isNullish(this.callId)) {
      const option = { variables: { callId: this.callId } }
      if (this.answered) this.hangUpMutation(option).catch(toast('UnexpectedError'))
      if (!this.answered) this.cancelMutation(option).catch(toast('UnexpectedError'))
    }
    this.purge()
  }

  /**
   * セッションのcallIdを取得する
   *
   * @returns string
   */
  public get getCallId(): string {
    return toStr(this.callId)
  }

  /**
   * マイクのon/offをセットする
   *
   * @param enabled - on/off state
   */
  public set setMicState(enabled: boolean) {
    this.localMediaStream?.then((stream) => {
      stream.getAudioTracks().forEach((track) => (track.enabled = enabled))
    })
  }

  /**
   * カメラのon/offをセットする
   *
   * @param enabled -on/off state
   */
  public set setCameraState(enabled: boolean) {
    this.localMediaStream?.then((stream) => {
      stream.getVideoTracks().forEach((track) => (track.enabled = enabled))
    })
  }

  /**
   * RTCPeerConnectionオブジェクトを生成する
   *
   * @param contactId - コンタクトID
   * @returns RTCPeerConnection
   */
  private createConnection(contactId?: string): RTCPeerConnection {
    // RTCPeerConnection
    const conn = new RTCPeerConnection({
      iceServers: [{ urls: ICE_SERVER_URL }]
    })

    // ICE Candidate 収集時イベント
    conn.onicecandidate = (evt) => {
      if (isNullish(evt.candidate) || isNullish(this.callId) || isNullish(this.otherUserId)) return
      const candidate = JSON.stringify(evt.candidate)
      const input = { callId: this.callId, otherUserId: this.otherUserId, candidate }
      this.sendIceCandidateMutation({ variables: { input } }).catch(toast('UnexpectedError'))
    }

    // Offer ネゴシエーション
    conn.onnegotiationneeded = async () => {
      if (CallType.Offer !== this.callType) return
      const offer = await conn.createOffer()
      await conn.setLocalDescription(offer)
      const sdp = JSON.stringify(conn.localDescription)
      const input = { contactId: toStr(contactId), sdp }
      this.ringUpMutation({ variables: { input } })
        .then(({ data }) => (this.callId = data?.ringUp.message?.call?.id))
        .catch(toast('UnexpectedError'))
    }

    // ICE state 変更時
    conn.oniceconnectionstatechange = () => {
      if ('failed' === conn.iceConnectionState) this.hangUp()
      if ('disconnected' === conn.iceConnectionState) {
        const timer = setInterval(() => {
          if ('disconnected' !== conn.iceConnectionState) clearInterval(timer)
          if (isNullish(conn.connectionState)) return
          if (!includes(conn.connectionState, 'failed', 'close')) return
          clearInterval(timer)
          this.hangUp()
        }, 500)
      }
    }

    // リモート MediStreamTrack 受信時
    conn.ontrack = (evt) => {
      if (!isNullish(this.remoteVideo)) WebRTC.playVideo(this.remoteVideo, evt.streams[0])
    }

    // ローカル MediaStream
    this.localMediaStream
      ?.then((stream) =>
        stream.getTracks().forEach((track) => {
          if (!isNullish(this.localMediaStream)) conn.addTrack(track, stream)
        })
      )
      .catch(() => this.hangUp())

    return conn
  }

  /**
   * 終了処理
   *
   * @returns void
   */
  protected purge(): void {
    this.setCallTypeFunc(CallType.Close)
    if (!isNullish(this.remoteVideo)) WebRTC.clearVideo(this.remoteVideo)
    if (!isNullish(this.localVideo)) WebRTC.clearVideo(this.localVideo)
    if (!isNullish(this.localMediaStream)) {
      this.localMediaStream.then((stream) => stream.getTracks().forEach((track) => track.stop()))
      this.localMediaStream = undefined
    }
    if (!isNullish(this.connection)) {
      this.connection.close()
      this.connection = undefined
    }
  }

  /**
   * VideoElement メディアの再生を開始する
   *
   * @param video - VideoElement
   * @param stream - MediaStream
   * @returns void
   */
  protected static playVideo(video: HTMLVideoElement, stream?: MediaStream): void {
    if (isNullish(stream)) return
    video.srcObject = stream
    video.play()
  }

  /**
   * VideoElement クリア処理
   *
   * @param video - VideoElement
   * @returns void
   */
  protected static clearVideo(video: HTMLVideoElement): void {
    video.pause()
    video.srcObject = null
  }
}
