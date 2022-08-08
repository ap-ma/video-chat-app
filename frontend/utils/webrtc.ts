/* eslint-disable promise/catch-or-return, promise/always-return */
import toast from 'components/01_atoms/Toast'
import { ICE_SERVER_URLS } from 'const'
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
  SendIceCandidatesMutation,
  SendIceCandidatesMutationVariables,
  SignalingSubscription,
  SignalType
} from 'graphql/generated'
import { CallType, MutateFunction, SetState } from 'types'
import { toStr } from 'utils/general/helper'
import { includes, isBlank, isNullish } from 'utils/general/object'

export class WebRTC {
  /** RTCPeerConnection */
  protected connection?: RTCPeerConnection

  /** Local MediaStream */
  protected localMediaStream: Promise<MediaStream>

  /** call id */
  protected callId?: string

  /** other user id */
  protected otherUserId?: string

  /** answer set flag */
  protected answered = false

  /** unsent ICE Candidates */
  protected unsentCandidates: Array<RTCIceCandidate> = []

  /**
   * コンストラクタ
   *
   * @param callType - 通話タイプ
   * @param setCallTypeFunc - 通話タイプ setState
   * @param ringUpMutation - 通話架電 mutation
   * @param pickUpMutation - 通話応答 mutation
   * @param hangUpMutation - 通話終了 mutation
   * @param cancelMutation - 通話キャンセル mutation
   * @param sendIceCandidatesMutation - ICE Candidate 送信 mutation
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
    protected sendIceCandidatesMutation: MutateFunction<SendIceCandidatesMutation, SendIceCandidatesMutationVariables>,
    protected remoteVideo: HTMLVideoElement | null,
    protected localVideo: HTMLVideoElement | null
  ) {
    // ローカルのMediaStreamの取得
    this.localMediaStream = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: 'user',
        frameRate: { ideal: 30 },
        width: { ideal: 1024 },
        height: { ideal: 576 }
      }
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
    this.otherUserId = otherUserId
    this.connection = this.createConnection(contactId)
    this.addTrack()
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

    this.callId = signal.callId
    this.otherUserId = signal.txUserId
    const conn = this.createConnection()
    const sessionDesc = JSON.parse(toStr(signal.sdp)) as RTCSessionDescription
    await conn.setRemoteDescription(sessionDesc)
    this.addTrack(async () => {
      const answer = await conn.createAnswer()
      await conn.setLocalDescription(answer)
      const sdp = JSON.stringify(conn.localDescription)
      const input = { callId: signal.callId, sdp }
      this.pickUpMutation({ variables: { input } }).catch(toast('UnexpectedError'))
      this.connection = conn
      this.answered = true
      this.sendCandidates(this.unsentCandidates)
    })
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
      this.sendCandidates(this.unsentCandidates)
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
  public addIceCandidates(iceCandidate: IceCandidateSubscription['iceCandidateSubscription']): void {
    if (this.callId !== iceCandidate.callId) return
    iceCandidate.candidates.forEach((candidate) =>
      this.connection?.addIceCandidate(JSON.parse(candidate) as RTCIceCandidate)
    )
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
    this.localMediaStream.then((stream) => {
      stream.getAudioTracks().forEach((track) => (track.enabled = enabled))
    })
  }

  /**
   * カメラのon/offをセットする
   *
   * @param enabled -on/off state
   */
  public set setCameraState(enabled: boolean) {
    this.localMediaStream.then((stream) => {
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
    const conn = new RTCPeerConnection(WebRTC.getPcConfig())

    // ICE Candidate 収集時イベント
    conn.onicecandidate = (evt) => {
      if (isNullish(evt.candidate) || isNullish(this.otherUserId)) return
      if (this.answered) return this.sendCandidates([evt.candidate])
      this.unsentCandidates.push(evt.candidate)
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

    return conn
  }

  /**
   * ピアに送信するメディアトラックを追加する
   *
   * @param after - トラック追加後処理
   * @returns Promise<void>
   */
  protected addTrack(after?: () => unknown): Promise<void> {
    return this.localMediaStream
      .then((stream) => {
        stream.getTracks().forEach((track) => this.connection?.addTrack(track, stream))
        if (!isNullish(after)) after()
      })
      .catch(() => this.hangUp())
  }

  /**
   * RTCIceCandidate送信処理
   *
   * @param iceCandidates - RTCIceCandidate配列
   * @returns void
   */
  protected sendCandidates(iceCandidates: Array<RTCIceCandidate>): void {
    if (isNullish(this.callId) || isNullish(this.otherUserId) || isBlank(iceCandidates)) return
    const candidates = iceCandidates.map((candidate) => JSON.stringify(candidate))
    const input = { callId: this.callId, otherUserId: this.otherUserId, candidates }
    this.sendIceCandidatesMutation({ variables: { input } }).catch(toast('UnexpectedError'))
  }

  /**
   * 終了処理
   *
   * @returns void
   */
  protected purge(): void {
    this.setCallTypeFunc(CallType.Close)
    this.localMediaStream.then((stream) => stream.getTracks().forEach((track) => track.stop()))
    if (!isNullish(this.remoteVideo)) WebRTC.clearVideo(this.remoteVideo)
    if (!isNullish(this.localVideo)) WebRTC.clearVideo(this.localVideo)
    if (!isNullish(this.connection)) {
      this.connection.close()
      this.connection = undefined
    }
  }

  /**
   * RTCConfigurationを取得する
   *
   * @returns RTCConfiguration
   */
  protected static getPcConfig(): RTCConfiguration {
    const iceServers = ICE_SERVER_URLS?.map((serverUrl) => {
      if (serverUrl.includes('@')) {
        const [user, url] = serverUrl.split('@')
        const [username, credential] = toStr(user).split(':')
        return { urls: toStr(url), username, credential }
      }
      return { urls: serverUrl }
    })

    return { iceServers }
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
