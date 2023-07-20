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
  const [peer , setPeer] = useState(null)

  // Show my video on video element
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const video = document.getElementById("myvideo");
          video.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    } else {
      console.error("getUserMedia is not supported in this browser.");
    }
  }, []);

  // Generate peer
  // const peer = new Peer(user.userID);
  useEffect(() =>{
    let newPeer = new Peer(user.userID)
    setPeer(newPeer)
  } ,  [])


  useEffect(() =>{
    console.log('peer changed')
  } ,  [peer])

  const start_call = () => {
    let otheruser = users.find((x) => x.admin == true).userID;
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        console.log('calling ' , otheruser)
        var call = peer.call(otheruser, stream);
        console.log('calling' , call)
        call.on("stream", function (remoteStream) {
          console.log(remoteStream)
          const video = document.getElementById("myvideo2");
          video.srcObject = stream;
          
        });
      },
      function (err) {
        console.log("Failed to get local stream", err);
      }
    );
  };

  
  if(peer){
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    peer.on('call', function(call) {
      getUserMedia({video: true, audio: true}, function(stream) {
        call.answer(stream); 
        call.on('stream', function(remoteStream) {
          const video = document.getElementById("myvideo2");
          video.srcObject = stream;
        });
      }, function(err) {
        console.log('Failed to get local stream' ,err);
      });
    });
  }





  return (
    <main className="flex gap-2 justify-center ">
      {/* strames componenets */}
      {/* <Streams  streams ={streams} /> */}

      <video
        className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
        id="myvideo2"
        autoPlay
      ></video>
      <div className="md:min-w-[640px] max-w-[640px]  flex flex-col  gap-2 items-center  justify-center ">
        <video
          className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
          id="myvideo"
          autoPlay
          muted
        ></video>
        <div className=" w-full bg-[#ab9fbb] py-1 rounded-md flex gap-8 md:gap-12 items-center justify-center ">
          {/* <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <BsFillVolumeDownFill size={34} color="black" />{" "}
          </div>
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <AiTwotoneAudio size={32} color="green" />{" "}
          </div>
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <BiVideo size={32} color="blue" />{" "}
          </div>
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <IoCall size={32} color="red" />{" "}
          </div> */}
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
            <IoCall size={32} color="green" onClick={start_call} />
          </div>
        </div>
      </div>
      {/* chat componenet */}
      <Chat />
    </main>
  );
}

export default CreateRoom;
