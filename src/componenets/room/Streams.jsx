import React from "react";

function Streams({streams}) {



  return (
    <div className="w-[300px] min-h-full bg-[#040101]/20  ">
      <p className=" rounded-t-md  text-center font-semibold py-2  bg-[#8e57b5] text-[18px] text-white  ">
        Streams
      </p>
      <div>
        {
          streams?.map((x) =>{
            return <video src={x} ></video>
          })
        }
      </div>
    </div>
  );
}

export default Streams;
