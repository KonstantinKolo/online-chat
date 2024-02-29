import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, deleteDoc, doc, getDoc, getDocs, FieldValue } from 'firebase/firestore'
import { auth, db } from "../firebase-config";
import '../styles/Chat.css';
import { setRoomExp } from "../App";

let windowClosed = false;

export const Chat = (props) => {
  const {room} = props;

  const [newMessage,setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [userList, setUserList] = useState([]);

  const messagesRef = collection(db, 'messages');
  const usersRef = collection(db, 'roomUsers');
  

  const userListFunction = async() => {
    const q = query(collection(db, "roomUsers"), where("room", "==", room));

    const querySnapshot = await getDocs(q);
    let users = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      users = [...users,doc.data().users]
    });
    setUserList(users)
  }
  
  let hasRan = false;
  useEffect(() => {
    const queryMessages = query(messagesRef, where('room', '==', room), orderBy('createdAt'));
     const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        // const docHours = new Date(doc.data().createdAt.seconds * 1000);
        // const currTime = new Date().toLocaleDateString();
        // console.log(currTime)
        messages.push({...doc.data(), id: doc.id });
      });
      messages.reverse();
      setMessages(messages);
    });

    userListFunction();
    // console.log(userList)

    const asyncFunc = async() => {
      await addDoc(usersRef, {
        room,
        users: `Anonymous(${auth.currentUser.uid.slice(0,4)})`,
        createdAt: serverTimestamp(),
      });
    }

    if(!hasRan)
      asyncFunc();

    hasRan = true;

    return () => unsuscribe();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!newMessage) return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: `Anonymous(${auth.currentUser.uid.slice(0,4)})`,
      room,
    });

    setNewMessage("");
  };

  window.onbeforeunload = async function() {
    await deleteUser();
    windowClosed = true;
    
    console.log('closing');

    return '';
  }
  const deleteUser = async() => {
    const queryUsers = query(collection(db, 'roomUsers'), where('users', '==', `Anonymous(${auth.currentUser.uid.slice(0,4)})`));
  
    const docSnap = await getDocs(queryUsers);
    docSnap.forEach((doc) => {
      console.log(doc.data());
      deleteDoc(doc.ref);
    });
  }

  useEffect(() => {
    // Define your function to be executed periodically
    const periodicFunction = async() => {
      // Code goes here
      if(windowClosed){
        console.log('Running periodically...');
        await addDoc(usersRef, {
          room,
          users: `Anonymous(${auth.currentUser.uid.slice(0,4)})`,
          createdAt: serverTimestamp(),
        });
        windowClosed = false;
      }
      userListFunction();
    };

    // Set up the interval to run the function every 5 seconds (5000 milliseconds)
    const intervalId = setInterval(periodicFunction, 5000);

    // Clean up the interval when the component is unmounted or when the dependencies change
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures that the effect runs only once on mount

  const leaveRoom = async() => {
    await deleteUser();

    setRoomExp(null);
  }

  return (
    <div className="chat-app">
      <div className="message-display">
        <div className="header"> <p className="welcome-text">Welcome to {room.toUpperCase()}!</p></div>
        <div className="messages"> 
          {messages.map((message) =>(
            <div className="message" key={message.id}>
              <div className="user-info">
                <span className="user">{message.user + ':'} </span>
                {message.createdAt ? 
                  <div className="time-text">{new Date(message.createdAt.seconds * 1000).toLocaleDateString()}</div> 
                  : console.log('date not loaded')}
                {message.createdAt ?
                  <div className="time-text">{new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}</div> 
                  : console.log('time not loaded')}
              </div>
              <div className="text">{message.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="message-write">
        <div className="message-write-welcome">Message to send:</div>
        <form onSubmit={handleSubmit} className="new-message-form">
          <textarea
          className="new-message-input" 
          placeholder="Type your message here..."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}></textarea>

          <button type="submit" className="send-button">Send Message</button>
        </form>
      </div>

      <div className="gap-element-col"></div>
      <div className="gap-element-row"></div>

      <div className="users-list">
        <div className="user-welcome-text">
          <p className="user-wel-p">Users in this chat:</p>
        </div>
        <div className="user-names">
          {userList.map((user) =>(
            <div className="user-name-elem" key={user.id}>
              <span className="user-name">{user} </span>
            </div>
          ))}
        </div>
      </div>

      <div
      className='leave-room'
      onClick={leaveRoom}
      >Leave Room</div>
    </div>
  );
}