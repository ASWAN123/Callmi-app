import React from "react";
import { BiCopy } from 'react-icons/bi';
import AccessForm from "./AccessForm";




function CreateRoom() {
  return (
    <div className="border-b border-gray-300  shadow-[0_12px_12px_-15px_rgba(0,0,0,0.3)] ">
      {/* header */}
      <div className="p-3 flex justify-between items-center ">
        <div className="">
          <p className="text-[24px] text-[#105766] font-bold">
            Callmi.<span className="text-blue-600">app</span>
          </p>
        </div>

        <div className="flex gap-6 ">
          <button className="bg-[#105766] text-white px-4 py-1 rounded-md">Create room</button>
          <button className="bg-[#ff8353] text-white px-4 py-1 rounded-md">Join room</button>
        </div>
      </div>
      <AccessForm />
      

    </div>
  );
}

export default CreateRoom;
