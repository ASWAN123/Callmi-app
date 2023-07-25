import React, { useContext, useEffect, useState } from "react";
import { BiCopy, BiVideo  , BiVideoOff} from "react-icons/bi";
import { BsFillVolumeDownFill } from "react-icons/bs";
import { AiTwotoneAudio } from "react-icons/ai";
import { IoCall } from "react-icons/io5";
import { useLocation, useNavigate , Redirect  } from "react-router-dom";
import Chat from "./Chat";
import Streams from "./Streams";
import { Peer } from "peerjs";
import { roomContext } from "../ContextAPI";
import { BsFillMicMuteFill } from 'react-icons/bs';
import Errorpage from "../../Errorpage";

function CreateRoom() {
  const { data, setData, db } = useContext(roomContext);
  let navigate = useNavigate()
  const location = useLocation() ;
  const user = location.state ;

  const users = data?.find((y) => y.id == user.roomID)?.users ;
  let otherusers = users?.filter((x) => x.online == true && x.userID !== user.userID) ;
  const room = data?.find((doc) => doc.id == user.roomID) ;
  let userinfo = room?.users?.find((x) => x.userID == user.userID) ;
  const [peer, setPeer] = useState() ;
  const [streams, setStreams] = useState([]) ;
  const [verstreams, setVerStreams] = useState([])



  // Show my video on video element
  useEffect(() => {
    const getReady = async() => {
      try{
        const stream = await navigator.mediaDevices.getUserMedia({ audio:true ,video: true });
        const video = document.getElementById("myvideo");
        video.srcObject = stream ;
      }catch(error){
        navigate('/error')
      }

    }
    getReady() ;
  }, []);


  // create the pair stuff  and  receive  calls
  useEffect(() => {
    const CreatePeer = async() => {
      const newPeer = new Peer(user.userID);
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true ,video: true });
      newPeer.on('call' , (call) => {
        // console.log('call received')
        call.answer(stream) ;
        call.on('stream' ,  (remoteStream) => {
          // console.log('waiting done' , remoteStream ) 
          setStreams((prev) => [...prev , { stream :remoteStream , 'peer':call.peer }])
        })
      })
      setPeer(newPeer)
    }
    CreatePeer() ;

    return () => {
      if (peer) {
        peer.destroy();
        console.log('Peer connection destroyed.');
      }
    };

  } , [])


  // make calls with all the  members  in the  room
  const join_call = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({  audio:true, video: true });
    // update user online status
      let newusers = users.map(x => {
        if(x.userID == user.userID && x.admin == false){
          return { ...x ,  online:true}
        }
        return {...x}
      })
      await db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers}) 
      otherusers?.forEach((x) => {
        // console.log('calling ... ' , x)
        const call = peer.call( x.userID , stream ) ;
        call.on("stream", (remoteStream) => {
          // console.log('we have received  a  stream' , remoteStream)
          setStreams(( prevList ) => [...prevList, { stream :remoteStream , 'peer':call.peer }]);
        });
      });
  }

  // filter the streams  to keep only  streams for  the  users  that  are  online
  useEffect(() => {
    if(streams.length > 0) {
      let basket = []
      streams.forEach((y) => {
        if( basket.filter((w) => w.peer == y.peer).length < 1 && users.find((x) => x.userID == y.peer).online == true ){
          basket.push(y)
        }
      })

      setVerStreams(basket)

    }
  } ,  [streams])


  // stream of  the  user get deleted as  soon as  they close  the page
  useEffect(() => {
    const updateFirebaseObject = async () => {
      try {
        let newusers = users.map((x) => {
          if( x.userID == user.userID ){
            return {...x ,  online:false }
          }
          return {...x}
        })
        let update = await db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
      } catch (error) {
        console.error('Error updating Firebase object:', error);

      }
    };

    // Add the unload event listener to trigger the update when the user leaves the website
    window.addEventListener('unload', updateFirebaseObject);
    window.addEventListener('beforeunload', updateFirebaseObject);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('unload', updateFirebaseObject);
      window.addEventListener('beforeunload', updateFirebaseObject);
    };

  } ,  [])





  

  // end  the  call
  const callEnd = async () => {
    let newusers = users.map((x) => {
      if(x.userID == user.userID && x.admin == false){
        return {...x ,  online:false }
      }
      return {...x}
    })
    setVerStreams([])
    await db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
  } 

  // toggle  the  mic
  const toggleMic = () => {
    let newusers = users.map((x) => {
      if(x.userID == user.userID){
        let order = x.video.mic == true ? false : true ;
        return {...x ,  video:{...x.video , mic: order } }
      }
      return {...x}
    })
    let w =  db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
    return 
  }

  // toggle  video display
  const togglevid = () => {
    let newusers = users.map((x) => {
      if(x.userID == user.userID){
        let order = x.video.show == true ? false : true ;
        return {...x ,  video:{...x.video , show: order  } }
      }
      return {...x}
    })
    let w =  db.collection('callmi').doc(user.roomID).update({...room ,  users:newusers})
    return
    
  }



  


  return (
    <main className="flex gap-2 justify-center flex-col md:flex-row pb-6 md:pb-0">
      {/* strames componenets */}
      <Streams
        streams={verstreams}
        online={userinfo?.online}
        users={users}
        setVerStreams={setVerStreams}
      />

      <section className="md:min-w-[640px] max-w-[640px]  flex flex-col   gap-2 items-center relative justify-center  order-1 md:order-2">
        { users?.find((x) => x.userID == user.userID)?.video.mic == false && <BsFillMicMuteFill size={32} color="red" className="absolute z-10 top-4 left-2 " /> }
        { users?.find((x) => x.userID == user.userID)?.video.show == false && <BiVideoOff size={32} color="red" className="absolute z-10 top-4 left-12 " /> }
        <video
          className="h-auto scale-x-[-1] md:w-full md:h-[480px] rounded-md"
          id="myvideo"
          autoPlay
          muted
        ></video>
        <div className=" w-full bg-[#ab9fbb] py-1 rounded-md flex gap-8 md:gap-12 items-center justify-center ">
          {userinfo?.online === true && (
            <>

              <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2 relative " onClick={toggleMic}>
                <AiTwotoneAudio size={32} color={userinfo?.video?.mic == false ? "red" : "green"} />
              </button>

              <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2 relative " onClick={togglevid} >
                <BiVideo size={32} color={userinfo?.video?.show == false ? "red" : "blue"  } />
              </button>

              { !user?.admin && <button className=" cursor-pointer border-2 border-white rounded-[50%] p-2  " onClick={callEnd}>
                <IoCall size={32} color="red" />
              </button> }
            </>
          )}
          { !userinfo?.online && !user?.admin && (
            <div className=" cursor-pointer border-2 border-white rounded-[50%] p-2  ">
              <IoCall size={32} color="green" onClick={join_call} />
            </div>
          )}
        </div>
      </section>
      {/* chat componenet */}
      <Chat />
    </main>
  );
}

export default CreateRoom;
