import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { auth, db } from "../firebase-config";
import '../styles/Chat.css';

export const Chat = (props) => {
  const {room} = props;
  const [newMessage,setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, 'messages');

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
        <div>Husein L</div>
        <div>Konse</div>
      </div>
    </div>
  );
}