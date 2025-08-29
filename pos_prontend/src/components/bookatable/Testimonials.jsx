import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import event1 from "../../assets/images/events-1.jpg"
import event2 from "../../assets/images/events-2.jpg"
import event3 from "../../assets/images/events-3.jpg"
import event4 from "../../assets/images/events-4.jpg"

const events = [
  {
    background: event1,
  },
  {
    background: event2,
  },
  {
    background: event3,
  },
  {
    background: event4,
  },
];

const TestimonialsSection = () => {
  useEffect(() => {
    new Swiper(".init-swiper", {
      modules: [Pagination, Autoplay],
      loop: true,
      speed: 800,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      slidesPerView: 1, // Mobile
      spaceBetween: 8, // tương ứng với Tailwind 'm-2'
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 8, // ~ Tailwind m-2
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 8,
        },
      },
    });
  }, []);


  return (
    <section id="events" className="py-16 text-white">
      <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
        <div className="swiper init-swiper">
          <div className="swiper-wrapper">
            {events.map((event, index) => (
              <div
                key={index}
                className="!h-[500px] swiper-slide w-full flex flex-col justify-end text-white p-6 bg-cover bg-center rounded-xl  transition-all duration-500 ease-in-out"
                style={{ backgroundImage: `url(${event.background})` }}
              >

              </div>
            ))}
          </div>
          <div className="swiper-pagination mt-4"></div>
        </div>
      </div>
    </section>
  );
};

export { TestimonialsSection };
