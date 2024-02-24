import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, deleteDoc, doc, getDoc, getDocs} from 'firebase/firestore'
import { auth, db } from "../firebase-config";
import '../styles/Chat.css';

export const Chat = (props) => {
  const {room} = props;

  const [newMessage,setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [userList, setUserList] = useState();

  const messagesRef = collection(db, 'messages');
  const usersRef = collection(db, 'roomUsers');

  let hasRan = false;
  useEffect(() => {
    const queryMessages = query(messagesRef, where('room', '==', room), orderBy('createdAt'));
     const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({...doc.data(), id: doc.id });
      });
      messages.reverse();
      setMessages(messages);
    });

    const queryUsers = query(usersRef, where('room', '==', room), orderBy('createdAt'));
    const userLoad = onSnapshot(queryUsers, (snapshot) => {
      let users = [];
      snapshot.forEach((doc) => {
        users.push({...doc.data(), id: doc.id });
      });
      users.reverse();
      setUserList(users);
    });

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

    return () => unsuscribe(), userLoad();
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
    const queryUsers = query(collection(db, 'roomUsers'), where('users', '==', `Anonymous(${auth.currentUser.uid.slice(0,4)})`))

    const docSnap = await getDocs(queryUsers);
    docSnap.forEach((doc) => {
      console.log(doc.data())
      deleteDoc(doc.ref);
    });

    console.log('closing');

    return ;
  }

  return (
    <div className="chat-app">
      <div className="message-display">
        <div className="header"> <p className="welcome-text">Welcome to {room.toUpperCase()}!</p></div>
        <div className="messages"> 
          {messages.map((message) =>(
            <div className="message" key={message.id}>
              <span className="user">{message.user + ':'} </span>
              {message.text}
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
          {/* {userList.map((user) =>(
            <div className="user-name-elem" key={user.id}>
              <span className="user-name">{user.user} </span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}