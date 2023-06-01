import React, { useContext, useState } from "react";
import { roomContext } from "./ContextRoom";
import firebase from "firebase/compat/app";
import { useParams } from "react-router-dom";

function Chat() {
  let { data, db, userName } = useContext(roomContext);
  let { id } = useParams();
  let users = data?.find((doc) => doc.id === id)?.users;
  let user = users?.find((usr) => usr.name === userName);
  const [message, setMessage] = useState("");
  let messages = data?.find((doc) => doc.id == id)?.allmessages;

  const sendmessage = () => {
    if (message.trim() == "") return;
    const d = new Date();
    let date = d.toString();
    let mesagesender = { ...user, content: message, date: date };
    let sender = db
      .collection("callmi")
      .doc(id)
      .update({
        allmessages: firebase.firestore.FieldValue.arrayUnion(mesagesender),
      });
    console.log(mesagesender);
    setMessage("");
  };

  return (
    <div className=" relative chat w-full md:w-[300px] bg-[#eae6ee] mt-auto md:mt-0 md:max-h-screen rounded-md  ">
      <div className="  flex flex-col gap-4 p-2 md:w-[300px] h-full justify-between items-center md:items-start ">
        <p className="text-[2rem] font-bold border-b-2 border-gray-100 text-center w-full text-black ">chat</p>
        <div id="chat-container" className="  flex flex-col gap-2 h-full p-2 w-full  overflow-y-auto scrollbar-hide ">
          {messages?.map((msg, index) => {
            return (
              <div
                className=" relative  rounded-md text-black flex gap-2 items-center "
                key={index}
              >
                <div src="" className=" relative min-w-[35px] min-h-[35px] rounded-[50%] bg-blue-600 text-white text-center py-1 px-2 "><p>{msg?.name?.at(0).toUpperCase()}</p>
                  {/* double check this  part we need  to check  the owner of  this  msg  is  live or  not */}
                  <div className={`min-w-[9px] min-h-[9px] ${msg.live ? 'bg-green-500' : 'bg-red-500'} rounded-[50%] absolute top-[-1px] right-0`}></div>
                </div>
                <p className="w-full  bg-gray-300 text-black p-2 rounded-md ">
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4  w-full ">
          <input
            className=" text-black h-[40px]  w-full outline-none  bg-transparent  px-2  border-b "
            placeholder="write a message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            type="text"
            name=""
            id=""
          />
          <button
            className="bg-[#1acd7f] h-8 rounded-md  "
            onClick={sendmessage}
          >
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
