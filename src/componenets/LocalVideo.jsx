import React, { useContext, useEffect } from "react";
import { BsFillCameraVideoOffFill, BsCameraVideoFill } from "react-icons/bs";
import { AiOutlineAudioMuted, AiOutlineAudio } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { roomContext } from "./ContextRoom";
import { useParams } from "react-router-dom";
import firebase from "firebase/compat/app";

function LocalVideo({ peer, user, stream, streams, setStreams }) {
  let { data, db } = useContext(roomContext);
  let { id, PeerID } = useParams();
  let users = data?.find((doc) => doc.id === id)?.users;

  useEffect(() => {
    let localvideo = document.getElementById("localvideo");
    localvideo.srcObject = stream;
  }, []);

  // update  the  streams
  const handleStream = (newStream, id) => {
    setStreams((prevStreams) => {
      const updatedStreams = [...prevStreams];
      const userIndex = updatedStreams.findIndex((user) => user.id === id);

      if (userIndex !== -1) {
        // If the user already exists, update their stream
        updatedStreams[userIndex].stream = newStream;
      } else {
        // If the user doesn't exist, add them to the streams array
        updatedStreams.push({ id: id, stream: newStream });
      }

      return updatedStreams;
    });
  };

  /// request  to  join from admin [ onyl  admin can  accept  or deny  the  call  ]
  const requestJoin = () => {
    let updateusers = users?.map((x) => {
      if (x.admin == true) {
        let callers = x.calling || [];
        return { ...x, calling: [...callers, PeerID] };
      }

      if (x.PeerID == PeerID) {
        return { ...x, request: "request" };
      }
      return x;
    });
    db.collection("callmi").doc(id).update({ users: updateusers });
  };

  /// join call all the users
  const Join = () => {
    let onlineusers = users?.filter((usr) => usr.live === true);

    onlineusers.forEach((usr) => {
      let call = peer.call(usr.PeerID, stream);

      call.on("stream", (remoteStream) => {
        handleStream(remoteStream, usr.PeerID);
      });

      call.on("error", (error) => {
        console.log(error, "no media device");
      });
    });

    let newusers = users?.map((x) => {
      if (x.PeerID == user.PeerID) {
        return { ...x, live: true };
      }
      return x;
    });
    db.collection("callmi").doc(id).update({ users: newusers });
  };

  /// accept  the  call
  const accept = (y) => {
    let newusers = users?.map((x) => {
      if (x.PeerID == y) {
        return { ...x, live: true, request: "valid" };
      }

      if (x.admin == true) {
        let callers =
          x.calling.length == 1 ? [] : x.calling.filter((w) => w !== y);
        return { ...x, calling: callers };
      }

      return x;
    });
    let update = db.collection("callmi").doc(id).update({ users: newusers });
  };

  /// deny a  call
  const deny = (y) => {
    let newusers = users?.map((x) => {
      if (x.PeerID == y) {
        return { ...x, live: false, request: "refuse" };
      }

      if (x.admin == true) {
        let callers =
          x.calling.length == 1 ? [] : x.calling.filter((w) => w !== y);
        return { ...x, calling: callers };
      }

      return x;
    });
    let update = db.collection("callmi").doc(id).update({ users: newusers });
    toast("call denied");
  };

  // get disconnected
  const getdisconnected = (y) => {
    // update  user  details  in the  database
    let newusers = users?.map((x) => {
      if (x.PeerID == y) {
        return { ...x, live: false, request: "request" };
      }
      return x;
    });

    let update = db.collection("callmi").doc(id).update({ users: newusers });

    // update  the  streams array
    setStreams((prevStreams) => {
      const updatedStreams = [...prevStreams].filter((x) => x.id !== y);
      // if  there is only one streams left return []
      if (updatedStreams.length == 1) {
        return [];
      }
      return updatedStreams;
    });
  };

  // show  notification  if  call accepted  or  denied and  redirect  to the  call
  useEffect(() => {
    if (user?.request == "valid" && user?.live == true) {
      Join();
    }
  }, [user]);

  return (
    <div className=" flex gap-4 items-center p-2 md:p-8 flex-col rounded-md ">
      {user?.admin &&
        user?.calling.length > 0 &&
        user?.calling.map((appel, index) => {
          return (
            <div
              className="flex gap-4  items-center rounded-lg p-4 md:px-2 md:py-4 bg-blue-300 text-white"
              key={index}
            >
              <p className="capitalize font-bold ">
                {users?.find((x) => x.PeerID == appel).name} is calling...{" "}
              </p>
              <button
                className="bg-green-600 px-4 rounded-md  capitalize text-white "
                onClick={() => {
                  accept(appel);
                }}
              >
                accept
              </button>
              <button
                className="bg-red-600 px-4 rounded-md  capitalize text-white  "
                onClick={() => {
                  deny(appel);
                }}
              >
                deny
              </button>
            </div>
          );
        })}

      <video
        id="localvideo"
        autoPlay
        muted
        className=" md:w-auto md:h-[400px]  scale-x-[-1] rounded-lg border-white border-2 "
      ></video>
      {!user?.admin && !user?.live && (
        <div
          onClick={() => {
            requestJoin();
          }}
          className="flex  gap-2 text-[1rem] bg-green-600 px-8 py-1 rounded-md items-center cursor-pointer  "
        >
          <span>join call</span>
          <FiPhoneCall size={20} />
        </div>
      )}

      {!user?.admin && user?.live && (
        <div
          onClick={() => {
            getdisconnected(user?.PeerID);
          }}
          className="flex gap-2 text-[1rem] bg-red-600 px-8 py-1 rounded-md items-center cursor-pointer "
        >
          <span>End call</span>
          <FiPhoneCall size={20} />
        </div>
      )}
    </div>
  );
}

export default LocalVideo;
