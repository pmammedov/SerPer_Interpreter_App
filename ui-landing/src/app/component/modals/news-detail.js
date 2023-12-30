import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-scroll";
import Image from "next/image";
import ModalVideo from "react-modal-video";

const Newsdetail = ({ open, setOpen, info, appLang }) => {
  const cancelButtonRef = useRef(null);
  // console.log(siteSettings);
  // console.log("appLang detail", appLang);
  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="fixed left-0 top-0 z-[1055]  h-full w-full overflow-y-auto overflow-x-hidden outline-none">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {appLang === "en" && "News"}
                          {appLang === "tr" && "Haber"}
                          {appLang === "ar" && "أخبار"}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="lg:col-span-8">
                            <div className=" rounded-md  bg-white dark:bg-slate-900">
                              <section
                                className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
                                id="about"
                              >
                                <div className="container mx-auto">
                                  <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-2 gap-10 items-center">
                                    <div className="lg:col-span-5">
                                      <div className="relative">
                                        <Image
                                          src={info?.image || ""}
                                          className="rounded-lg shadow-lg relative"
                                          alt=""
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                          style={{
                                            width: "100%",
                                            height: "auto",
                                          }} // optional
                                        />
                                        {/* <div className="absolute bottom-2/4 translate-y-2/4 start-0 end-0 text-center">
                                          <Link
                                            to="#"
                                            onClick={() =>
                                              setOpenModVideo(true)
                                            }
                                            className="lightbox h-20 w-20 rounded-full shadow-lg shadow-slate-100 dark:shadow-slate-800 inline-flex items-center justify-center bg-white dark:bg-slate-900 text-orange-600 cursor-pointer"
                                          >
                                            <i className="mdi mdi-play inline-flex items-center justify-center text-2xl"></i>
                                          </Link>
                                        </div> */}
                                      </div>
                                    </div>
                                    {/* end col */}

                                    <div className="lg:col-span-7">
                                      <div className="lg:ms-7">
                                        <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
                                          {appLang === "en" && info?.title_en}
                                          {appLang === "tr" && info?.title_tr}
                                          {appLang === "ar" && info?.title_ar}
                                        </h6>
                                        <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
                                          {appLang === "en" && info?.title_en}
                                          {appLang === "tr" && info?.title_tr}
                                          {appLang === "ar" && info?.title_ar}
                                        </h3>
                                        <p className="text-slate-400 dark:text-slate-300 max-w-2xl mx-auto">
                                          {appLang === "en" && info?.content_en}
                                          {appLang === "tr" && info?.content_tr}
                                          {appLang === "ar" && info?.content_ar}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className=" sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    className="btn mt-3 text-white rounded-md h-11 justify-center flex items-center bg-orange-800 hover:bg-orange-900 border-orange-800 hover:border-orange-900"
                                    onClick={() => setOpen(false)}
                                    ref={cancelButtonRef}
                                  >
                                    {appLang === "en" && "Close"}
                                    {appLang === "tr" && "Kapat"}
                                    {appLang === "ar" && "يلغي"}
                                  </button>
                                </div>
                              </section>

                              {/* <!-- End --> */}
                              {/* <ModalVideo
                                channel="youtube"
                                isOpen={openModVideo}
                                videoId="S_CGed6E610"
                                onClose={() => setOpenModVideo(false)}
                              /> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default Newsdetail;
