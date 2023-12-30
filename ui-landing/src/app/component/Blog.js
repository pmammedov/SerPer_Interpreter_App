import React, { useState } from "react";
import Image from "next/image";
import Link2 from "next/link";
import * as Unicons from "@iconscout/react-unicons";
import Newsdetail from "./modals/news-detail";

export default function Blog({ news, appLang }) {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const defaultImageUrl = "/images/blog/1.jpg";

  return (
    <>
      <section className="relative md:py-24 py-16" id="blog">
        <div className="container">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
              {appLang === "en" && "News"}
              {appLang === "tr" && "Haberler"}
              {appLang === "ar" && "أخبار"}
            </h6>
            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
              {appLang === "en" && "Latest news"}
              {appLang === "tr" && "Son Haberler"}
              {appLang === "ar" && "أحدث الأخبار"}
            </h3>

            <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
              Launch your campaign and benefit from our expertise on designing
              and managing conversion centered Tailwind CSS html page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 mt-8">
            {news.map((item, key) => (
              <div
                key={key}
                className="blog relative rounded-md shadow shadow-slate-200 dark:shadow-slate-800 overflow-hidden"
              >
                <Image
                  src={item?.image || defaultImageUrl}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: "100%", height: "auto", maxHeight: "200px" }}
                />
                <div className="content p-6">
                  <Link2
                    href="#"
                    className="text-lg hover:text-orange-600 dark:text-white dark:hover:text-orange-600 transition-all duration-500 ease-in-out font-medium"
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
                  </Link2>
                  <p className="text-slate-400 mt-3">
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

                  <div className="mt-5">
                    <button
                      onClick={() => {
                        setOpen(true);
                        setInfo(item);
                      }}
                      className="inline-flex  btn btn-link hover:text-orange-600 dark:hover:text-orange-600 after:bg-orange-600 dark:text-white transition duration-500"
                    >
                      <span>
                        {appLang === "en" && "More..."}
                        {appLang === "tr" && "Devamı... "}
                        {appLang === "ar" && "أكثر..."}
                      </span>
                      <Unicons.UilArrowRight width="16px" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Newsdetail open={open} setOpen={setOpen} info={info} appLang={appLang} />
    </>
  );
}
