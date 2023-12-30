import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { addComment } from "@/services/comments";

const CommentModal = ({ open, setOpen, appLang }) => {
  const [info, setInfo] = useState({});
  const cancelButtonRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment(info);
      setInfo({});
      setOpen(false);
    } catch (error) {
      console.error("Yorum eklenirken bir hata oluştu:", error);
    }
  };

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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          {appLang === "en" && "Send Comment"}
                          {appLang === "tr" && "Yorum Gönder"}
                          {appLang === "ar" && "إرسال تعليق"}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="lg:col-span-8">
                            <div className=" rounded-md  bg-white dark:bg-slate-900">
                              <form onSubmit={handleSubmit}>
                                <div className="grid lg:grid-cols-12 lg:gap-6">
                                  <div className="lg:col-span-6 mb-5">
                                    <input
                                      name="first_name"
                                      id="first_name"
                                      type="text"
                                      className="form-input"
                                      placeholder={
                                        appLang === "en"
                                          ? "Your name"
                                          : appLang === "tr"
                                          ? "Adınız"
                                          : appLang === "ar"
                                          ? "اسمك"
                                          : ""
                                      }
                                      onChange={handleChange}
                                      value={info.first_name}
                                    />
                                  </div>

                                  <div className="lg:col-span-6 mb-5">
                                    <input
                                      name="last_name"
                                      id="last_name"
                                      type="text"
                                      className="form-input"
                                      placeholder={
                                        appLang === "en"
                                          ? "Surname"
                                          : appLang === "tr"
                                          ? "Soyadınız"
                                          : appLang === "ar"
                                          ? "اللقب الخاص بك"
                                          : ""
                                      }
                                      onChange={handleChange}
                                      value={info.last_name}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1">
                                  <div className="mb-5">
                                    <input
                                      name="email"
                                      id="email"
                                      type="email"
                                      className="form-input"
                                      placeholder={
                                        appLang === "en"
                                          ? "Email"
                                          : appLang === "tr"
                                          ? "Email"
                                          : appLang === "ar"
                                          ? "بريد إلكتروني"
                                          : ""
                                      }
                                      onChange={handleChange}
                                      value={info.email}
                                    />
                                  </div>

                                  <div className="mb-5">
                                    <textarea
                                      name="comment"
                                      id="comment"
                                      className="form-input textarea h-28"
                                      placeholder={
                                        appLang === "en"
                                          ? "Comment"
                                          : appLang === "tr"
                                          ? "Yorum"
                                          : appLang === "ar"
                                          ? "تعليق"
                                          : ""
                                      }
                                      onChange={handleChange}
                                      value={info.comment}
                                    ></textarea>
                                  </div>
                                </div>
                                <div className=" sm:flex sm:flex-row-reverse sm:px-6">
                                  <button
                                    type="button"
                                    className="btn text-white rounded-md h-11 justify-center flex items-center bg-orange-800 hover:bg-orange-900 border-orange-800 hover:border-orange-900"
                                    onClick={() => {
                                      setOpen(false);
                                      setInfo({});
                                    }}
                                    ref={cancelButtonRef}
                                  >
                                    {appLang === "en" && "Cancel"}
                                    {appLang === "tr" && "İptal"}
                                    {appLang === "ar" && "يلغي"}
                                  </button>
                                  <button
                                    type="submit"
                                    id="submit"
                                    // name="send"
                                    className="btn mr-3 text-white rounded-md h-11 justify-center flex items-center bg-orange-600 hover:bg-orange-700 border-orange-600"
                                  >
                                    {appLang === "en" && "Send"}
                                    {appLang === "tr" && "Gönder"}
                                    {appLang === "ar" && "يرسل"}
                                  </button>
                                </div>
                              </form>
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

export default CommentModal;
