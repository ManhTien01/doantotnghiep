import { useDispatch } from "react-redux";
import api from "../https";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.getUserData(); // gọi đúng hàm trong api object
    
        const { _id, name, email, phone, role } = data.data; // lấy thông tin từ data trả về
        dispatch(setUser({ _id, name, email, phone, role }));
      } catch (error) {
        dispatch(removeUser());
        // In ra lỗi chi tiết nếu có response
        console.error(error?.message || error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;