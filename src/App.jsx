import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Auth } from './components/Auth'

import Cookies from 'universal-cookie'
import { Chat } from './components/Chat';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase-config'

import smilyFace from '../public/smily-face.png'
import closeWindow from '../public/close-window.png'

const cookies = new Cookies();

export let setRoomExp;

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);
  setRoomExp = setRoom;

  const roomInputRef = useRef(null);

  const signUserOut = async() => {
    await signOut(auth);
    cookies.remove('auth-token');
    setIsAuth(false);
    setRoom(null);
  }

  if(!isAuth){
    return (
      <div>
        <Auth setIsAuth={setIsAuth}/>
      </div>
    )
  }

  return(
    <> 
      {room ? (
      <Chat room={room}/> 
      ) : ( 
      <div className='room'>
        <div className='room-window'>
          <div className='window-top-line'>
            <img className='window-emoji' src={smilyFace}></img>
            <div className='window-top-line-text'>Chatter</div>
            <div 
            style={{ backgroundImage: `url(${closeWindow})` }}
            className='window-close'></div>
          </div>

          <label className='enter-text'>Enter Room Name:</label>
          <input className='enter-input' ref={roomInputRef} />
          <button className='enter-button' onClick={()=> setRoom(roomInputRef.current.value)}> Enter Chat</button>
        </div>
      </div> 
      )}

      <div className='sign-out'>
        <div className='sign-out-div' onClick={signUserOut}> Sign Out </div>
      </div>
    </>
  );
}

export default App
