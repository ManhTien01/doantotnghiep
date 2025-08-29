import React, { useState } from 'react'
import { MenuSection } from '../components/bookatable/Menu';
import { TestimonialsSection } from '../components/bookatable/Testimonials';
import BookTableSection from '../components/bookatable/BookTableSection';
import GallerySection from '../components/bookatable/GallerySection';
import ContactSection from '../components/bookatable/ContactSection';
import heroimg from "../assets/images/hero-img.png";
import aboutimg from "../assets/images/about.jpg";
import aboutimg2 from "../assets/images/about-2.jpg";
import HeaderSection from '../components/bookatable/HeaderSection';
import { BiCheckCircle, BiLogoFacebook, BiLogoInstagram, BiLogoTwitter, BiPlayCircle } from 'react-icons/bi';


const BookATable = () => {

    return (
        <div>
            <HeaderSection />
            <div className="main">
                <section id="hero" className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                            {/* Left content */}
                            <div className="lg:w-1/2 text-center lg:text-left">
                                <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-snug">
                                    Món ăn hấp dẫn<br />Phục vụ chuyên nghiệp
                                </h1>
                                <p className="text-gray-600 mb-6">
                                    Chúng tôi luôn đảm bảo cho quý khách trải nghiệm tốt nhất!
                                </p>
                                <div className="flex justify-center lg:justify-start gap-4">
                                    <a
                                        href="#book-a-table"
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg font-medium"
                                    >
                                        Đặt bàn ngay
                                    </a>
                                    <a
                                        href="https://www.youtube.com/"
                                        className="flex items-center gap-2 text-yellow-500 hover:underline"
                                    >
                                        <BiPlayCircle className="text-4xl" />
                                        <span>Xem video</span>
                                    </a>
                                </div>
                            </div>

                            {/* Right image */}
                            <div className="lg:w-1/2">
                                <img
                                    src={heroimg}
                                    alt="Hero Image"
                                    className="w-full max-w-md mx-auto animate-fade-in"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <MenuSection />
                <BookTableSection />


                <section id="about" className="py-16">
                    <div className="container mx-auto px-4">
                        {/* Section Title */}
                        <div className="text-center mb-12" data-aos="fade-up">
                            <h2 className="text-3xl font-bold mb-2">Về Chúng Tôi</h2>
                            <p>
                                <span className="text-yellow-500 font-medium">Tìm hiểu thêm</span>{" "}
                                <span className="font-semibold">Về Chúng Tôi</span>
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
                            {/* Cột trái */}
                            <div className="lg:w-7/12 h-full flex flex-col justify-between" data-aos="fade-up" data-aos-delay="100">
                                <img src={aboutimg} alt="About" className="w-full mb-4" />
                                <div className="border-[3px] border-gray-400 p-4 text-center mt-auto">
                                    <h3 className="text-xl font-bold mb-1">Đặt bàn ngay</h3>
                                    <p className="text-gray-700 text-3xl text-yellow-400">+84 86 555 4917</p>
                                </div>
                            </div>

                            {/* Cột phải */}
                            <div className="lg:w-5/12 h-full" data-aos="fade-up" data-aos-delay="250">
                                <div className="space-y-4 h-full flex flex-col justify-between">
                                    <div>
                                        <p className="italic text-gray-600">
                                            Chúng tôi tự hào mang đến cho thực khách không gian ấm cúng, món ăn ngon miệng và dịch vụ tận tâm mỗi ngày.
                                        </p>
                                        <ul className="space-y-2 mt-4">
                                            <li className="flex items-start gap-2">
                                                <BiCheckCircle className="text-2xl text-yellow-500" />
                                                <span>Nguyên liệu uy tín, tươi sạch, được lựa chọn kỹ lưỡng.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <BiCheckCircle className="text-2xl text-yellow-500" />
                                                <span>Đầu bếp chuyên nghiệp với nhiều năm kinh nghiệm.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <BiCheckCircle className="text-2xl text-yellow-500" />
                                                <span>Không gian sang trọng, phù hợp cho cả gia đình, bạn bè và đối tác.</span>
                                            </li>
                                        </ul>
                                        <p className="text-gray-600 mt-4">
                                            Hãy đến với chúng tôi để thưởng thức những món ăn đặc sắc, từ ẩm thực truyền thống Việt Nam đến các món Âu tinh tế.
                                        </p>
                                    </div>
                                    <div className="relative mt-4">
                                        <img src={aboutimg2} alt="Giới thiệu nhà hàng" className="w-full" />
                                        <a
                                            href="https://www.youtube.com/"
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 p-4 rounded-full shadow-lg"
                                        >
                                            <BiPlayCircle className="text-white text-3xl" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <GallerySection />
                <TestimonialsSection />
                <ContactSection />
                <footer id="footer" className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

                            {/* Address */}
                            <div className="flex gap-4 items-start">
                                <i className="bi bi-geo-alt text-xl text-red-500"></i>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Địa chỉ</h4>
                                    <p>Cầu Giấy</p>
                                    <p>Hà Nội</p>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="flex gap-4 items-start">
                                <i className="bi bi-telephone text-xl text-red-500"></i>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Liên hệ</h4>
                                    <p>
                                        <strong>Số điện thoại:</strong> <span>+84 86 555 4917</span><br />
                                        <strong>Email:</strong> <span>info@example.com</span>
                                    </p>
                                </div>
                            </div>

                            {/* Opening Hours */}
                            <div className="flex gap-4 items-start">
                                <i className="bi bi-clock text-xl text-red-500"></i>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">Thời gian mở cửa</h4>
                                    <p>
                                        <strong>Thứ 2 - Chủ nhật:</strong> <span>11AM - 11PM</span><br />
                                    </p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div>
                                <h4 className="font-bold text-lg mb-4">Theo dõi chúng tôi</h4>
                                <div className="flex gap-4">
                                    <a href="#" className="hover:text-red-500"><BiLogoFacebook className="text-xl"/></a>
                                    <a href="#" className="hover:text-red-500"><BiLogoInstagram className="text-xl"/></a>
                                </div>
                            </div>
                        </div>

                    </div>
                </footer>

            </div>

        </div>
    )
}

export default BookATable