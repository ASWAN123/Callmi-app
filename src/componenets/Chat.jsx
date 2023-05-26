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
    <div className=" relative chat w-[300px] mih-h-screen max-h-screen bg-gradient-to-b from-blue-900/50 to-blue-900/80 ">
      <div className=" flex flex-col gap-4 p-4 w-[300px] h-full justify-between  ">
        <p className="text-[2rem] font-bold border-b text-center ">chat</p>
        <div id="chat-container" className="flex flex-col gap-2 h-full p-2   overflow-y-auto scrollbar-hide ">
          {messages?.map((msg, index) => {
            return (
              <div
                className=" relative  rounded-md text-black flex gap-2 items-center "
                key={index}
              >
                <div src="" className=" relative min-w-[30px] min-h-[30px] rounded-[50%] bg-blue-600 text-white text-center py-1 px-2 "><p>{msg.name.at(0).toUpperCase()}</p>
                 {/* double check this  part we need  to check  the owner of  this  msg  is  live or  not */}
                 <div className={`min-w-[8px] min-h-[8px] ${ msg.live ? 'bg-green-500' : 'bg-red-500' } bg-green-500 rounded-[50%] absolute top-[-1px] right-0`}></div>
                </div> 
                <p className="w-full bg-gray-100/50 text-gray-200 p-2 rounded-md ">
                  {msg.content}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4  ">
          <input
            className=" text-white h-[40px] outline-none bg-transparent   border-b "
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
            className="bg-green-500 h-8 rounded-md  "
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
