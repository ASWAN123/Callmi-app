import React, { useContext, useEffect, useState } from "react";
import { BiCopy, BiVideo } from "react-icons/bi";
import { BsFillVolumeDownFill } from "react-icons/bs";
import { AiTwotoneAudio } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import AccessForm from "../AccessForm";
import Header from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Streams from "./Streams";
import { Peer } from "peerjs";
import { roomContext } from "../ContextAPI";

function CreateRoom() {
  const { data, setData, db } = useContext(roomContext);
  const location = useLocation();
  const user = location.state;
  const users = data?.find((y) => y.id == user.roomID)?.users;
  let otherusers = users.filter((x) => x.online && x.userID !== user.userID ) ;
  const room = data?.find((doc) => doc.id == user.roomID)
  let onlineStatus = room?.users?.find((x) => x.userID == user.userID).online
  const [peer , setPeer] = useState()
  const [ mystream , setStream] = useState(null)
  const [streams , setStreams ] = useState([])
  // Show my video on video element
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          const video = document.getElementById("myvideo");
          video.srcObject = stream;
          // setStream(stream)
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }
  }, []);

  // listening for incoming  calls
  useEffect(() =>{
    let newPeer = new Peer(user.userID)
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    newPeer.on('call', function(call) {
      
        getUserMedia({video: true, audio: false}, function(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          console.log({...call})
          call.on('stream', function(remoteStream) {
            // const video = document.getElementById("myvideo2") ;
            // video.srcObject = remoteStream ;
            setStreams((prevList) => [...prevList, remoteStream ])
            console.log('call received')
          });
        }, function(err) {
          console.log('Failed to get local stream' ,err);
        });
      });

    setPeer(newPeer)
  } ,  [])

  // start calling
  const join_call = async () => {
    let otherusers = users.filter((x) => x.online && x.userID !== user.userID ) ;
    console.log(otherusers)
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    getUserMedia({video: true, audio: false}, function(stream) {
      otherusers.forEach(x => {
        var call = peer.call(x.userID , stream) ;
        console.log(x.userID)
        console.log('calling ...' ,  {...call}) ;
        call.on('stream', function(remoteStream) {
          setStreams((prevList) => [...prevList, remoteStream]) ;
        }) ;
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
        
      });
      // [...room.users , {...userInfo , online:false , admin:false }]

  };

  useEffect(() =>{
    if(!streams){
      let newusers = users.map((y) => {
        if( y.userID === user.userID ){
          return {...y ,  online:true}
        }
        return { ...y }
      })
      let switchOnline = db.collection("callmi").doc(user.roomID).update({...room ,  users:newusers})
    }
  } ,  [streams])

  






  return (
    <main className="flex gap-2 justify-center ">
      {/* strames componenets */}
      <Streams  streams ={streams} online={onlineStatus} otherusers = {otherusers} />

      <div className="md:min-w-[640px] max-w-[640px]  flex flex-col  gap-2 items-center  justify-center ">
        <video
          className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
          id="myvideo"
          autoPlay
          muted
        ></video>
        <div className=" w-full bg-[#ab9fbb] py-1 rounded-md flex gap-8 md:gap-12 items-center justify-center ">
          { onlineStatus  && <>
          {/* turn off microphone */}
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <AiTwotoneAudio size={32} color="green" />{" "}
          </div>
          {/* hide video */}
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <BiVideo size={32} color="blue" />{" "}
          </div>
          {/* get disconneted */}
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <IoCall size={32} color="red" />{" "}
          </div></> }
          {!onlineStatus && <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <IoCall size={32} color="green" onClick={join_call} />
          </div> }
        </div>
      </div>
      {/* chat componenet */}
      <Chat />
    </main>
  );
}

export default CreateRoom;
