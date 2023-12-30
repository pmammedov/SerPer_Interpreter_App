"use client"; // This is a client component 👈🏽
import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "react-scroll";

import * as Unicons from "@iconscout/react-unicons";
import Services from "./component/Services";
import About from "./component/About";
import Wrapper from "./component/Wrapper";
import "./assets/css/tailwind.css";
import "./assets/scss/tailwind.scss";
import "./assets/scss/icons.scss";
import Pricing from "./component/Pricing";
import Blog from "./component/Blog";
import Contact from "./component/Contact";
import Footer from "./component/Footer";
import Portfolio from "./component/Portfolio";
import Review from "./component/Testimonial";
import Switcher from "./component/Switcher";
import { getSitesettings } from "@/services/siteSettings";
import { getPortfolio } from "@/services/portfolio";
import { getNews } from "@/services/news";
import { getComments } from "@/services/comments";
import { getLanguages } from "@/services/languages";
import useTranslation from "next-translate/useTranslation";

//
function Index_three() {
  const [isOpen, setMenu] = useState(true);
  const [scroll, setScroll] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const [portfolioData, setPortfolioData] = useState([]);
  const [news, setNews] = useState([]);
  const [comments, setComments] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const { t, lang } = useTranslation("common");
  // console.log("siteSettings", siteSettings);
  const [appLang, setAppLang] = useState(lang);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          siteSettingsResponse,
          portfolioResponse,
          newsResponse,
          commentsResponse,
          languagesResponse,
        ] = await Promise.all([
          getSitesettings(),
          getPortfolio(searchInput),
          getNews(searchInput),
          getComments(searchInput),
          getLanguages(searchInput),
        ]);
        setSiteSettings(siteSettingsResponse.data);
        setPortfolioData(portfolioResponse.data.data);
        setNews(newsResponse.data.data);
        setComments(commentsResponse.data.data);
        setLanguages(languagesResponse.data.data);
        // console.log("*******", siteSettingsResponse.data);
      } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
      }
    };

    fetchData();
  }, [searchInput]);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const toggleMenu = () => {
    setMenu((prevIsOpen) => !prevIsOpen);
  };

  const onSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    // console.log("searchInput", searchInput);
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    // console.log("Aranan değer:", value);
  };

  return (
    <>
      <Wrapper>
        <div>
          <nav className={`${scroll ? "is-sticky" : ""} navbar`} id="navbar">
            <div className="container flex flex-wrap items-center justify-end">
              <Link className="navbar-brand" href="index.html">
                <span className="inline-block dark:hidden">
                  <Image
                    src={"/images/logo-dark-baris.png"}
                    className="l-dark"
                    alt=""
                    width="100"
                    height={10}
                  />
                  <Image
                    src={"/images/logo-light-baris.png"}
                    className="l-light"
                    alt=""
                    width="100"
                    height={10}
                  />
                </span>
                <Image
                  src={"/images/logo-light-baris.png"}
                  className="hidden dark:inline-block"
                  alt=""
                  height={10}
                  width="100"
                />
              </Link>

              <div className="nav-icons flex items-center lg_992:order-2 ms-auto">
                <ul className="list-none menu-social mb-0">
                  <li className="inline ms-1">
                    <a href={siteSettings?.facebook}>
                      <span className="login-btn-primary">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                          <Unicons.UilFacebook />
                        </span>
                      </span>
                      <span className="login-btn-light">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                          <Unicons.UilFacebook />
                          {/* <Unicons.UilWhatsapp /> */}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="inline ms-1">
                    <a href={siteSettings?.twitter}>
                      <span className="login-btn-primary">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                          <Unicons.UilTwitter />
                        </span>
                      </span>
                      <span className="login-btn-light">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                          <Unicons.UilTwitter />
                        </span>
                      </span>
                    </a>
                  </li>
                  <li className="inline ms-1">
                    <a href={siteSettings?.instagram}>
                      <span className="login-btn-primary">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white">
                          <Unicons.UilInstagram />
                        </span>
                      </span>
                      <span className="login-btn-light">
                        <span className="btn btn-sm btn-icon p-1.5 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700">
                          <Unicons.UilInstagram />
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>
                <button
                  type="button"
                  className="collapse-btn inline-flex items-center ms-3 text-dark dark:text-white lg_992:hidden"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Navigation Menu</span>
                  <i className="mdi mdi-menu mdi-24px"></i>
                </button>
              </div>

              <div
                className={`${
                  isOpen === true ? "hidden" : "block"
                } navigation lg_992:order-1 lg_992:flex`}
                id="menu-collapse"
              >
                <ul className="navbar-nav nav-light" id="navbar-navlist">
                  <Link
                    className="nav-item"
                    to="home"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Home"}
                      {appLang === "tr" && "Anasayfa"}
                      {appLang === "ar" && "الصفحة الرئيسية"}
                    </span>
                  </Link>
                  <Link
                    className="nav-item"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                    to="about"
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Abaut us"}
                      {appLang === "tr" && "Hakkımızda"}
                      {appLang === "ar" && "معلومات عنا"}
                    </span>
                  </Link>
                  <Link
                    className="nav-item"
                    to="features"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Services"}
                      {appLang === "tr" && "Hizmetler"}
                      {appLang === "ar" && "خدمات"}
                    </span>
                  </Link>
                  <Link
                    className="nav-item"
                    to="portfolio"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Portfolio"}
                      {appLang === "tr" && "Portföy"}
                      {appLang === "ar" && "مَلَفّ"}
                    </span>
                  </Link>
                  <Link
                    className="nav-item"
                    to="testi"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Comments"}
                      {appLang === "tr" && "Yorumlar"}
                      {appLang === "ar" && "تعليقات"}
                    </span>
                  </Link>
                  {/* <Link
                    className="nav-item"
                    to="pricing"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">Pricing</span>
                  </Link> */}
                  <Link
                    className="nav-item"
                    to="blog"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "News"}
                      {appLang === "tr" && "Haberler"}
                      {appLang === "ar" && "أخبار"}
                    </span>
                  </Link>
                  <Link
                    className="nav-item"
                    to="contact"
                    activeclassname="active"
                    spy={true}
                    smooth={true}
                    duration={500}
                  >
                    <span className="nav-link">
                      {appLang === "en" && "Communication"}
                      {appLang === "tr" && "İletişim"}
                      {appLang === "ar" && "تواصل"}
                    </span>
                  </Link>
                </ul>
              </div>
            </div>
          </nav>
          <section
            style={{ backgroundImage: `url(/images/bg/4.jpg)` }}
            className="py-36 md:py-72 w-full table relative bg-center bg-cover jarallax"
            data-jarallax
            data-speed="0.5"
            id="home"
          >
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="container relative">
              <div className="grid grid-cols-1 text-center">
                <h4 className="text-white lg:text-5xl text-4xl lg:leading-normal leading-normal font-medium mb-7 position-relative">
                  Do you want to change the world?
                </h4>

                <p className="text-white opacity-50 mb-0 max-w-2xl text-lg mx-auto">
                  Launch your campaign and benefit from our expertise on
                  designing and managing conversion centered Tailwind CSS html
                  page.
                </p>

                <div className="text-center subcribe-form mt-4 pt-2">
                  <form type="submit" className="relative mx-auto">
                    <input
                      type="text"
                      id="searchInput"
                      name="searchInput"
                      className="rounded-full bg-white opacity-70 border"
                      placeholder={
                        appLang === "en"
                          ? "Search"
                          : appLang === "tr"
                          ? "Ara"
                          : appLang === "ar"
                          ? "اتصلي"
                          : ""
                      }
                      value={searchInput}
                      // onKeyUp={onSearchInputChange}
                      onChange={onSearchInputChange}
                    />
                    <button
                      type="submit"
                      className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSearch(searchInput);
                      }}
                    >
                      {appLang === "en" && "Search"}
                      {appLang === "tr" && "Ara"}
                      {appLang === "ar" && "اتصلي"}
                      <i className="uil uil-arrow-right"></i>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Hakkımızda */}
          <About
            siteSettings={siteSettings}
            appLang={appLang}
            setAppLang={setAppLang}
          />

          {/* Dil Hizmetleri */}
          <Services languages={languages} appLang={appLang} />

          {/* Portfolio */}
          <Portfolio portfolio={portfolioData} appLang={appLang} />

          {/* Yorum */}
          <Review comments={comments} appLang={appLang} />

          {/* Pricing section */}
          {/* <Pricing /> */}

          {/* Haberler */}
          <Blog news={news} appLang={appLang} />

          {/* Bize Ulaşın */}
          <Contact siteSettings={siteSettings} appLang={appLang} />

          {/* Footer */}
          <Footer siteSettings={siteSettings} />

          {/* Switcher section */}
          <Switcher appLang={appLang} setAppLang={setAppLang} />
        </div>
      </Wrapper>
    </>
  );
}

export default Index_three;
// export default appWithI18Next(Index_three, ni18nConfig);
