import { first, isNonEmptyArray, isNullish } from 'utils/general/object'

/** RTCPeerConnection */
let connection: RTCPeerConnection
/** MediaStream */
let mediaStream: MediaStream

export const createOffer = (): string => {
  if (isNullish(connection)) connection = createRTCPeerConnection()
  return JSON.stringify(connection.localDescription)
}

const createRTCPeerConnection = (isOffer = false) => {
  const conn = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.webrtc.ecl.ntt.com:3478' }]
  })

  // ローカルのMediStream
  if (!isNullish(mediaStream)) {
    mediaStream.getTracks().forEach((track) => conn.addTrack(track, mediaStream))
  }

  // MediStreamTrack
  conn.ontrack = (evt) => {
    if (isNonEmptyArray(evt.streams)) playVideo(remoteVideo, first(evt.streams))
  }

  // ICE Candidate
  conn.onicecandidate = (evt) => {
    if (!isNullish(evt.candidate)) sendIceCandidate(evt.candidate)
  }

  // Offer ネゴシエーション
  conn.onnegotiationneeded = async () => {
    if (!isOffer) return
    const offer = await conn.createOffer()
    await conn.setLocalDescription(offer)
  }

  // ICE ステータス 変更時
  conn.oniceconnectionstatechange = () => {
    switch (conn.iceConnectionState) {
      case 'closed':
      case 'failed':
        if (!isNullish(connection)) hangUp()
        break
    }
  }

  return conn
}
