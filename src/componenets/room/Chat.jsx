import React from 'react'

function Chat() {
  return (
    <div className="w-[300px] h-[550px]  bg-gray-500/10 relative  rounded-md flex flex-col ">
        <p className="text-center font-semibold py-2 text-[18px] bg-[#8e57b5]  text-white   rounded-t-md  ">
          Chat
        </p>

        <div className="flex gap-4 pt-4 flex-col p-2 w-full  h-full bg-[#040101]/20 overflow-y-auto ">

          <div className=" flex flex-col  gap-2">
            <p className=" bg-purple-800   px-2 p-1 text-white mr-auto w-fit rounded-md ">Hello can  you guys help me ?</p>
            <div className='flex items-center '><hr className='w-full' /><span className="text-[12px] text-center w-full ">2023.06.28-12:45 am</span><hr className='w-full' /></div>
          </div>

          <div className="flex flex-col  gap-2">
          
            <p className=" bg-gray-200  px-2 p-1 text-black w-fit ml-auto rounded-md  ">
              Hi there!
            </p>
            <div className='flex items-center '><hr className='w-full' /><span className="text-[12px] text-center w-full ">2023.06.28-12:45 pm</span><hr className='w-full' /></div>
          </div>
          
          
          <div className="flex flex-col items-center gap-2 ">
            <p className="bg-gradient-to-r from-yellow-400/80 to-red-400/80 px-2 p-1 text-white w-fit text-center rounded-md ">
              Karim ! Joined the room
            </p>
          </div>

        </div>
        <form
          action=""
          className="flex items-center w-full  absolute -bottom-0 "
        >
          <input
            type="text"
            name=""
            id=""
            className=" bg-[#105766]/50 text-white px-2 h-12 r outline-none p-1  w-full placeholder:text-[14px]  placeholder:text-gray-200 "
            placeholder="Type messages here"
          />
          <input
            type="submit"
            className="cursor-pointer h-12  bg-[#105766]/50 text-white  px-2 text-[15px]  "
          />
        </form>
      </div>
  )
}

export default Chat