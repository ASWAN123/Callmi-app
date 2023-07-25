import React from 'react'

function HomePage() {
  return (
    <div className='w-full flex flex-col items-center gap-12 absolute  transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
        <p className='text-[40px] text-center md:text-6xl  font-bold pt-8'>Make time for  <span className=' capitalize text-[#ff8353]'>friends</span></p>
        
        <div className='mx-auto flex  gap-4 flex-wrap  justify-center relative'>
            <img className=' rounded-[50%] w-[100px] h-[100px]  shadow-md  ' src="./images/naser1.png" alt="" />
            <img className=' rounded-[50%] w-[100px] h-[100px]  shadow-md ' src="./images/pngfind.com-woman-profile-png-4433119.jpg" alt="" />
            <img className=' rounded-[50%] w-[100px] h-[100px]  shadow-md' src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80" alt="" />
            <img className=' rounded-[50%] w-[100px] h-[100px]  shadow-md ' src="./images/Daco_4739617.png" alt="" />
            <img className=' rounded-[50%] w-[100px] h-[100px]  shadow-md ' src="./images/Daco_5511364.png" alt="" />
            <div className='rounded-[50%] w-[100px] h-[100px]  border-4 border-[#ff8353] flex items-center justify-center'><span className='text-[30px] text-orange-400'>+</span></div>
            
        </div>

        <div className='flex flex-col gap-12 items-center'>
        <p className='text-[18px] md:text-[20px]  font-bold text-center px-2 '>keep the face of your family members rolling in your brain</p>
        </div>
    </div>
  )
}

export default HomePage ;