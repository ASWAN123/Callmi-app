import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { DotWave } from "@uiball/loaders";
import { BsFillMicMuteFill } from 'react-icons/bs';


function Streams({ streams, online , users }) {

  let  [ newStreams ,  setNewStreams ]  = useState() ;

  useEffect(() => {
        function removeDuplicatesById(arr) {
      const seenIds = new Set() ;
      return arr.filter((item) => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id) ;
          return true ;
        }
        return false ;
      }) ;
    }

    setNewStreams(removeDuplicatesById(streams))
  } , [streams])


  // useEffect(() => {
  //   function removeDuplicatesById(arr) {
  //     const seenIds = new Set() ;
  //     return arr.filter((item) => {
  //       if (!seenIds.has(item.id)) {
  //         seenIds.add(item.id) ;
  //         return true ;
  //       }
  //       return false ;
  //     }) ;
  //   }
    
  //   // remove  duplicate  streams since we  we requests usermedia stuff with 2  params we always received 2 stream (video , audio)
  //   let x = removeDuplicatesById(streams)


  //   // check  if  the  user  is  online before rendering  his stream
  //   let v = x.filter((y) => {
  //     if(users.find(m => m.userID == y.peer ).online == true ){
  //       return y
  //     }else{
  //       return
  //     }
  //   })

  //   // only if the original streams are  the same as the filtred  once  then update the  streams array
  //   if(v !== x){
  //     setNewStreams(v)
  //   }




  // } ,  [users ])

  


  return (
    <div className="w-[300px] min-h-full bg-[#040101]/20  relative">
      <h1 className=" rounded-t-md  text-center font-semibold py-2  bg-[#8e57b5] text-[18px] text-white  ">
        Streams
      </h1>

      {/* show  this  to someone  that is  online  */}
      {!newStreams?.length && online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-[#00FFFF]">
            Waiting for your friends to join
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
        </div>
      )}


        {/* show  this  to  someone how  is  offline */}
      { !newStreams?.length && !online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-[#00FFFF]">
            {users?.filter(x => x.online == true)?.length} Online in this room 
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
          <p className="text-[#00FFFF]"> Be the first one to call</p>
        </div>
      )}

      <div className="px-2 ">
        {newStreams?.map((streamUrl) => { 
          
            return (
              <div key={ streamUrl.peer } className="relative" >
                {!users?.find((x) => x.userID == streamUrl.peer)?.video.mic && <BsFillMicMuteFill size={28} color="red" className="absolute top-8 left-2 " /> }
              <ReactPlayer
                key={streamUrl.peer}
                url={streamUrl.stream}
                width="100%"
                playing={users?.find((x) => x.userID == streamUrl.peer)?.video['show']}
                height="240px"
                muted = {!users?.find((x) => x.userID == streamUrl.peer)?.video['mic']}
              />
              </div>
            );
          
        })}
      </div>
    </div>
  );
}

export default Streams;
