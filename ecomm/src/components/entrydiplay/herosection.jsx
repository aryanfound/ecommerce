import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import React from "react";
import "swiper/css";
import "swiper/css/pagination";
import '../../index.css';

export default function HeroSection() {
  const slides = [
    {
      image: "../../../src/assets/slide1.png",
      title: "AIR MAX DN8",
      subtitle: "Exploration 1 of 8: Kobbie Mainoo by Gabriel Moses",
    },
    {
      image: "../../../src/assets/slide2.png",
      title: "NIKE RUNNING",
      subtitle: "Unleash your speed with our latest collection",
    },
    {
      image: "../../../src/assets/slides3.png",
      title: "BASKETBALL ESSENTIALS",
      subtitle: "Gear up for the court with the best performance shoes",
    },
  ];

  return (
    <div className="w-full h-screen mt-[80px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 7000, disableOnInteraction: false }} // Increased delay
        speed={1200} // Slower transition speed
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="h-full w-full bg-cover bg-center flex items-center justify-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="p-6 text-center bg-transparent">
                <h2 className="text-4xl font-bold text-white">{slide.title}</h2>
                <p className="mt-2 text-lg text-white">{slide.subtitle}</p>
                <button className="mt-4 px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all">
                  Shop
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
