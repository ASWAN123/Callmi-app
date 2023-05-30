import React, { useContext, useEffect, useState } from "react";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import Header from "./Header";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";
import { Peer } from "peerjs";
import firebase from "firebase/compat/app";
import UserCard from "./UserCard";

function Videos() {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();
  let [stream, setStream] = useState(false);
  let users = data?.find((doc) => doc.id === id)?.users;
  let user = users?.find((usr) => usr.PeerID === PeerID);
  let admin = users?.find((usr) => usr.admin === true);
  let otherUsers = users?.filter((usr) => usr.admin !== true);
  let [peer, setPeer] = useState(null);
  let [otherStreams, setOtherStreams] = useState([]);

  useEffect(() => {
    let newpeer = new Peer(PeerID);
    setPeer(newpeer);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((mystream) => {
        setStream(mystream); // Set the stream in the state

        newpeer.on("call", (call) => {
          call.answer(mystream); // Answer the call by providing the local stream

          call.on("stream", (remoteStream) => {
            let replaceElement = document.getElementById(call.peer);
            if (replaceElement) {
              replaceElement.innerHTML = ""; // Clear the existing content
              replaceElement.style.border = "none";
              const videoElement = document.createElement("video");
              videoElement.srcObject = remoteStream;
              videoElement.className = " h-[160px] w-auto rounded-lg border-2 ";
              videoElement.autoplay = true;
              videoElement.muted = false;

              replaceElement.appendChild(videoElement); // Append the video element to the parent element
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }, []);

  return (
    <div className=" w-full flex gap-4 justify-between ">
      {/* remote  videos */}
      <div className="w-[25%] rounded-md  flex flex-col gap-4 p-2 bg-[#0f5860]">
        {!!otherUsers && (
          <div className="text-center mt-4 flex gap-2 items-center justify-center ">
            <span className="text-[18px]">{otherUsers.length}</span>
            <p>joined this room</p>{" "}
          </div>
        )}

        {users
          ?.filter((usr) => usr.PeerID !== PeerID)
          .map((x) => {
            return <UserCard key={x.PeerID} user={x} realuser={user} />;
          })}

        {!otherUsers && (
          <p className="text-center mt-4">No user joined yet ...</p>
        )}
      </div>
      {/* local video */}
      <div className="w-[75%] bg-[#12484f] flex flex-col gap-2 rounded-md ">
        <Header />
        {stream !== false && (
          <LocalVideo peer={peer} user={user} stream={stream} />
        )}
      </div>
    </div>
  );
}

export default Videos;
