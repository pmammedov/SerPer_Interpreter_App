"use client"; // This is a client component 👈🏽
import React from "react";
import Image from "next/image";
import Link from "next/link";
import * as Unicons from "@iconscout/react-unicons";
import "tiny-slider/dist/tiny-slider.css";
import Slider from "react-slick";

export default function Services({ languages, appLang }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  // console.log("languages", languages);

  return (
    <>
      {/* Start */}
      <section id="features" className="relative md:py-24 py-16">
        <div className="container lg mx-auto">
          {/*<div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 pb-8 items-center">*/}
          {/*  <div>*/}
          {/*    <h6 className="text-orange-600 text-base font-medium uppercase mb-2">*/}
          {/*      What We Do ?*/}
          {/*    </h6>*/}
          {/*    <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white md:mb-0">*/}
          {/*      Perfect Solution For Your <br /> Business*/}
          {/*    </h3>*/}
          {/*  </div>*/}

          {/*  <div>*/}
          {/*    <p className="text-slate-400 dark:text-slate-300 max-w-xl">*/}
          {/*      Launch your campaign and benefit from our expertise on designing*/}
          {/*      and managing conversion centered Tailwind CSS html page.*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="grid grid-cols-1 pb-8 mt-3 text-center">
            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
              {appLang === "en" && "LANGUAGES SERVICED"}
              {appLang === "tr" && "Hizmet Verilen Diller"}
              {appLang === "ar" && "اللغات المتوفرة"}
            </h6>
            {/*<h3 className="mb-4 md:text-2xl text-base font-medium dark:text-white">*/}
            {/*  Digital System For Our Business*/}
            {/*</h3>*/}
          </div>
          <Slider {...settings}>
            {languages.map((el, index) => (
              <div className="tiny-slide" key={index}>
                <div className="lg:flex lg:p-0 flex items-start rounded-md  shadow-slate-200 dark:shadow-slate-700 bg-white dark:bg-slate-900 overflow-hidden m-2">
                  <Image
                    className=" w-24 h-24 lg:w-[8rem] lg:h-auto lg:rounded-lg rounded-full mx-auto"
                    src={el.image}
                    alt=""
                    width="384"
                    height="512"
                  />
                  <div className=" item-center pt-6 lg:p-6 text-center lg:text-left space-y-4">
                    <div>
                      <span className="text-orange-600 block mb-1">
                        {/* {el.name_tr} */}
                        {appLang === "en" && el.name_en}
                        {appLang === "tr" && el.name_tr}
                        {appLang === "ar" && el.name_ar}
                      </span>
                      {/*<span className="text-slate-400 text-sm dark:text-white/60 block">*/}
                      {/*  {el.designation}*/}
                      {/*</span>*/}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {/*<div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">*/}
          {/*  {team.map((item, key) => {*/}
          {/*    const Icon = item.Icon;*/}
          {/*    return (*/}
          {/*      <div*/}
          {/*        key={key}*/}
          {/*        className={`features p-6 ${*/}
          {/*          key % 2 === 0*/}
          {/*            ? "hover:shadow-xl hover:shadow-slate-100 dark:hover:shadow-slate-800"*/}
          {/*            : "shadow-xl shadow-slate-100 dark:shadow-slate-800"*/}
          {/*        } transition duration-500 rounded-3xl mt-8`}*/}
          {/*      >*/}
          {/*        <div className="w-20 h-20 bg-orange-600/5 text-orange-600 rounded-xl text-3xl flex align-middle justify-center items-center shadow-sm">*/}
          {/*          <Icon width="30px" height="30px" />*/}
          {/*        </div>*/}

          {/*        <div className="content mt-7">*/}
          {/*          <Link*/}
          {/*            href="#"*/}
          {/*            className="text-lg hover:text-orange-600 dark:text-white dark:hover:text-orange-600 transition-all duration-500 ease-in-out font-medium"*/}
          {/*          >*/}
          {/*            {item.title}*/}
          {/*          </Link>*/}
          {/*          <p className="text-slate-400 mt-3">{item.subtext}</p>*/}

          {/*          <Link*/}
          {/*            href="#"*/}
          {/*            className="mt-5 inline-flex  btn btn-link hover:text-orange-600 dark:hover:text-orange-600 after:bg-orange-600 dark:text-white transition duration-500"*/}
          {/*          >*/}
          {/*            <span>Read More</span>*/}
          {/*            <Unicons.UilArrowRight width="16px" />*/}
          {/*          </Link>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    );*/}
          {/*  })}*/}
          {/*</div>*/}
        </div>

        {/*<div className="container md:mt-24 mt-16">*/}
        {/*  <div className="grid grid-cols-1 pb-8 text-center">*/}
        {/*    <h6 className="text-orange-600 text-base font-medium uppercase mb-2">*/}
        {/*      Work Process*/}
        {/*    </h6>*/}
        {/*    <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">*/}
        {/*      Digital System For Our Business*/}
        {/*    </h3>*/}

        {/*    <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">*/}
        {/*      Launch your campaign and benefit from our expertise on designing*/}
        {/*      and managing conversion centered Tailwind CSS html page.*/}
        {/*    </p>*/}
        {/*  </div>*/}

        {/*  <div className="grid grid-cols-1 mt-8">*/}
        {/*    <div className="timeline relative">*/}
        {/*      <div className="timeline-item">*/}
        {/*        <div className="grid sm:grid-cols-2">*/}
        {/*          <div className="">*/}
        {/*            <div className="duration date-label-left ltr:float-right rtl:float-left md:me-7 relative">*/}
        {/*              <Image*/}
        {/*                src={"/images/svg/design-thinking.svg"}*/}
        {/*                className="h-64 w-64"*/}
        {/*                alt=""*/}
        {/*                width={64}*/}
        {/*                height={64}*/}
        {/*              />*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className="mt-4 md:mt-0">*/}
        {/*            <div className="event event-description-right ltr:float-left rtl:float-right ltr:text-left rtl:text-right md:ms-7">*/}
        {/*              <h5 className="text-lg dark:text-white mb-1 font-medium">*/}
        {/*                Strategy*/}
        {/*              </h5>*/}
        {/*              <p className="timeline-subtitle mt-3 mb-0 text-slate-400">*/}
        {/*                The generated injected humour, or non-characteristic*/}
        {/*                words etc. Cum sociis natoque penatibus et magnis dis*/}
        {/*                parturient montes, nascetur ridiculus mus. Donec quam*/}
        {/*                felis,*/}
        {/*              </p>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}

        {/*      <div className="timeline-item mt-5 pt-4">*/}
        {/*        <div className="grid sm:grid-cols-2">*/}
        {/*          <div className="md:order-1 order-2">*/}
        {/*            <div className="event event-description-left ltr:float-left rtl:float-right ltr:text-right rtl:text-left md:me-7">*/}
        {/*              <h5 className="text-lg dark:text-white mb-1 font-medium">*/}
        {/*                Development*/}
        {/*              </h5>*/}
        {/*              <p className="timeline-subtitle mt-3 mb-0 text-slate-400">*/}
        {/*                The generated injected humour, or non-characteristic*/}
        {/*                words etc. Cum sociis natoque penatibus et magnis dis*/}
        {/*                parturient montes, nascetur ridiculus mus. Donec quam*/}
        {/*                felis,*/}
        {/*              </p>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className="md:order-2 order-1">*/}
        {/*            <div className="duration duration-right md:ms-7 relative">*/}
        {/*              <Image*/}
        {/*                src={"/images/svg/coding.svg"}*/}
        {/*                className="h-64 w-64"*/}
        {/*                alt=""*/}
        {/*                width={64}*/}
        {/*                height={64}*/}
        {/*              />*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}

        {/*      <div className="timeline-item mt-5 pt-4">*/}
        {/*        <div className="grid sm:grid-cols-2">*/}
        {/*          <div className="mt-4 mt-sm-0">*/}
        {/*            <div className="duration date-label-left ltr:float-right rtl:float-left md:me-7 relative">*/}
        {/*              <Image*/}
        {/*                src={"/images/svg/office-desk.svg"}*/}
        {/*                className="h-64 w-64"*/}
        {/*                alt=""*/}
        {/*                width={64}*/}
        {/*                height={64}*/}
        {/*              />*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*          <div className="mt-4 mt-sm-0">*/}
        {/*            <div className="event event-description-right ltr:float-left rtl:float-right ltr:text-left rtl:text-right md:ms-7">*/}
        {/*              <h5 className="text-lg dark:text-white mb-1 font-medium">*/}
        {/*                Launch*/}
        {/*              </h5>*/}
        {/*              <p className="timeline-subtitle mt-3 mb-0 text-slate-400">*/}
        {/*                The generated injected humour, or non-characteristic*/}
        {/*                words etc. Cum sociis natoque penatibus et magnis dis*/}
        {/*                parturient montes, nascetur ridiculus mus. Donec quam*/}
        {/*                felis,*/}
        {/*              </p>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </section>
    </>
  );
}
