import React from "react";
import { useState } from "react";
import logo from "../assets/logo.jpeg";
import bell from "../assets/Bell.png";
import logout from "../assets/Log-out.png";
import pentool from "../assets/Pen-tool.png";
import book from "../assets/Book-open.png";

const Navbar = () => {
  return (
    <div className="min-h-screen">
      <TopBar />
      <div className=" flex flex-1 h-full justify-end">
        <Sidebar />
      </div>
    </div>
  );
};

export default Navbar;
// 1950 : 100
//19,50 : 1

export const TopBar = () => {
  return (
    <div className="w-full h-[42px] bg-dark p-10 relative flex items-center justify-around text-yellow font-inter font-bold ">
      <div className="w-40 h-20  flex items-center justify-between gap-8">
        <img src={logo} className="w-16" />
        Autograder
      </div>
      <div className="w-40 h-20  flex items-center">Webtech Network</div>
      <div className="w-40 h-20  flex items-center">Suporte</div>
      <Switcher />
    </div>
  );
};

export const Sidebar = () => {
  return (
    <div className="absolute top-0  h-full bg-dark w-22 p-5 flex flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-8">
        <div class="relative inline-flex items-center justify-center w-16 h-16 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 cursor-pointer">
          <span class="font-medium text-gray-600 dark:text-gray-300">RC</span>
        </div>
        <div className="flex flex-col justify-around gap-16 h-1/3 ">
          <div className="w-7 h-7 cursor-pointer hover:scale-110">
            <img src={bell} alt="" />
          </div>

          <div className="w-7 h-7 cursor-pointer hover:scale-110">
            <img src={book} alt="" />
          </div>

          <div className="w-7 h-7 cursor-pointer hover:scale-110">
            <img src={pentool} alt="" />
          </div>
        </div>
      </div>

      <div className="w-7 h-7 cursor-pointer hover:scale-110">
        <img src={logout} alt="" />
      </div>
    </div>
  );
};

const Switcher = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box block h-8 w-14 rounded-full ${
              isChecked ? "bg-gray-300" : "bg-yellow"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              isChecked ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};
