import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import gallery1 from "../../assets/images/gallery/gallery-1.jpg"
import gallery2 from "../../assets/images/gallery/gallery-2.jpg"
import gallery3 from "../../assets/images/gallery/gallery-3.jpg"
import gallery4 from "../../assets/images/gallery/gallery-4.jpg"
import gallery5 from "../../assets/images/gallery/gallery-5.jpg"
import gallery6 from "../../assets/images/gallery/gallery-6.jpg"
import gallery7 from "../../assets/images/gallery/gallery-7.jpg"
import gallery8 from "../../assets/images/gallery/gallery-8.jpg"

const galleryImages = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
  gallery7,
  gallery8,
];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-16 bg-gray-100">
      <div className="container mx-auto text-center mb-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Không Gian</h2>
        <p className="text-xl">
          <span className="text-gray-600">Thưởng thức </span>
          <span className="text-yellow-500 font-semibold">Không Gian Tuyệt Vời </span>
        </p>
      </div>

      <div className="container mx-auto" data-aos="fade-up" data-aos-delay="100">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          loop={true}
          speed={600}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {galleryImages.map((img, index) => (
            <SwiperSlide key={index}>
              <a href={img} className="block">
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default GallerySection;
