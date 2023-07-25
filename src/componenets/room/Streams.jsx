import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { DotWave } from "@uiball/loaders";
import { BsFillMicMuteFill } from "react-icons/bs";

function Streams({ streams, online, users  , setVerStreams }) {
  let newStreams = streams
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
  } ,  [users])

  useEffect(() => {
    let x = document.getElementById('streams')
    x.scrollTo({ left: 0 , top: 700*streams?.length , behavior: "smooth" })
    console.log(x)
  } ,  [streams])

  

  return (
    <div className="w-[300px] min-h-full bg-gradient-to-b from-[#040101]/30 to-[#040101]/5% relative">
      <h1 className=" rounded-t-md  text-center font-semibold py-2  bg-[#8e57b5] text-[18px] text-white  ">
        Streams
      </h1>

      {/* show  this  to someone  that is  online  */}
      {!newStreams?.length && online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-green-400 font-semibold " >
            Waiting for your friends to join
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
        </div>
      )}

      {/* show  this  to  someone how  is  offline */}
      {!newStreams?.length && !online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-[#00FFFF]">
            {users?.filter((x) => x.online == true)?.length} Online in this room
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
          <p className="text-[#00FFFF]"> Be the first one to call</p>
        </div>
      )}

      <div id='streams' className="p-2  h-[90%]  overflow-auto ">
        {newStreams?.map((streamUrl) => {
          // console.log(users.find((x) => x.userID == streamUrl.peer).online)

            return (
              <div key={streamUrl.peer} className="relative">
                {!users?.find((x) => x.userID == streamUrl.peer)?.video.mic && (
                  <BsFillMicMuteFill
                    size={28}
                    color="red"
                    className="absolute top-8 left-2 "
                  />
                )}
                <ReactPlayer
                  key={streamUrl.peer}
                  url={streamUrl.stream}
                  width="100%"
                  playing={
                    users?.find((x) => x.userID == streamUrl.peer)?.video["show"]
                  }
                  height="215px"
                  muted={
                    !users?.find((x) => x.userID == streamUrl.peer)?.video["mic"]
                  }
                />
              </div>
            );
          

        })}
      </div>
    </div>
  );
}

export default Streams;
