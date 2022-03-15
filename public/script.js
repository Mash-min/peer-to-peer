window.addEventListener('load', (e) => {
  const peer = new Peer()
  let peerList = []
  // Excutes when app starts
  peer.on('open', (id) => {
    document.getElementById('show-peer').innerHTML = `Peer ID: ${id}`
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true
    })
    .then(stream => {
      const video = document.createElement('video')
      addOurVideo(video, stream)
    })
  })

  // Executes when someone calls
  peer.on('call', (call) => {
    console.log(call)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      call.answer(stream)
      call.on('stream', stream => {
        if(!peerList.includes(call.peer)) {
          const video = document.createElement('video')
          addRemoteVideo(video, stream)
          peerList.push(call.peer)
        }
      })
    })  
  })

  // Call someones peer ID
  document.getElementById('call-peer').addEventListener('click', (e) => {
    const remotePeerId = document.getElementById('peerId').value
    callPeer(remotePeerId)
  })

  // Call peer function
  function callPeer(id) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      let call = peer.call(id, stream)
      call.on('stream', stream => {
        if(!peerList.includes(call.peer)) {
          const video = document.createElement('video')
          addRemoteVideo(video, stream)
          peerList.push(call.peer)
        }
      })
    })
    .catch(err => console.log(err))
  }

  // addRemoteVideo
  function addRemoteVideo(video, stream) {
    video.srcObject = stream
    video.play()
    document.getElementById('remote-video').append(video)
  }

  // addUserVideo
  function addOurVideo(video, stream) {
    video.srcObject = stream
    video.play()
    document.getElementById('our-video').append(video)
  }
})