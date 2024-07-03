import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Import navigation styles
import { FreeMode, Navigation, Autoplay } from "swiper";
import Course_Card from "./CourseCard";

function Course_Slider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <div className="relative">
          <Swiper
            slidesPerView={2}
            spaceBetween={25}
            loop={true}
            modules={[FreeMode, Navigation, Autoplay]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            
            autoplay={{
              delay: 3500, // 5000 milliseconds = 5 seconds
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            className="max-h-[30rem]"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <Course_Card course={course} Height={"h-[350px]"} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation buttons */}
          <div className="swiper-button-next absolute text-white right-0 top-1/2 transform -translate-y-1/2 lg:-translate-y-[45px] lg:translate-x-9 "></div>
          <div className="swiper-button-prev absolute  text-white left-0 top-1/2 transform -translate-y-1/2 lg:-translate-y-[45px] lg:-translate-x-9 "></div>
        </div>
      ) : (
        <p className="text-xl text-richblack-5">No courses are currently available.</p>
      )}
    </>
  );
}

export default Course_Slider;
