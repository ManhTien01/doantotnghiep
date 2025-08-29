import React from "react";

const events = [
  {
    title: "Custom Parties",
    price: "$99",
    description:
      "Quo corporis voluptas ea ad. Consectetur inventore sapiente ipsum voluptas eos omnis facere. Enim facilis veritatis id est rem repudiandae nulla expedita quas.",
    background: "assets/img/events-1.jpg",
  },
  {
    title: "Private Parties",
    price: "$289",
    description:
      "In delectus sint qui et enim. Et ab repudiandae inventore quaerat doloribus. Facere nemo vero est ut dolores ea assumenda et. Delectus saepe accusamus aspernatur.",
    background: "assets/img/events-2.jpg",
  },
  {
    title: "Birthday Parties",
    price: "$499",
    description:
      "Laborum aperiam atque omnis minus omnis est qui assumenda quos. Quis id sit quibusdam. Esse quisquam ducimus officia ipsum ut quibusdam maxime. Non enim perspiciatis.",
    background: "assets/img/events-3.jpg",
  },
  {
    title: "Wedding Parties",
    price: "$899",
    description:
      "Laborum aperiam atque omnis minus omnis est qui assumenda quos. Quis id sit quibusdam. Esse quisquam ducimus officia ipsum ut quibusdam maxime. Non enim perspiciatis.",
    background: "assets/img/events-4.jpg",
  },
];

const EventsSection = () => {
  return (
    <section id="events" className="py-16">
      <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
        <div className="swiper init-swiper">
          <div className="swiper-wrapper">
            {events.map((event, index) => (
              <div
                key={index}
                className="swiper-slide event-item flex flex-col justify-end text-white p-6 bg-cover bg-center rounded-xl h-96"
                style={{ backgroundImage: `url(${event.background})` }}
              >
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <div className="text-lg font-semibold bg-black bg-opacity-50 px-2 py-1 mt-2 inline-block">{event.price}</div>
                <p className="mt-2 bg-black bg-opacity-50 p-2 rounded-md text-sm">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
          <div className="swiper-pagination mt-4"></div>
        </div>
      </div>
    </section>
  );
};

export { EventsSection };
