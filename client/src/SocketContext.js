import React, { createContext, useEffect, useRef, useState } from 'react'
import {io} from 'socket.io-client'
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io("https://videochat-a4zf.onrender.com/")

const ContextProvider = ({children}) => {

  const [stream, setStream] = useState(null);
  const [istream, setIStream] = useState(null);
  const [me, setMe] = useState('');
  const [call, setCall] = useState({}); 
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('')

  const myVideo = useRef({});
  const userVideo = useRef({});
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((currentStream) => {
      setStream(currentStream);
      myVideo.current.srcObject = currentStream;
      console.log('sss', currentStream);
    }).catch((err) => {
      alert(err, "turn on video and audio permission")
    })
    socket.on('me', (id) => {
      setMe(id);
    })
    socket.on('calluser', ({from, name: callerName, signal}) => {
      setCall({
        isReceivedCall: true,
        from,
        name: callerName,
        signal
      });
    })
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    debugger
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    })

    peer.on('signal', (data) => {
      socket.emit('answercall', {
        to: call.from,
        signal: data
      })
    })

    peer.on('stream', (currentStream) => {
      console.log('sss6', currentStream)
      setIStream(currentStream)
      userVideo.current.srcObject = currentStream
    })

    console.log('sss7', call, call.signal)
    peer.signal(call.signal);

    connectionRef.current = peer;
  }

  const callUser = (id) => {
    console.log('sss2', id)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    })

    peer.on('signal', (data) => {
      console.log('sss3', data)
      socket.emit('calluser', {
        userToCall: id,
        signalData: data,
        from: me,
        name
      })
    })

    peer.on('stream', (currentStream) => {
      console.log('sss4', currentStream)
      userVideo.current.srcObject = currentStream
    })

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    })

    connectionRef.current = peer;

  }

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
    window.location.reload();
  }

  return (
    <SocketContext.Provider value={{
      stream,
      istream,
      me,
      call,
      callAccepted,
      callEnded,
      name,
      myVideo,
      userVideo,
      answerCall,
      callUser,
      leaveCall,
      setName
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export {SocketContext, ContextProvider}