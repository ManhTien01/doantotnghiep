import React, { useState } from "react";
import axios from "axios";
import reservation from "../../assets/images/reservation.jpg";
import api from "../../https";

const BookTableSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    people: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Gửi request đến API
      const response = await api.createReservation(formData);
      setSuccessMsg("Yêu cầu đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất nhé!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        people: "",
        message: "",
      });
    } catch (error) {
      if (error && error.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Đặt bàn thất bại!");
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <section id="book-a-table" className="py-16 bg-white">
      <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đặt Bàn</h2>
        <p className="text-xl">
          <span className="text-gray-600">Tận hưởng tại chỗ với </span>
          <span className="text-yellow-500 font-semibold">Yummy</span>
        </p>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0" data-aos="fade-up" data-aos-delay="100">
          {/* Image */}
          <div
            className="h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url(${reservation})` }}
          ></div>

          {/* Form */}
          <div className="lg:col-span-2 flex items-center bg-gray-50 p-8" data-aos="fade-up" data-aos-delay="200">
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
                <input
                  type="number"
                  name="people"
                  placeholder="# người"
                  value={formData.people}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
              </div>

              <textarea
                name="message"
                rows="5"
                placeholder="Lời nhắn"
                value={formData.message}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded w-full"
              ></textarea>

              <div className="text-center">
                {loading && <div className="text-gray-500">Đang gửi...</div>}
                {errorMsg && <div className="text-yellow-500">{errorMsg}</div>}
                {successMsg && <div className="text-green-600">{successMsg}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-500/75 text-white font-semibold px-6 py-2 rounded"
                >
                  Đặt bàn
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookTableSection;
