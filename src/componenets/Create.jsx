import React, { useContext, useEffect, useState } from "react";
import { Peer } from "peerjs";
import { roomContext } from "./contextRoom";
import { DotWave } from "@uiball/loaders";
import { useNavigate } from "react-router-dom";
import firebase from 'firebase/compat/app' ;
import uuid from "uuid-random";


function Create() {
  let [jname, setJname] = useState("");
  let [cname, setCname] = useState("");
  let [jRoom, setJroom] = useState("");
  let [roomID, setRoomID] = useState("");
  let [toggle, setToggle] = useState(true);
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate()

  let { data, db  , setUserName } = useContext(roomContext);
  


  const generateRoomid = async () => {
    setLoading(true);
    let x = await db.collection("callmi").add({users:[]})
    setRoomID(x.id) ;
    setToggle(false) ;
    setLoading(false) ;
  };

  const Join = async () => {
    if( jname.trim() === "" || jRoom.trim() == '' ) return
    setUserName(jname)
    await db.collection('callmi').doc(jRoom).update({users:firebase.firestore.FieldValue.arrayUnion({ 'name':jname ,  'admin':false , 'PeerID':uuid() })})
    navigate('/room/'+jRoom)
    return
  }

  const Create =async () => {
    if( cname.trim() === "" ) return
    setUserName(cname)
    await db.collection('callmi').doc(roomID).update({users:firebase.firestore.FieldValue.arrayUnion({ 'name':cname ,  'admin':true  , 'PeerID':uuid()  })})
    navigate('/room/'+roomID)
    return
  }

  return (
    <div className=" w-full  md:w-[80%] absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] flex flex-col md:flex-row gap-12 md:gap-6 justify-between items-center text-white p-4">
      <div className="absolute -top-[10%] md:-top-[30%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] ">
        <p className="text-[35px] font-bold text-white">
          call<span className="text-blue-400 uppercase">mi</span>
        </p>
      </div>
      <div className="w-full md:w-[40%] flex flex-col gap-6">
        {/* join */}
        <p className="text-center text-[1.5rem]">Join Room</p>
        <input
          value={jname}
          onChange={(e) => {
            setJname(e.target.value);
          }}
          className="w-full outline-none px-2 py-1 bg-transparent border-b "
          placeholder="Name"
          type="text"
        />
        <input
          value={jRoom}
          onChange={(e) => {
            setJroom(e.target.value);
          }}
          className="w-full outline-none px-2 py-1 bg-transparent border-b "
          placeholder="Room ID"
          type="text"
          name=""
          id=""
        />
        <button onClick={Join} className="px-2 py-1 bg-blue-600 rounded-md font-bold ">
          Join
        </button>
      </div>

      <div className="flex items-center md:flex-col w-full md:w-auto gap-4 md:gap-12 ">
        <hr className="border-1 w-full bg-blue-800 md:rotate-[90deg] md:w-[100px] " />
        <p className="text-[1rem]">OR</p>
        <hr className="border-1 w-full bg-blue-800 md:rotate-[90deg] md:w-[100px] " />
      </div>
      <div className="w-full md:w-[40%] flex flex-col gap-6 ">
        {/* create */}
        {loading && <div className="mx-auto"><DotWave size={47} speed={1} color="white" /></div> }
        {!toggle && <p className="text-center text-[1.5rem]">Create Room</p>}
        {!toggle && (
          <input
            value={cname}
            onChange={(e) => {
              setCname(e.target.value);
            }}
            className="w-full outline-none px-2 py-1 bg-transparent border-b "
            placeholder="Name"
            type="text"
          />
        )}
        {!toggle && (
          <input
            value={roomID}
            onChange={(e) => {
              setRoomID(e.target.value);
            }}
            className="w-full outline-none px-2 py-1 bg-transparent border-b "
            placeholder="Room ID"
            type="text"
            name=""
            id=""
          />
        )}
        {!toggle && (
          <button onClick={Create} className="px-2 py-1 bg-blue-600 rounded-md font-bold ">
            Create
          </button>
        )}
        {toggle && (
          <button
            onClick={generateRoomid}
            className="px-2 py-1 bg-blue-600 rounded-md font-bold "
          >
            Generate Room ID
          </button>
        )}
      </div>
    </div>
  );
}

export default Create;
