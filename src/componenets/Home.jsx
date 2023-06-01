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
    <div className=" max-h-screen min-h-screen flex gap-2 md:gap-4 md:justify-between p-2 md:px-0 md:py-2 flex-col md:flex-row ">
      <Videos />
      <Chat />
    </div>
  );
}

export default Home;
