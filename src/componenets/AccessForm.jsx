import React, { useContext, useEffect, useState } from "react";
import { useLocation  ,  useNavigate   } from 'react-router-dom';
import { nanoid } from 'nanoid'
import { roomContext } from "./ContextAPI";



function AccessForm() {
  let navigate  = useNavigate() ;
  const location = useLocation() ;
  let  path = location.pathname ;
  let [ userInfo ,  setUserInfo ] = useState({  username : '' , roomID:''  })
  let {data , setData , db } = useContext(roomContext)
  let [ roomchecker ,  setRoomchecker ] = useState(false)


  useEffect(() => {
    let roomid  = nanoid() 
    let check  = path === "/create" ? setUserInfo({ admin:false , userID: nanoid() , username : '' , roomID: roomid } ) : setUserInfo({ admin:false , userID: nanoid() , username : '' , roomID: '' } )
  } , [path])



  const  copyRoomID = () => {
    navigator.clipboard.writeText(userInfo.roomID)
    let mybuttom = document.getElementById('copybuttom')
    mybuttom.innerText = 'copied !'
    mybuttom.style.color = "blue"
  }



  const  redirectoRoom = async () => {
    // from here  you can  add  user  to  db  before  redirecting
    let alreadyexist ;
    if( path === '/create'){
      let name  = userInfo.username
      await db.collection("callmi").doc(userInfo.roomID).set({users:[{...userInfo ,  admin:true }]})
      navigate('/accessRoom/' + userInfo.roomID ,  { state : {...userInfo ,  admin:true } } )
      return 
      
    }else{
      // check if  the  room id  already exist  in db  before  you redirect  the  guy
      let x = await db.collection("callmi").doc(userInfo.roomID).get().then((res) => {
        if(res.exists){
          alreadyexist = true
        }else{
          setRoomchecker(true)
          return
        }

      })
    }

    if(alreadyexist){
      let room = data?.find((doc) => doc.id == userInfo.roomID)
      let addnew  = await db.collection("callmi").doc(userInfo.roomID).update({...room ,  users:[...room.users , {...userInfo ,  admin:false }]})
      let name  = userInfo.username
      navigate('/accessRoom/' + userInfo.roomID  , { state :userInfo } )
    }

  
  }



  
  return (
    // style={{"boxShadow": "0 2px 50px lightgray"}}
    <div  className="w-[350px] flex flex-col gap-6 px-4 py-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className=" text-[18px] font-bold  text-center">{ path === '/create'?  "Create Room" : "Join room"}</p>
      <hr />
      <form className="flex flex-col gap-2" action="">
        <label className="" htmlFor="">
          Username:
        </label>
        <input
          className="  bg-transparent border border-gray-400 rounded-sm  h-8 outline-none p-2 text-[14px]"
          type="text"
          name=""
          id=""
          value={userInfo.username}
          onChange={(e)=> {setUserInfo({...userInfo , username:e.target.value })}}
        />
        <label className="flex gap-2 justify-between items-center" htmlFor="">
          <span>Room ID:</span>
          { path == '/create' && <span onClick={copyRoomID} id='copybuttom' className="text-[14px]  cursor-pointer hover:text-blue-300">
            Click to copy!
          </span> }
        </label>
        <input
          className=" bg-transparent border border-gray-400 rounded-sm  h-8 outline-none p-2 text-[14px]"
          type="text"
          name=""
          id=""
          value={ userInfo.roomID }
          disabled={ path === '/create' ? true : false }
          onChange={(e)=> {setUserInfo({...userInfo , roomID:e.target.value })} }
        /> 
        {
          path == "/join" && roomchecker && <span className="text-[12px] text-red-400 text-right w-full">room id not correct!!</span>
        }
        <span className="text-[12px] text-blue-200">
        { path === '/create'?  "* share the room id with your friends" : ""}
        </span>
      </form>
      <button onClick={redirectoRoom} className="bg-[#ff8353] text-white px-4 py-2 rounded-md">
        access
      </button>
    </div>
  );
}

export default AccessForm;
