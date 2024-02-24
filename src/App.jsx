import { useState, useRef, useEffect } from 'react'
import './App.css'
import { Auth } from './components/Auth'

import Cookies from 'universal-cookie'
import { Chat } from './components/Chat';

import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase-config'

const cookies = new Cookies();

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(null);

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
        <label className='enter-text'>Enter Room Name:</label>
        <input className='enter-input' ref={roomInputRef} />
        <button className='enter-button' onClick={()=> setRoom(roomInputRef.current.value)}> Enter Chat</button>
      </div> 
      )}

      <div className='sign-out'>
        <button className='sign-out-button' onClick={signUserOut}> Sign Out </button>
      </div>
    </>
  );
}

export default App
