import React, { useContext } from "react";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

function Header() {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();

  let users = data?.find((doc) => doc.id === id)?.users ;


  return (
    <div>
      <div className=" md:border-b-2 border-gray-100 text-black flex justify-between items-center gap-4 px-4 items-cneter text-[2rem] pt-2 ">
        <h1 className="text-[1.5rem] md:text-[2rem] text-[#3e3243] font-bold "> Marketing Room </h1 > 
        <p className=" text-[1rem] text-white bg-[#3e3243] rounded-md px-2  ">01:23</p>
      </div>
      <div className="flex gap-8  md:mt-4  items-center justify-center ">
        <p className="px-2  rounded-md capitalize bg-[#9c82a5] mt-3 ">online users : {users?.filter(usr => usr.live === true).length} </p>
        <p className="px-2  rounded-md capitalize bg-[#9c82a5] mt-3 ">offline users : {users?.filter(usr => usr.live !== true).length} </p>
      </div>
    </div>
  );
}

export default Header;
