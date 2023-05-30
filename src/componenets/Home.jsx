import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import { roomContext } from "./ContextRoom";
import firebase from "firebase/compat/app";
import Chat from "./Chat";
import Videos from "./Videos";

function Home() {
  let { data, db } = useContext(roomContext);


  return (
    <div className=" max-h-screen min-h-screen flex gap-4 justify-between py-2 ">
      <Videos />
      <Chat />
    </div>
  );
}

export default Home;
