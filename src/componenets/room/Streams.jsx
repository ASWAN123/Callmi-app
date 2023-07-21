import React from "react";
import ReactPlayer from "react-player";
import { DotWave } from "@uiball/loaders";

function Streams({ streams, online , otherusers }) {
  return (
    <div className="w-[300px] min-h-full bg-[#040101]/20  relative">
      <h1 className=" rounded-t-md  text-center font-semibold py-2  bg-[#8e57b5] text-[18px] text-white  ">
        Streams
      </h1>

      {/* show  this  to someone  that is  online  */}
      {!!streams && online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-[#00FFFF]">
            Waiting for your friends to join
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
        </div>
      )}


        {/* show  this  to  someone how  is  offline */}
      {!online && (
        <div className="flex flex-col gap-2 items-center absolute top-1/2 left-1/2 translate-x-[-50%] -translate-y-[50%] ">
          <p className="px-4 text-center mt-2 text-[#00FFFF]">
            {otherusers.filter(x => x.online == true).length} Online in this room 
          </p>
          <DotWave size={38} speed={1} color="Aqua" />
          <p className="text-[#00FFFF]"> Be the first one to call</p>
        </div>
      )}

      <div className="px-2 ">
        {streams.map((streamUrl, index) => {
          console.log(streamUrl);
          return (
            <ReactPlayer
              key={index}
              url={streamUrl}
              width="100%"
              playing={true}
              height="240px"
            />
          );
        })}
      </div>
    </div>
  );
}

export default Streams;
