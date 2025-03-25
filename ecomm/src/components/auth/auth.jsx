import React, { useState } from "react";
import { Login, SignIn } from "./authFunctions";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthFile } from "../hooks/useAuthFile";

export default function AuthPage({setStatus}) {
  const [isLogin, setIsLogin] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  

  const { authorize, setAuthorize, verification, setVerification } = useAuthFile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (isLogin) {
      result = await Login({ email, password, setAuthorize, setVerification,setStatus });
    } else {
      result = await SignIn({ username, email, password, setAuthorize, setVerification ,setStatus});
    }
    function getCookie(name) {
      const cookies = document.cookie.split('; ');
      for (let cookie of cookies) {
          const [key, value] = cookie.split('=');
          if (key === name) {
              console.log('i found value');
              console.log(value);
              return decodeURIComponent(value);
          }
      }
      return null;
  }
  setStatus(getCookie('status'));
  // Usage
   
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? "Sign In" : "Join Us"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="relative mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {!isLogin && (
            <div className="relative mb-4">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}

          <button type="submit" className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-200">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span className="text-black font-semibold">{isLogin ? "Create an account" : "Sign In"}</span>
        </p>
      </div>
    </div>
  );
}