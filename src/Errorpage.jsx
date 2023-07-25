import React from "react";
import { FaCarCrash } from "react-icons/fa";
const Errorpage = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <h1 className="text-[28px] ">Oops! Something went wrong.</h1>
      <p>We're sorry, but an error occurred while processing your request.</p>
      <p>Please try again later or contact support for assistance.</p>
      <div className="flex items-center justify-center gap-4">
      <FaCarCrash size={80} color='red'/>
      <FaCarCrash size={80} color='green'/>
      <FaCarCrash size={80} color='yellow'/>
      </div>
    </div>
  );
};

export default Errorpage;
