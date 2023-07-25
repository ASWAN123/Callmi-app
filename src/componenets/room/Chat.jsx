import React from "react";
import { useState } from "react";
import { roomContext } from "../ContextAPI";
import { useContext } from "react";
import firebase from "firebase/compat/app";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Chat() {
  let { data, setData, db } = useContext(roomContext);
  const location = useLocation();
  const user = location.state;
  const room = data?.find((doc) => doc.id == user.roomID);
  const chat = data?.find((doc) => doc.id == user.roomID)?.chat;
  const [msg, setMsg] = useState("");


  const addMessage = async (e) => {
    e.preventDefault();
    if (msg.trim() == "") return;
    setMsg('')
    await db
      .collection("callmi")
      .doc(user.roomID)
      .update({
        ...room,
        chat: firebase.firestore.FieldValue.arrayUnion({
          name: user.username,
          content: msg,
          time: new Date().toISOString().slice(0, 16).replace('T', ' ') ,
          type: "normal",
        }),
      });
    
  };


  useEffect(() => {
    let x = document.getElementById('chat')
    x.scrollTo({ left: 0 , top: 700*chat?.length , behavior: "smooth" })
    
  } ,  [chat])

  return (
    <section className=" w-full  md:w-[300px] h-[550px]  bg-gray-500/10 relative  rounded-md flex flex-col order-3  ">
      <p className="text-center font-semibold py-2 text-[18px] bg-[#8e57b5]  text-white  rounded-t-md  ">
        Chat
      </p>

      <div id='chat' className="flex gap-4 pt-4 flex-col p-2 w-full h-full max-h-[80%] overflow-auto   bg-gradient-to-b from-[#040101]/30 to-[#040101]/5%  ">
        {
          chat?.map((x ,  index) => {


            return (
              <div key={index} >
              {
                x.type == 'joined' &&  <div className={ "flex flex-col items-center gap-2 chat-elem" } key={index}>
                <p className="bg-gradient-to-r from-yellow-400/80 to-red-400/80 px-2 p-1 text-white w-fit text-center rounded-md ">
                  {x.content}
                </p>
              </div>
              }

              {
                x.type == 'normal' && x.name !== user.username && <div className="flex flex-col  gap-2 chat-elem" key={index}>
                   <p className=" bg-gray-200  px-2 p-1 text-black w-fit ml-auto rounded-md  ">
                     {x.content}
                   </p>
                  <div className="flex items-center ">
                     <hr className="w-full" />
                     <span className="text-[11px] text-center w-full ">
                       {x.time}
                     </span>
                     <hr className="w-full" />
                   </div> 
                 </div>
              }

               {
                x.type == 'normal' && x.name === user.username && <div className=" flex flex-col  gap-2 chat-elem" key={index}>
                   <p className=" bg-purple-800   px-2 p-1 text-white mr-auto w-fit rounded-md ">
                     {x.content}
                   </p>
                   <div className="flex items-center ">
                     <hr className="w-full" />
                     <span className="text-[11px] text-center w-full ">
                       {x.time}
                     </span>
                     <hr className="w-full" />
                   </div>
                 </div>
              } 

              </div>
            )


          })

        }

      </div>
      <form
        onSubmit={addMessage}
        action=""
        className="flex items-center w-full  absolute -bottom-0 "
      >
        <input
          type="text"
          className=" bg-[#105766]/50 text-white px-2 h-12 r outline-none p-1  w-full placeholder:text-[14px]  placeholder:text-gray-200 "
          placeholder="Type messages here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <input
          type="submit"
          className="cursor-pointer h-12  bg-[#105766]/50 text-white  px-2 text-[15px]  "
        />
      </form>
    </section>
  );
}

export default Chat;

// players:firebase.firestore.FieldValue.arrayUnion
