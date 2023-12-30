import React, { useEffect, useState } from "react";
import * as Unicons from "@iconscout/react-unicons";
import Dropdown from "./dropdown/Dropdown";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../../../i18n.json";
import { Link } from "react-scroll";
// import { useRouter } from "next/router";
import setLanguage from "next-translate/setLanguage";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Switcher({ appLang, setAppLang }) {
  // const router = useRouter();
  const { locales } = i18nConfig;
  const [flag, setFlag] = useState(appLang);

  const handleLanguageChange = (languageCode) => {
    setFlag(languageCode);
    // await setLanguage(languageCode);
    // console.log("i18n", i18n);
    setAppLang(languageCode);
    localStorage.setItem("selectedLanguage", languageCode); // Seçilen dil kodunu localStorage'a kaydet
  };

  const changeMode = (mode, event) => {
    switch (mode) {
      case "mode":
        if (document.documentElement.className.includes("dark")) {
          document.documentElement.className = "light";
        } else {
          document.documentElement.className = "dark";
        }
        break;
      case "layout":
        if (event.target?.innerText === "LTR") {
          document.documentElement.dir = "ltr";
        } else {
          document.documentElement.dir = "rtl";
        }
        break;

      default:
        break;
    }
  };
  return (
    <>
      {/* <!-- Switcher --> */}
      <div className="fixed top-1/4 -right-2 z-3">
        <span className="relative inline-block rotate-90">
          <input
            type="checkbox"
            className="checkbox opacity-0 absolute"
            id="chk"
            onClick={(event) => changeMode("mode", event)}
          />
          <label
            className="label bg-slate-900 dark:bg-white shadow dark:shadow-gray-800 cursor-pointer rounded-full flex justify-between items-center p-1 w-14 h-8"
            htmlFor="chk"
          >
            <Unicons.UilMoon width="20px" className=" text-yellow-500" />
            <Unicons.UilSun width="20px" className=" text-yellow-500" />
            <span className="ball bg-white dark:bg-slate-900 rounded-full absolute top-[2px] left-[2px] w-7 h-7"></span>
          </label>
        </span>
      </div>
      {/* <!-- Switcher --> */}

      {/* <!-- LTR & RTL Mode Code --> */}
      {/* <div className="fixed top-1/3 -right-3 z-50">
        <Link to="#" id="switchRtl">
          <span
            className="py-1 px-3 relative inline-block cursor-pointer rounded-t-md -rotate-90 bg-white dark:bg-slate-900 shadow-md dark:shadow dark:shadow-gray-800 font-semibold rtl:block ltr:hidden"
            onClick={(event) => changeMode("layout", event)}
          >
            LTR
          </span>
          <span
            className="py-1 px-3 relative inline-block cursor-pointer rounded-t-md -rotate-90 bg-white dark:bg-slate-900 shadow-md dark:shadow dark:shadow-gray-800 font-semibold ltr:block rtl:hidden"
            onClick={(event) => changeMode("layout", event)}
          >
            RTL
          </span>
        </Link>
      </div> */}
      {/* <!-- LTR & RTL Mode Code --> */}
      {/* <p>{t("finance")}</p> */}
      <div className="fixed shrink-0 top-1/3 -right-0 z-3 ">
        <Dropdown
          offset={[0, 0]}
          // placement={`${isRtl ? "bottom-start" : "bottom-end"}`}
          btnClassName="block p-2 rounded-full bg-white dark:bg-dark/40 hover:text-primary hover:bg-slate-50 dark:hover:bg-dark/60"
          button={
            flag && (
              <img
                className="h-6 w-6 rounded-full object-cover"
                src={`/images/flags/${flag.toUpperCase()}.svg`}
                alt="flag"
              />
            )
          }
        >
          <ul className="mt-3 flex flex-col gap-3 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white">
            {locales.map((item) => {
              return (
                <li key={item}>
                  <button
                    to="#"
                    // locale={item}
                    type="button"
                    className={`flex w-full hover:text-primary`}
                    onClick={(e) => {
                      handleLanguageChange(item);
                      // router.push(`/${item}`, null, {
                      //   locale: item,
                      // });
                    }}
                  >
                    <img
                      src={`/images/flags/${item.toUpperCase()}.svg`}
                      alt="flag"
                      className="h-6 w-6 p-.5 bg-white  rounded-full object-cover"
                    />
                    {/* <span className="ml-3 text-sm font-light">{item.name}</span> */}
                  </button>
                </li>
              );
            })}
          </ul>
        </Dropdown>
      </div>
    </>
  );
}
