import React from "react";

function AccessForm() {
  return (
    <div className="w-[350px] shadow-md border flex flex-col gap-6 px-4 py-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="text-[18px] font-bold text-center">Create Room</p>
      <form className="flex flex-col gap-2" action="">
        <label className="" htmlFor="">
          Username:
        </label>
        <input
          className=" bg-transparent border rounded-md text-black h-8 outline-none p-2 text-[14px]"
          type="text"
          name=""
          id=""
        />
        <label className="flex gap-2 justify-between items-center" htmlFor="">
          <span>Room ID:</span>
          <span className="text-[14px]  cursor-pointer hover:text-blue-300">
            Click to copy!
          </span>
        </label>
        <input
          className=" bg-transparent border rounded-md text-black h-8 outline-none p-2 text-[14px]"
          type="text"
          name=""
          id=""
        />
        <span className="text-[12px] text-center text-blue-900">
          * share the room id with your friends so they can join
        </span>
      </form>
      <button className="bg-[#ff8353] text-white px-4 py-1 rounded-md">
        access
      </button>
    </div>
  );
}

export default AccessForm;
