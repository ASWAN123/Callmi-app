import React, { useContext } from 'react'
import firebase from "firebase/compat/app";
import { roomContext } from './ContextRoom';
import { useParams } from 'react-router-dom';

function Call({user}) {
    let { data, db } = useContext(roomContext);
    let { id, PeerID } = useParams();
    let users = data?.find((doc) => doc.id === id)?.users;

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
  };



  return (
    <>
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
    </>
  )
}

export default Call