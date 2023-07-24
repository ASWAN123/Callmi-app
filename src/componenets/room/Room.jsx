import React, { useContext, useEffect, useState } from "react";
import { BiCopy, BiVideo  , BiVideoOff} from "react-icons/bi";
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
import { BsFillMicMuteFill } from 'react-icons/bs';

function CreateRoom() {
  const { data, setData, db } = useContext(roomContext);
  const location = useLocation() ;
  const user = location.state ;
  const users = data?.find((y) => y.id == user.roomID)?.users ;
  let otherusers = users?.filter((x) => x.online == true && x.userID !== user.userID) ;
  const room = data?.find((doc) => doc.id == user.roomID) ;
  let userinfo = room?.users?.find((x) => x.userID == user.userID) ;
  const [peer, setPeer] = useState() ;
  const [streams, setStreams] = useState([]) ;
  const [stream , setStream] = useState()

  // Show my video on video element
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true , audio:false })
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




  // create  the  peer  stuff and  receive  call
  useEffect(() => {
    const initPeer = async (x) => {
      const newPeer = new Peer(x);
      console.log(newPeer)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio:true ,video: true });
        console.log(stream)
        newPeer.on("call", (call) => {
          console.log('call received from' ,  call.peer)
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            console.log('stream recevied ')
            setStreams((prevList) => [...prevList, { stream:remoteStream , 'peer':call.peer }]);
          });
        });
        setPeer(newPeer);
      } catch (err) {
        console.log("Failed to get local stream", err);
      }
    };
    initPeer(user.userID);

    return 
  }, []);
  

  // join the  room
  const join_call = async () => {
    // console.log(otherusers)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({  audio:true, video: true });
      otherusers.forEach((x) => {
        console.log(x ,  'lp')
        const call = peer.call( x.userID , stream ) ;
        console.log('calling....' ,  call) ;
        call.on("stream", (remoteStream) => {
          console.log('recived a  stream')
          setStreams(( prevList ) => [...prevList, { stream :remoteStream , 'peer':call.peer }]);

        });
      });
    } catch (err) {
      console.log("Failed to get local stream", err);
    }

    return 
  };
  

  // // update the  online status for  the  users  if there  is  a  stream

  useEffect( () => {
    if(streams.length > 0 ){
      console.log('changing ')
      let newusers = users.map((x) => {
        if( x.userID == user.userID && x.admin == false){
          return {...x ,  online:true }
        }
        return {...x}
      })
      let update = db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
    }

  }  ,  [streams])
  

  // // end  the  call
  // const callEnd = async () => {
  //   let newusers = users.map((x) => {
  //     if(x.userID == user.userID && x.admin == false){
  //       return {...x ,  online:false }
  //     }
  //     return {...x}
  //   })
  //   setStreams([])
  //   await db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
  // } 

  // // toggle  the  mic
  // const toggleMic = () => {
  //   let newusers = users.map((x) => {
  //     if(x.userID == user.userID){
  //       let order = x.video.mic == true ? false : true ;
  //       return {...x ,  video:{...x.video , mic: order } }
  //     }
  //     return {...x}
  //   })
  //   let w =  db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
  //   return 
  // }

  // // toggle  video display
  // const togglevid = () => {
  //   let newusers = users.map((x) => {
  //     if(x.userID == user.userID){
  //       let order = x.video.show == true ? false : true ;
  //       return {...x ,  video:{...x.video , show: order  } }
  //     }
  //     return {...x}
  //   })
  //   let w =  db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
  //   return
    
  // }



  


  return (
    <main className="flex gap-2 justify-center ">
      {/* strames componenets */}
      <Streams
        streams={streams}
        online={userinfo?.online}
        users={users}
      />

      <div className="md:min-w-[640px] max-w-[640px]  flex flex-col  gap-2 items-center relative justify-center ">
        { users?.find((x) => x.userID == user.userID)?.video.mic == false && <BsFillMicMuteFill size={32} color="red" className="absolute z-10 top-4 left-2 " /> }
        { users?.find((x) => x.userID == user.userID)?.video.show == false && <BiVideoOff size={32} color="red" className="absolute z-10 top-4 left-12 " /> }
        <video
          className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
          id="myvideo"
          autoPlay
          muted
        ></video>
        <div className=" w-full bg-[#ab9fbb] py-1 rounded-md flex gap-8 md:gap-12 items-center justify-center ">
          {/* {userinfo?.online === true && (
            <>

              <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2 relative " onClick={toggleMic}>
                <AiTwotoneAudio size={32} color={userinfo?.video?.mic == false ? "red" : "green"} />
              </button>

              <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2 relative " onClick={togglevid} >
                <BiVideo size={32} color={userinfo?.video?.show == false ? "red" : "blue"  } />
              </button>

              { !user.admin && <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2  " onClick={callEnd}>
                <IoCall size={32} color="red" />
              </button> }
            </>
          )} */}
          { !userinfo?.online && !user.admin && (
            <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
              <IoCall size={32} color="green" onClick={join_call} />
            </div>
          )}
        </div>
      </div>
      {/* chat componenet */}
      <Chat />
    </main>
  );
}

export default CreateRoom;
