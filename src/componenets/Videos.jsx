import React, { useContext, useEffect, useRef, useState } from "react";
import LocalVideo from "./LocalVideo";
import Header from "./Header";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import firebase from "firebase/compat/app";
import UserCard from "./UserCard";

function Videos() {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();
  let [stream, setStream] = useState(false);
  let users = data?.find((doc) => doc.id === id)?.users;
  let user = users?.find((usr) => usr.PeerID === PeerID);
  let admin = users?.find((usr) => usr.admin === true);
  let otherUsers = users?.filter((usr) => usr.admin !== true);
  let [peer, setPeer] = useState(null);
  const [streams, setStreams] = useState( [] );





  const handleStream = (newStream, id) => {
    setStreams((prevStreams) => {
      const updatedStreams = [...prevStreams];
      const userIndex = updatedStreams.findIndex((user) => user.id === id);
  
      if (userIndex !== -1) {
        // If the user already exists, update their stream
        updatedStreams[userIndex].stream = newStream;
      } else {
        // If the user doesn't exist, add them to the streams array
        updatedStreams.push({ id: id, stream: newStream });
      }
  
      return updatedStreams;
    });
  };




  
  useEffect(() => {
    let newpeer = new Peer(PeerID);
    setPeer(newpeer);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mystream) => {
        setStream(mystream); // Set the stream in the state

        newpeer.on("call", (call) => {
          call.answer(mystream); // Answer the call by providing the local stream

          call.on("stream", (remoteStream) => {
            handleStream(remoteStream  ,  call.peer)
          });
          call.on("error", (error) => {
            // Handle the error here
            console.error("Error during call:", error);
          });
        });
      })

  }, []);


  return (
    <div className=" w-full flex gap-4 justify-between   flex-col-reverse  md:flex-row-reverse ">
      {/* remote  videos */}
      <div className=" md:w-[30%] rounded-md  flex flex-col w-full  gap-4 p-2 bg-[#eae6ee] "> 
        <h1 className="text-[2rem] border-b-2 border-gray-100 text-center font-bold text-black ">Friends</h1>
        {!!otherUsers && (
          <div className="text-center  md:mt-4 flex gap-2 items-center justify-center text-black mt-auto"> 
            <span className="text-[18px]">{otherUsers.length}</span> 
            <p>joined this room</p>
          </div>
        )}


        {streams?.filter((x) => x.id !== PeerID  ).map((stm) => {
           let target1 = users?.find( x => x.PeerID == stm.id ) 
           if(target1.live === true && user?.live == true  ){
              return <UserCard key={stm.id} myid = {stm.id} stream = {stm.stream} streams={streams} />;
           }
            
          })}

        {!otherUsers && (
          <p className="text-center mt-4">No user joined yet ...</p>
        )}
      </div>
      {/* local video */}
      <div className="md:w-[75%] w-full  min-h-full  flex flex-col gap-2 rounded-md bg-[#eae6ee] ">
        <Header />
        {stream !== false && (
          <LocalVideo peer={peer} user={user} stream={stream} streams={streams} setStreams={setStreams} />
        )}
      </div>
    </div>
  );
}

export default Videos;
