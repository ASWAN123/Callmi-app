import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import { roomContext } from "./ContextRoom";
import firebase from "firebase/compat/app";
import Chat from "./Chat";

function Home() {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();
  let users = data?.find((doc) => doc.id === id)?.users;
  let user = users?.find((usr) => usr.PeerID === PeerID);
  let otherUsers = users?.find((usr) => usr.admin !== true);
  const [peer, setPeer] = useState(null);
  let [streams, setStreams] = useState([]);
  let [incomingcall, setIncomingCall] = useState(null);

  useEffect(() => {
    const newPeer = new Peer(PeerID);
    setPeer(newPeer);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        const videoElement = document.getElementById("localvideo");
        videoElement.srcObject = stream ;
      });
    newPeer.on("call", (call) => {
      setIncomingCall(call);
    });
  }, []);

  const askToJoin = (x) => {
    const localMediaStream = document.getElementById("localvideo").srcObject;
    if (peer) {
      // admin call the  guy
      const call = peer.call( x.PeerID, localMediaStream ); 
      // and waits  for  his  stream after  accepting  the  call add it  the  box of his  id
      call.on("stream", (remoteStream) => {
        const remotevideo = document.getElementById(`${x.PeerID}`) ;
        remotevideo.srcObject = remoteStream ;
      })
      call.on("close", () => {
      });
      call.on("error", (error) => {
      });
    }
  };

  const AceepttheCall = () => {
    if (incomingcall) {
      setIncomingCall(null);
      let newuserCollection = users.map((user)=> {
        if(user.PeerID == PeerID) {
          let updateuser = { ... user ,  live:true }
          return updateuser
        }
        return user
      })
      db.collection('callmi').doc(id).update({users:newuserCollection})
      // if the there is   guy calling
      const localMediaStream = document.getElementById("localvideo").srcObject ;
      incomingcall.answer(localMediaStream) ; // videoElement.srcObject = incomingcall.remoteStream; // set the remote stream

      
        const videoElement = document.getElementById( `${users.find((usr)=> usr.admin == true).PeerID}` ) ;
        incomingcall.on("stream", (remoteStream) => {
          videoElement.srcObject = remoteStream;// if  the  guy accept  the  call show his stream on the  remotevideo  element
        });
      

      

    }
  };

  return (
    <div className=" max-h-screen flex gap-2 justify-between ">
      <div className="w-full flex gap-2   p-2 ">
        <div className="remote-videos w-[25%]   max-h-screen py-8 flex flex-col gap-4 items-center  overflow-y-auto ">
          {users?.map((usr) => {
            return (
              <div
                key={usr.PeerID}
                className=" w-[80%] h-[150px] border flex flex-col justify-center items-center"
              >
                <video
                  className=" w-[80%] h-[150px] "
                  id={usr.PeerID}
                  autoPlay
                  muted
                ></video>
                <p className="py-1  capitalize ">{usr.name}</p>
                {user.admin && (
                  <button
                    onClick={() => {
                      askToJoin(usr);
                    }}
                    className="bg-green-500 px-2 py-1 rounded-md "
                  >
                    ask to join
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="local-videos  w-[80%] flex items-center justify-center flex-col gap-2 p-4 ">
          {incomingcall && (
            <div className="w-[60%] bg-blue-600  rounded-md h-[50px] flex items-center justify-center gap-4 py-2 px-6 ">
              <p className="mr-auto ">Sara is Calling</p>
              <button
                onClick={AceepttheCall}
                className="px-2 py-1 rounded-md  bg-green-500 "
              >
                Accept
              </button>
              <button className="px-2 py-1 rounded-md  bg-red-500 ">
                Deny
              </button>
            </div>
          )}
          <video
            className=" w-[90%] h-full scale-x-[-1] rounded-md "
            id="localvideo"
            autoPlay
            muted
          ></video>

          <div className="  text-white flex gap-4 items-center justify-between ">
            {user?.admin && (
              <button className=" mt-4 bg-blue-500 px-2 py-1 rounded-lg w-[100px]">
                start call
              </button>
            )}
            {!user?.admin && (
              <button className=" mt-4 bg-blue-500 px-2 py-1 rounded-lg w-[100px]">
                join
              </button>
            )}

            {user?.live && (
              <button className=" mt-4 bg-blue-500 px-2 py-1 rounded-lg w-[100px]">
                end call
              </button>
            )}
          </div>
        </div>
      </div>
      <Chat />
    </div>
  );
}

export default Home;
