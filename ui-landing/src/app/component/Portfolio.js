import React, { useState } from "react";
import Lightbox from "react-18-image-lightbox";
import "react-18-image-lightbox/style.css";
import Link from "next/link";
import Image from "next/image";
import * as Unicons from "@iconscout/react-unicons";

export default function Portfolio({ portfolio, appLang }) {
  const [photoIndex, setActiveIndex] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const defaultImageUrl = "/images/portfolio/1.jpg";

  const handleCLick = (index) => {
    setActiveIndex(index);
    setOpen(true);
  };

  // todo: burada sürekli hata aldım be buşekilde kontrol ederek aşabildim bura tekrar kontrol dilmeli bunlar kaldırılmalı
  if (!portfolio || portfolio.length === 0) {
    return <div>Portföy verisi bulunamadı.</div>;
  }
  if (!Array.isArray(portfolio)) {
    return <div>Portföy verisi uygun bir dizi değil.</div>;
  }

  // eleman sayınını 4'ün alt katına yuvarla
  const adjustedProjectList =
    portfolio.length >= 4
      ? portfolio.slice(0, portfolio.length - (portfolio.length % 4))
      : [...portfolio, ...Array(4 - (portfolio.length % 4)).fill({})];

  // En yeni tarihten en eskiye doğru sıralama yapar
  const sortedProjectList = adjustedProjectList.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
  // Görüntülenmesini istediğiniz maksimum kart sayısı
  const MAX_CARDS_TO_DISPLAY = 28;
  const visibleProjects = sortedProjectList.slice(0, MAX_CARDS_TO_DISPLAY);
  // console.log("visibleProjects", visibleProjects);
  return (
    <>
      {/* Project Start  */}
      <section
        className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800 active"
        id="portfolio"
      >
        <div className="container">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
              {appLang === "en" && "Portfolio"}
              {appLang === "tr" && "Portföy"}
              {appLang === "ar" && "مَلَفّ"}
            </h6>
            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white ">
              {appLang === "en" && "Our Works"}
              {appLang === "tr" && "İşlerimiz"}
              {appLang === "ar" && "مأعمالنا"} &amp;
              {appLang === "en" && "Projects"}
              {appLang === "tr" && "Projelerimiz"}
              {appLang === "ar" && "بروجيليريميز"}
            </h3>

            <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
              Launch your campaign and benefit from our expertise on designing
              and managing conversion centered Tailwind CSS html page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6 mt-8">
            {visibleProjects.map((item, index) => (
              <div key={index}>
                {index < portfolio.length ? (
                  // Gerçek veri
                  <div
                    className={`relative rounded-md shadow-sm overflow-hidden group }`}
                  >
                    <div className="relative rounded-md shadow-sm overflow-hidden group">
                      <Image
                        src={item?.image || defaultImageUrl}
                        className="group-hover:origin-center group-hover:scale-110 group-hover:rotate-3 transition duration-500 max-h-40"
                        alt="workimage"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: "100%", height: "50%" }} // optional
                      />
                      <div className="absolute inset-0 group-hover:bg-black opacity-50 transition duration-500 z-0"></div>
                      <div className="content">
                        <div className="icon absolute z-10 opacity-0 group-hover:opacity-100 top-4 end-4 transition-all duration-500">
                          <Link
                            href="#"
                            onClick={() => handleCLick(index)}
                            className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon rounded-full lightbox"
                          >
                            <Unicons.UilCamera width="17px" />
                          </Link>
                        </div>
                        <div className="absolute z-10 opacity-0 group-hover:opacity-100 bottom-4 start-4 transition-all duration-500 ">
                          <Link
                            href="#"
                            className="h6 text-md font-medium text-white hover:text-orange-600 transition duration-500"
                          >
                            {appLang === "en" &&
                              (item?.title_en.length > 25
                                ? `${item?.title_en.slice(0, 25)}...`
                                : item?.title_en)}
                            {appLang === "tr" &&
                              (item?.title_tr.length > 25
                                ? `${item?.title_tr.slice(0, 25)}...`
                                : item?.title_tr)}
                            {appLang === "ar" &&
                              (item?.title_ar.length > 25
                                ? `${item?.title_ar.slice(0, 25)}...`
                                : item?.title_ar)}
                          </Link>
                          <p className="text-slate-100 tag mb-0">
                            {appLang === "en" &&
                              (item?.content_en.length > 25
                                ? `${item?.content_en.slice(0, 25)}...`
                                : item?.content_en)}
                            {appLang === "tr" &&
                              (item?.content_tr.length > 25
                                ? `${item?.content_tr.slice(0, 25)}...`
                                : item?.content_tr)}
                            {appLang === "ar" &&
                              (item?.content_ar.length > 25
                                ? `${item?.content_ar.slice(0, 25)}...`
                                : item?.content_ar)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="content p-6">
                      <Link
                        href="#"
                        className="h6 text-md font-bold text-gray-500 hover:text-orange-600 transition duration-500"
                      >
                        {appLang === "en" &&
                          (item?.title_en.length > 25
                            ? `${item?.title_en.slice(0, 25)}...`
                            : item?.title_en)}
                        {appLang === "tr" &&
                          (item?.title_tr.length > 25
                            ? `${item?.title_tr.slice(0, 25)}...`
                            : item?.title_tr)}
                        {appLang === "ar" &&
                          (item?.title_ar.length > 25
                            ? `${item?.title_ar.slice(0, 25)}...`
                            : item?.title_ar)}
                      </Link>
                      <p className="text-slate-500 tag mb-0">
                        {appLang === "en" &&
                          (item?.content_en.length > 25
                            ? `${item?.content_en.slice(0, 25)}...`
                            : item?.content_en)}
                        {appLang === "tr" &&
                          (item?.content_tr.length > 25
                            ? `${item?.content_tr.slice(0, 25)}...`
                            : item?.content_tr)}
                        {appLang === "ar" &&
                          (item?.content_ar.length > 25
                            ? `${item?.content_ar.slice(0, 25)}...`
                            : item?.content_ar)}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Boş nesneler
                  // <div
                  //   className={`relative rounded-md shadow-sm overflow-hidden group ${
                  //     visibleProjects.length < 4 ? "hidden" : ""
                  //   }`}
                  // >
                  //   <div className="relative rounded-md shadow-sm overflow-hidden group">
                  //     <Image
                  //       src={item?.image}
                  //       className="group-hover:origin-center group-hover:scale-110 group-hover:rotate-3 transition duration-500"
                  //       alt="workimage"
                  //       width={0}
                  //       height={0}
                  //       sizes="100vw"
                  //       style={{ width: "100%", height: "auto" }} // optional
                  //     />
                  //     <div className="absolute inset-0 group-hover:bg-black opacity-50 transition duration-500 z-0"></div>

                  //     <div className="content">
                  //       <div className="icon absolute z-10 opacity-0 group-hover:opacity-100 top-4 end-4 transition-all duration-500">
                  //         <Link
                  //           href="#"
                  //           onClick={() => handleCLick(index)}
                  //           className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white btn-icon rounded-full lightbox"
                  //         >
                  //           <Unicons.UilCamera width="17px" />
                  //         </Link>
                  //       </div>
                  //       <div className="absolute z-10 opacity-0 group-hover:opacity-100 bottom-4 start-4 transition-all duration-500 ">
                  //         <Link
                  //           href="#"
                  //           className="h6 text-md font-medium text-white hover:text-orange-600 transition duration-500"
                  //         >
                  //           {item?.title_tr}
                  //         </Link>
                  //         <p className="text-slate-100 tag mb-0">
                  //           {item?.content_tr}
                  //         </p>
                  //       </div>
                  //     </div>
                  //   </div>
                  //   <div className="content p-6">
                  //     <Link
                  //       href="#"
                  //       className="h6 text-md font-bold text-gray-500 hover:text-orange-600 transition duration-500"
                  //     >
                  //       {item?.title_tr}
                  //     </Link>
                  //     <p className="text-slate-500 tag mb-0">
                  //       {item?.content_tr}
                  //     </p>
                  //   </div>
                  // </div>
                  <p></p>
                )}
              </div>
            ))}
          </div>
          {isOpen && (
            <Lightbox
              mainSrc={visibleProjects[photoIndex].image}
              imageTitle={
                appLang === "en"
                  ? visibleProjects[photoIndex].title_en
                  : appLang === "tr"
                  ? visibleProjects[photoIndex].title_tr
                  : appLang === "ar"
                  ? visibleProjects[photoIndex].title_ar
                  : ""
              }
              imageCaption={
                appLang === "en"
                  ? visibleProjects[photoIndex].content_en
                  : appLang === "tr"
                  ? visibleProjects[photoIndex].content_tr
                  : appLang === "ar"
                  ? visibleProjects[photoIndex].content_ar
                  : ""
              }
              nextSrc={
                visibleProjects[(photoIndex + 1) % visibleProjects.length]
              }
              prevSrc={
                visibleProjects[
                  (photoIndex + visibleProjects.length - 1) %
                    visibleProjects.length
                ]
              }
              onCloseRequest={() => setOpen(false)}
              onMovePrevRequest={() =>
                setActiveIndex(
                  (photoIndex + visibleProjects.length - 1) %
                    visibleProjects.length
                )
              }
              onMoveNextRequest={() =>
                setActiveIndex((photoIndex + 1) % visibleProjects.length)
              }
              reactModalStyle={{
                overlay: {},
                content: {
                  fontSize: "30px",
                },
              }}

              // overlayClassName="Overlay"
            />
          )}
        </div>
      </section>
      {/* Project End  */}
      {/* <section
        style={{ backgroundImage: `url(${"/images/bg/cta.png"})` }}
        className="py-24 w-full table relative bg-center bg-cover"
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 md:text-3xl text-2xl text-white font-medium">
              Ready to start your next web project now?
            </h3>

            <p className="text-white opacity-50 max-w-xl mx-auto">
              Launch your campaign and benefit from our expertise on designing
              and managing conversion centered Tailwind CSS html page.
            </p>

            <div className="relative mt-10">
              <Link
                href="#"
                className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-md"
              >
                Get Started !
              </Link>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}
