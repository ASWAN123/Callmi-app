import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import uuid from "uuid-random";
import { roomContext } from "./contextRoom";
import firebase from "firebase/compat/app";

function Home() {
  let { data, db, userName } = useContext(roomContext);
  let { id } = useParams();
  let users = data?.find((doc) => doc.id == id)?.users;
  // let otherUsers = users?.filter((usr) => usr.name !== userName);
  let user = users?.find((usr) => usr.name == userName);
  const [peer, setPeer] = useState(null);
  const [message, setMessage] = useState('');
  const [pid, setPid] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newPeer = new Peer(user.PeerID);
    newPeer.on('open', function(peerId) {
      setPeer(newPeer);
    });

    // Handle incoming connections from other peers
    newPeer.on('connection', function(conn) {
      console.log('Incoming connection from Peer ID:', conn.peer);
      conn.on('data', function(data) {
        setMessages((prevMessages) => [...prevMessages, data]);
        console.log('Received data from incoming connection:', data);
      });
    });

    // No cleanup function is needed
  }, []);

  // Function to send a message to the other user
  function sendMessage() { 
    if (!peer) return
    const conn = peer.connect(pid);
    conn.on('open', function() {
    //   console.log('Connection with the other user is open');

      // Send the message to the other user
      conn.send(message);
      setMessage('');
      console.log('Sent data:', message);
    });
  }





  




  return (
    <div className="flex flex-col items-center">
      <p>room : {id} </p>
      <p>usrname : {user?.name} </p>
      <div> <span>messages: </span>
        {
          messages.map((msg ,  index) => {
            return <p key={index}>{msg}</p>
          })
        }
      </div>
      <p>peerid :{user.PeerID} </p>

      <div className="flex flex-col gap-6 p-4 ">
        <label htmlFor="">send message </label>
        <input
          type="text"
          placeholder="other peer"
          value={pid}
          onChange={(e) => {
            setPid(e.target.value);
          }}
          className="border-b-red-500 text-black outline-none w-[300px] h-[30px]"
        />
        <input
          type="text"
          value={message}
          placeholder="message  content"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="  outline-none text-black border-b-red-500 w-[300px] h-[30px] "
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-black px-6 py-1"
        >
          send message
        </button>
      </div>
    </div>
  );
}

export default Home;
