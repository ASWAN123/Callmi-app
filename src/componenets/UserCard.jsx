import React from 'react'
import { FiPhoneCall } from "react-icons/fi";

function UserCard({ user  , realuser }) {
  return (
    <div  className=" relative w-full h-[160px]  rounded-lg border-2 border-white flex justify-center items-center flex-col gap-2 " id = {user?.PeerID} >
    <p className='  capitalize text-[1.5] bg-blue-600 px-4 py-2 rounded-[50%] font-bold '>{user.name.at(0)}</p>
    <span>{user.name}</span>
  </div>
  )
}

export default UserCard