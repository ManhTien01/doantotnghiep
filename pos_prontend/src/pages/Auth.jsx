import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";

const Auth = () => {

  useEffect(() => {
    document.title = "POS | Auth"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Left Section: Background Image */}
      <div className="relative hidden lg:flex w-full lg:w-2/3 items-center justify-center">
        <img
          src={restaurant}
          alt="Restaurant"
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-[#000000]/50"></div>

        <blockquote className="absolute bottom-10 px-8 text-2xl italic text-white text-center max-w-xl">
        Hãy đến với chúng tôi để thưởng thức những món ăn đặc sắc, từ ẩm thực truyền thống Việt Nam đến các món Âu tinh tế.
          <span className="block mt-4 text-yellow-400">- Tran Manh Tien -</span>
        </blockquote>
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/3 min-h-screen bg-[#1a1a1a] px-6 sm:px-10 flex flex-col justify-center">

        <h2 className="text-4xl sm:text-4xl text-center font-bold text-yellow-400 ">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </h2>
        <Link to="/booking" className="m-4 font-solid text-yellow-400/75 text-2xl text-center">Yummy.</Link>

        <div className="space-y-6 mt-3">
          {isRegister ? (
            <Register setIsRegister={setIsRegister} />
          ) : (
            <Login />
          )}
        </div>

        <div className="flex justify-center mt-8">
          <p className="text-sm text-[#ababab]">
            {isRegister ? "Bạn đã có tài khoản?" : "Bạn chưa có tài khoản?"}{" "}
            <span
              onClick={() => setIsRegister(!isRegister)}
              className="text-yellow-400 font-semibold hover:underline cursor-pointer"
            >
              {isRegister ? "Đăng nhập" : "Đăng ký "}
            </span>
          </p>
        </div>
      </div>
    </div>



  );
};

export default Auth;