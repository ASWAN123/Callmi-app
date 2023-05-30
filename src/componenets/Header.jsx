import React, { useContext } from "react";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";

function Header() {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();

  let users = data?.find((doc) => doc.id === id)?.users ;


  return (
    <div>
      <div className="border-b-2 border-gray-100/50 flex justify-between gap-4 px-4 items-cneter text-[2rem] pt-2 ">
        <h1 className="text-[2rem]   "> Marketing Room </h1> <p>01:23</p>
      </div>
      <div className="flex gap-8 mb-2  items-center justify-center ">
        <p>online users : {users?.filter(usr => usr.live === true).length} </p>
        <p>offline users : {users?.filter(usr => usr.live !== true).length} </p>
      </div>
    </div>
  );
}

export default Header;
