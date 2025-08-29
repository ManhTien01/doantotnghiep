import React, { useState } from "react";
import axios from "axios";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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
      // Gọi API
      await axios.post("https://your-api-endpoint.com/api/contact", formData);
      setSuccessMsg("Your message has been sent. Thank you!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMsg("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Liên hệ</h2>
        <p className="text-xl">
          <span className="text-gray-600">Cần hỗ trợ? </span>
          <span className="text-yellow-500 font-semibold">Liên hệ chúng tôi</span>
        </p>
      </div>

      <div className="container mx-auto" data-aos="fade-up" data-aos-delay="100">
        {/* Info Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="200">
            <i className="bi bi-geo-alt text-red-500 text-2xl"></i>
            <div>
              <h3 className="text-lg font-semibold">Địa chỉ</h3>
              <p>Cầu Giấy, Hà Nội</p>
            </div>
          </div>

          <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="300">
            <i className="bi bi-telephone text-red-500 text-2xl"></i>
            <div>
              <h3 className="text-lg font-semibold">Gọi ngay</h3>
              <p>+84 86 555 5917</p>
            </div>
          </div>

          <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="400">
            <i className="bi bi-envelope text-red-500 text-2xl"></i>
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p>info@example.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4" data-aos="fade-up" data-aos-delay="500">
            <i className="bi bi-clock text-red-500 text-2xl"></i>
            <div>
              <h3 className="text-lg font-semibold">Thời gian mở cửa</h3>
              <p>
                <strong>Thứ 2 - Chủ Nhật:</strong> 11AM - 11PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6" data-aos="fade-up" data-aos-delay="600">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ tên"
              required
              className="border px-4 py-2 w-full rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border px-4 py-2 w-full rounded"
            />
          </div>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Tiêu đề"
            required
            className="border px-4 py-2 w-full rounded"
          />
          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder="Lời nhắn"
            required
            className="border px-4 py-2 w-full rounded"
          ></textarea>

          <div className="text-center">
            {loading && <div className="text-gray-500">Đang gửi...</div>}
            {errorMsg && <div className="text-red-500">{errorMsg}</div>}
            {successMsg && <div className="text-green-600">{successMsg}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-yellow-500 hover:bg-yellow-500/75 text-white px-6 py-2 rounded"
            >
              Gửi lời nhắn
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
