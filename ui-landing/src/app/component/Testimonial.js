"use client"; // This is a client component 👈🏽
import React, { useState } from "react";
import "tiny-slider/dist/tiny-slider.css";
import CommentModal from "./modals/comment-modal";
import Slider from "react-slick";

export default function Review({ comments, appLang }) {
  const [open, setOpen] = useState(false);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
  };
  // console.log(comments);
  return (
    <>
      {/* Review Start  */}
      <section
        className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
        id="testi"
      >
        <div className="container">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
              {appLang === "en" && "Comments"}
              {appLang === "tr" && "Yorumlar"}
              {appLang === "ar" && "تعليقات"}
            </h6>
            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
              {appLang === "en" && "Comments From You"}
              {appLang === "tr" && "Sizden Gelen Yorumlar"}
              {appLang === "ar" && "تعليقات منك"}
            </h3>
            {/*<p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">*/}
            {/*  Launch your campaign and benefit from our expertise on designing*/}
            {/*  and managing conversion centered Tailwind CSS html page.*/}
            {/*</p>*/}
          </div>

          <div className="grid grid-cols-1 mt-8 relative">
            <div className="tiny-two-item">
              {/* <TinySlider settings={settings}>
                {review.map((el, index) => (
                  <div className="tiny-slide" key={index}>
                    <div className="lg:flex p-6 lg:p-0 relative rounded-md shadow shadow-slate-200 dark:shadow-slate-700 bg-white dark:bg-slate-900 overflow-hidden m-2">
                      <Image
                        className="w-24 h-24 lg:w-48 lg:h-auto lg:rounded-none rounded-full mx-auto"
                        src={el.profile}
                        alt=""
                        width="384"
                        height="512"
                      />
                      <div className="pt-6 lg:p-6 text-center lg:text-left space-y-4">
                        <p className="text-base text-slate-500 dark:text-slate-200">
                          {" "}
                          " It seems that only fragments of the original text
                          remain in the Lorem Ipsum texts used today. "{" "}
                        </p>

                        <div>
                          <span className="text-orange-600 block mb-1">
                            {el.name}
                          </span>
                          <span className="text-slate-400 text-sm dark:text-white/60 block">
                            {el.designation}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TinySlider> */}
              <Slider {...settings}>
                {comments.map((el, index) => (
                  <div className="tiny-slide" key={index}>
                    <div className="lg:flex p-6 lg:p-0 relative rounded-md shadow shadow-slate-200 dark:shadow-slate-700 bg-white dark:bg-slate-900 overflow-hidden m-2">
                      <div className="pt-6 lg:p-6 text-center lg:text-left space-y-4 h-36">
                        <p className="text-base text-slate-500 dark:text-slate-200">
                          {el.comment.length > 25
                            ? `${el.comment.slice(0, 190)}...`
                            : el.comment}
                        </p>
                        <div>
                          {/*todo:yorum yapanın emali yayınlamalımıyızbu kvkk ya gire bilir kaldırdak daha iyi olur.*/}
                          {/*<span className="text-orange-600 block mb-1">*/}
                          {/*  {el.email}*/}
                          {/*</span>*/}
                          <span className="text-orange-600 text-sm dark:text-white/60 block">
                            {el.first_name} {el.last_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="relative mt-10">
            <button
              // href="#"
              onClick={() => setOpen(true)}
              className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-md"
            >
              {appLang === "en" && "Comment"}
              {appLang === "tr" && "Yorum Yap"}
              {appLang === "ar" && "تعليق"}
            </button>
          </div>
        </div>
        <CommentModal open={open} setOpen={setOpen} appLang={appLang} />
      </section>
    </>
  );
}
