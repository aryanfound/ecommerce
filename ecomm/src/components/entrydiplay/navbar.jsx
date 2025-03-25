import React, { useState } from "react";
import axios from 'axios'
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { useServiceFile } from "../hooks/useServiceFile";
export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const {setService,setgender,setTrending,setcompany}=useServiceFile();
  const menuItems = ["Trending", "Men", "Women", "Kids","Unisex"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      {/* Main Navbar */}
      <div className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <img 
          src="../../../src/assets/cart.jpg" 
          alt="Nike Logo" 
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={()=>{
            window.location.href='/';
          }}
        />

        {/* Menu Items with Hover Effect */}
        <ul className="flex space-x-6 text-base font-semibold relative">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative cursor-pointer hover:text-black"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            onClick={()=>{
                if(item!=='Trending')
                {
                  setgender(item);
                  setTrending(false);
                  setService('AllProducts');
                }
                else{
                  setTrending(true);
                  setgender('any');
                  setcompany('any');
                  setService('AllProducts');
                }
            }}>
              {item}
              {hoveredIndex === index && (
                <span className="absolute left-0 bottom-[-4px] w-full h-[2px] bg-black transition-all duration-300"></span>
              )}
            </li>
          ))}
        </ul>

        {/* Icons + User Options */}
        <div className="flex items-center space-x-4 text-xl text-gray-600">
        
          
          <FaUser className="cursor-pointer hover:text-black" 
            
            onClick={()=>{
              setService('dashboard');
            }}

          ></FaUser>
         
          {/* Join Us & Sign In */}
          <div className="text-sm font-medium space-x-3">
            <span className="cursor-pointer hover:text-black" onClick={
              async ()=>{
                  await axios.get('http://localhost:5000/logout',
                    {withCredentials:true}
                  )
                  window.location.href='/';
              }
            }>Log Out</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
