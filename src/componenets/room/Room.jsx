import React, { useEffect } from "react";
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







function CreateRoom() {
  const location = useLocation() ;
  const username = location.state ;
  

  useEffect(() => {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { video: { width: 640, height: 480 } },
        (stream) => {
          const video = document.getElementById("myvideo");
          video.srcObject = stream;
        },
        (err) => {
          console.error(`The following error occurred: ${err.name}`);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  }, []);

  // start connection pair connection

  const peer = new Peer("pick-an-id");
  




  return (
    <main className="flex gap-2 justify-center ">
      {/* strames componenets */}
      <Streams />
      <div className="md:min-w-[640px] max-w-[640px]  flex flex-col  gap-2 items-center  justify-center ">
        <video
          className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
          id="myvideo"
          autoPlay
        ></video>
        <div className=" w-full bg-[#ab9fbb] py-1 rounded-md flex gap-8 md:gap-12 items-center justify-center ">
          <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
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
          </div>
        </div>
      </div>
      {/* chat componenet */}
      <Chat />
    </main>
  );
}

export default CreateRoom;
