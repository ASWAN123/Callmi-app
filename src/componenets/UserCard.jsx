import React, { useEffect, useRef } from "react";
import { FiPhoneCall } from "react-icons/fi";



function UserCard({ myid , stream , streams }) {
  const videoRef = useRef(null) ;

  useEffect(()=> {
    if(stream){
      videoRef.current.srcObject = stream
    }
     
  },  [stream])

  return (
    <div className="relative w-full min-h-[160px] rounded-lg  border-white flex justify-center items-center flex-col gap-2">
      {/* <span>{myid}</span> */}
      <video  id={myid} ref={videoRef} className=" rounded-lg  w-full border-2 " autoPlay muted></video>
    </div>
  );
}

export default UserCard;
