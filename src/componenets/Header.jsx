import React, { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { GrClose } from 'react-icons/gr';
import { useNavigate , useLocation } from "react-router-dom";



function Header() {
  let [ showmenu ,  setShowMenu ] = useState(false)
  let navigate = useNavigate()
  let location = useLocation()
  let  path  = location.pathname
  const user = location.state;
  
  

  const  redirecToacess  = (order) => {
    if(showmenu === true){
      setShowMenu(false)
    }
    let redirect  = order === 'create' ? navigate( '/create' ) : navigate( '/join' )
  }



  return (
    <nav className="p-3 flex justify-between items-center  #1c0452 border-gray-300  shadow-[0_12px_12px_-15px_rgba(0,0,0,0.3)] shadow-gray-100 mb-6 ">
        <div className="">
        <a href='/' className="text-[20px] md:text-[24px] font-extrabold ">
            Callmi.<span className="">app</span>
        </a>
        <span>{user?.userID}</span>
        </div>

        { !showmenu && !(path.includes('accessRoom')) && <div onClick={()=> {setShowMenu(!showmenu)}} className='md:hidden cursor-pointer '><AiOutlineMenu size={28} /></div> }
        { showmenu && !(path.includes('accessRoom')) && <div onClick={()=> {setShowMenu(!showmenu)}} className='md:hidden cursor-pointer '><GrClose size={28} /></div> }

        {
          showmenu &&  <div className=" flex md:hidden absolute flex-col gap-4 w-[90%] p-4 shadow-2xl border rounded-md bg-[#fcfdfc] z-10 top-[20%] left-1/2 transform -translate-x-1/2 -translate-y-1/2  ">
          <button onClick={()=> {redirecToacess("create")}} className="bg-[#f2f3f2] text-black px-6 py-2 rounded-md">Create room</button>
          <button onClick={()=> {redirecToacess("join")}}   className="bg-[#105766] text-white px-6 py-2 rounded-md">Join room</button>
          </div>
          
        }

        { !(path.includes('accessRoom')) ? <div className=" hidden md:flex gap-6  ">
        <button onClick={()=> {redirecToacess("create")}} className="bg-[#f2f3f2] text-black font-bold md:px-6 py-2 rounded-md">Create room</button>
        <button onClick={()=> {redirecToacess("join")}} className="bg-[#105766] text-white font-bold md:px-6 py-2 rounded-md">Join room</button>
        </div> : <div className='flex gap-8 items-center'>
          <div className='flex gap-4 items-center'>
            <span className='w-[10px] h-[10px] border rounded-[50%] bg-green-500 '></span>
            <p>Online</p>
          </div>
          <div>
            <button className='text-red-400 font-bold px-2 rounded-lg py-1 '>Log out</button>
          </div>
        </div> }
  </nav>
  )
}

export default Header