import React, { useContext, useEffect } from "react";
import { BsFillCameraVideoOffFill, BsCameraVideoFill } from "react-icons/bs";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";
import toast, { Toaster } from 'react-hot-toast';


function LocalVideo({ peer, user, stream }) {
  let { data, db } = useContext(roomContext) ;
  let { id, PeerID } = useParams() ;
  let users = data?.find((doc) => doc.id === id)?.users ;



  const notify = (x) => toast(` ${x} is calling ... `) ;


  useEffect(() => {
    let localvideo = document.getElementById("localvideo");
    localvideo.srcObject = stream ;
  }, []);


  // if  user  got approval from the 
  useEffect(() => {
    if(user?.request == 'valid' && user?.live == true ){
      Join()
    }
  } ,  [user])


  /// request  to  join from admin [ onyl  admin can  accept  or deny  the  call  ]
  const requestJoin = () => {
    let updateusers = users?.map((x) => {
      if (x.admin == true) {
        let callers = x.calling || [];
        return { ...x, calling: [...callers, PeerID] };
      }

      if (x.PeerID == PeerID) {
        return { ...x, request: "request" };
      }
      return x;
    });
    db.collection("callmi").doc(id).update({ users: updateusers });
  };


  /// join call the  users 
  const Join = () => {
    let onlineusers = users?.filter((usr) => usr.live === true);


    onlineusers.forEach((usr) => {
      let call = peer.call(usr.PeerID, stream);

      call.on("stream", (remoteStream) => {
        let replaceElement = document.getElementById(usr.PeerID);
        if (replaceElement) {
          replaceElement.innerHTML = ""; // Clear the existing content
          replaceElement.style.border = "none";
          const videoElement = document.createElement("video");
          videoElement.className = " h-[160px] w-auto rounded-lg border-2 ";
          videoElement.srcObject = remoteStream;
          videoElement.autoplay = true;
          videoElement.muted = true;

          replaceElement.appendChild(videoElement) ; // Append the video element to the parent element
        }
      });

    });

    let newusers = users?.map((x) => {
      if (x.PeerID == user.PeerID) {
        return { ...x, live: true };
      }
      return x;
    });
    db.collection("callmi").doc(id).update({ users: newusers });
  };



  /// accept  the  call
  const accept = async (y) => {
    let newusers = users?.map((x) => {

      if (x.PeerID == y) {
        return { ...x , live: true  ,  request:'valid'};
      }
      
      if ( x.admin == true ) {
        let callers = x.calling.length == 1 ? [] : x.calling.filter((w) => w !== y )
        return { ...x , calling : callers };
      }

      return x;
    });
    console.log(newusers)
    let update  = await db.collection("callmi").doc(id).update({ users: newusers });
    
  }

  /// deny a  call 
  const deny = (y) => {
    let newusers = users?.map((x) => {
      if (x.PeerID == y ) {
        return { ...x, live: false  ,  request:'refuse'};
      }
      return x ;
    });
    db.collection("callmi").doc(id).update({ users: newusers });
  }


  // get disconnected
  const  getdisconnected  = () => {
    peer.destroy();
  }


  return (
    <div className="flex gap-4 items-center p-8 flex-col rounded-md bg-[#12484f]">
      {
        user?.admin && user?.calling.length > 0 && user?.calling.map((appel ,  index) => {
          return <div className="flex gap-4  items-center " key={index}> 
          <p>{users?.find((x) => x.PeerID == appel ).name } is calling... </p>
          <button className="bg-green-600 px-4 rounded-md  capitalize " onClick={()=> {accept(appel)}}>accept</button>
          <button className="bg-red-600 px-4 rounded-md  capitalize " onClick={()=> {deny(appel)}}>deny</button>
         </div>
        })
      }

      <video
        id="localvideo"
        autoPlay
        muted
        className=" w-auto h-[400px] scale-x-[-1] rounded-lg border-white border-4 "
      ></video>
      { !user?.admin && !user?.live && (
        <div
          onClick={()=> {
            requestJoin() ;
          }}
          className="flex gap-2 text-[1rem] bg-green-600 px-8 py-1 rounded-md items-center cursor-pointer "
        >
          <span>join</span>
          <FiPhoneCall size={20} />
        </div>
      )}

    { !user?.admin && user?.live && (
            <div
              onClick={getdisconnected}
              className="flex gap-2 text-[1rem] bg-red-600 px-8 py-1 rounded-md items-center cursor-pointer "
            >
              <span>End call</span>
              <FiPhoneCall size={20} />
            </div>
          )}

      



    </div>
  );
}

export default LocalVideo;
