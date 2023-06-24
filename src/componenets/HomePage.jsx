import React from 'react'
import { useNavigate } from "react-router-dom";


function HomePage() {
  let navigate = useNavigate()



  const redirect =() => {
    navigate('/room')

  }
  return (
    <div className='w-full flex flex-col items-center gap-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '>
        <p className='text-[40px] text-center md:text-6xl text-[#105766] font-bold'>Connect with my <span className=' capitalize text-[#ff8353]'>family</span></p>
        <div className='mx-auto flex gap-4 flex-wrap  justify-center'>
            <img className='rounded-[50%] w-[100px] h-[100px] border-4  border-[#B0DAFF] ' src="./images/naser1.png" alt="" />
            <img className='rounded-[50%] w-[100px] h-[100px] ' src="https://www.nicepng.com/png/full/856-8561250_profile-pic-circle-girl.png" alt="" />
            <img className='rounded-[50%] w-[100px] h-[100px] border-4 border-gray-800' src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80" alt="" />
            <img className='rounded-[50%] w-[100px] h-[100px] border-4 border-[#FD8A8A]' src="https://www.nicepng.com/png/full/182-1829287_cammy-lin-ux-designer-circle-picture-profile-girl.png" alt="" />
            <div className='rounded-[50%] w-[100px] h-[100px] border-4 border-[#ff8353] flex items-center justify-center'><span className='text-[30px] text-orange-400'>+</span></div>
        </div>
        <div className='flex flex-col gap-12 items-center'>
        <p className='text-[18px] md:text-[20px] text-[#105766] font-bold text-center px-2'>keep the face of your family members rolling in your brain</p>
        <button className='px-8 py-2 text-[18px] text-white rounded-[25px] bg-[#105766] uppercase  font-semibold ' onClick={redirect}>Continue</button>
        </div>
    </div>
  )
}

export default HomePage