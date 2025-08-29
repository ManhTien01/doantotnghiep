import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import api from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => api.login(reqData), // api.login trả về res.data rồi
      onSuccess: (data) => {  // 'data' ở đây chính là res.data
        console.log(data);
        // Nếu data có cấu trúc { data: { _id, name, ... } }, thì bạn vẫn phải lấy tiếp
        // Nhưng tốt nhất backend trả luôn dữ liệu user ở cấp cao nhất
        // Giả sử backend trả về user trực tiếp:
        const { _id, name, email, phone, role } = data; 
    
        dispatch(setUser({ _id, name, email, phone, role }));
        navigate("/");
      },
      onError: (error) => {
        // Có thể error đã được unwrap trong api.js rồi (nhưng nếu không, bạn sửa thêm)
        const message = error?.message || error?.response?.data?.message || "Error occurred";
        enqueueSnackbar(message, { variant: "error" });
      }
    });
    

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Email
          </label>
          <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Mật khẩu
          </label>
          <div className="flex item-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="bg-transparent flex-1 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-md bg-yellow-400 text-gray-900 font-bold"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;