import React, { useState } from "react";
import * as Unicons from "@iconscout/react-unicons";
import { Link } from "react-scroll";
import { addContact } from "@/services/message";

export default function Contact({ siteSettings, appLang }) {
  const [success, setSuccess] = useState(false);
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [file_path, setFile_path] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const response = await addContact(formData);
      // console.log("Gönderme başarılı:", response);
      setSuccess(true);

      event.target.reset();

      setFirst_name("");
      setLast_name("");
      setEmail("");
      setPhone("");
      setTitle("");
      setMessage("");
      setFile_path("");
      setAlertMessage("Dosya yükleme başarılı!");
    } catch (error) {
      console.error("Gönderim hatası:", error);
      setSuccess("not success");
      setAlertMessage("Dosya yükleme başarısız oldu!");
    }
  };

  return (
    <>
      {/* Start */}
      <section
        className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
        id="contact"
      >
        <div className="container">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="text-orange-600 text-base font-medium uppercase mb-2">
              {appLang === "en" && "CONTACT US"}
              {appLang === "tr" && "BİZE ULAŞIN"}
              {appLang === "ar" && "اتصل بنا"}
            </h6>
            <h3 className="mb-4 md:text-2xl text-xl font-medium dark:text-white">
              Get In Touch !
              {appLang === "en" && "Contact Us We will get back to you"}
              {appLang === "tr" && "Bizimle İletişime Geçin Size dönüş yapalım"}
              {appLang === "ar" && "اتصل بنا سوف نقوم بالرد عليك"}
            </h3>

            <p className="text-slate-400 dark:text-slate-300 max-w-xl mx-auto">
              Launch your campaign and benefit from our expertise on designing
              and managing conversion centered Tailwind CSS html page.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 md:grid-cols-2 mt-8 items-center gap-6">
            <div className="lg:col-span-8">
              <div className="p-6 rounded-md shadow bg-white dark:bg-slate-900">
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
                            ? "First name"
                            : appLang === "tr"
                            ? "Adınız"
                            : appLang === "ar"
                            ? "الاسم الأول"
                            : ""
                        }
                        required={true}
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
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
                            ? "Last name"
                            : appLang === "tr"
                            ? "Soyadınız"
                            : appLang === "ar"
                            ? "اسم العائلة"
                            : ""
                        }
                        required={true}
                        value={last_name}
                        onChange={(e) => setLast_name(e.target.value)}
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
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* <div className="lg:col-span-6 mb-5">
                      <input
                        name="phone"
                        id="phone"
                        type="phone"
                        className="form-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={
                          appLang === "en"
                            ? "Phone number"
                            : appLang === "tr"
                            ? "Telefon"
                            : appLang === "ar"
                            ? " رقم التليفون"
                            : ""
                        }
                      />
                    </div> */}
                  </div>
                  <div className="grid grid-cols-1">
                    <div className="mb-5">
                      <input
                        name="title"
                        id="title"
                        className="form-input"
                        placeholder={
                          appLang === "en"
                            ? "Subject"
                            : appLang === "tr"
                            ? "Konu"
                            : appLang === "ar"
                            ? "موضوع"
                            : ""
                        }
                        required={true}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="mb-5">
                      <textarea
                        name="message"
                        id="message"
                        className="form-input textarea h-28"
                        placeholder={
                          appLang === "en"
                            ? "Message"
                            : appLang === "tr"
                            ? "Mesaj"
                            : appLang === "ar"
                            ? "رسالة"
                            : ""
                        }
                        required={true}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="mb-5 flex items-center">
                      <div>
                        <label
                          htmlFor="file_path"
                          className="form-label text-white bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-md cursor-pointer inline-block"
                        >
                          {appLang === "en" && "Upload File"}
                          {appLang === "tr" && "Dosya Yükle"}
                          {appLang === "ar" && "رفع ملف"}
                        </label>
                        <input
                          type="file"
                          name="file_path"
                          id="file_path"
                          className="hidden"
                          value={file_path}
                          onChange={(e) => setFile_path(e.target.value)}
                        />
                      </div>
                      {file_path && (
                        <div className="bg-orange-100 text-red-800 px-4 py-2 ml-2 rounded">
                          {file_path}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="submit"
                      id="submit"
                      name="send"
                      className="btn bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white rounded-md h-11 justify-center flex items-center mr-3"
                    >
                      {appLang === "en" && "Send Message"}
                      {appLang === "tr" && "Mesaj Gönder"}
                      {appLang === "ar" && "ارسل رسالة"}
                    </button>
                    {success === true ? (
                      <p className="bg-green-200 text-red-800 px-4 py-2 ml-2 rounded">
                        {appLang === "en" && "Sending Message Successsful!"}
                        {appLang === "tr" && "Mesaj Gönderme işlemi Başarılı!"}
                        {appLang === "ar" && "تم إرسال الرسالة بنجاح!"}
                      </p>
                    ) : (
                      ""
                    )}
                    {success === "not success" && (
                      <p className="bg-orange-200 text-red-800 px-4 py-2 ml-2 rounded">
                        {appLang === "en" && "Sending Message Failed!"}
                        {appLang === "tr" && "Mesaj Gönderme işlemi Başarısız!"}
                        {appLang === "ar" && "فشل إرسال الرسالة!"}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="lg:ms-8">
                <div className="flex">
                  <div className="icons text-center mx-auto">
                    <Unicons.UilPhone className="rounded text-2xl dark:text-white mb-0" />
                  </div>

                  <div className="flex-1 ms-6">
                    <h5 className="text-lg dark:text-white mb-2 font-medium">
                      {appLang === "en" && "Phone Number"}
                      {appLang === "tr" && "Telefon"}
                      {appLang === "ar" && "رقم التليفون"}
                    </h5>
                    <Link
                      href={siteSettings?.phone || ""}
                      className="text-slate-400"
                    >
                      {siteSettings?.phone || ""}
                    </Link>
                  </div>
                </div>

                <div className="flex mt-4">
                  <div className="icons text-center mx-auto">
                    <Unicons.UilEnvelope className="rounded text-2xl dark:text-white mb-0" />
                  </div>

                  <div className="flex-1 ms-6">
                    <h5 className="text-lg dark:text-white mb-2 font-medium">
                      {appLang === "en" && "Email"}
                      {appLang === "tr" && "Email"}
                      {appLang === "ar" && "بريد إلكتروني"}
                    </h5>
                    <Link
                      href={siteSettings?.email || ""}
                      className="text-slate-400"
                    >
                      {siteSettings?.email || ""}
                    </Link>
                  </div>
                </div>

                <div className="flex mt-4">
                  <div className="icons text-center mx-auto">
                    <Unicons.UilMapMarker className="rounded text-2xl dark:text-white mb-0" />
                  </div>

                  <div className="flex-1 ms-6">
                    <h5 className="text-lg dark:text-white mb-2 font-medium">
                      {appLang === "en" && "Address"}
                      {appLang === "tr" && "Adres"}
                      {appLang === "ar" && "عنوان"}
                    </h5>
                    <p className="text-slate-400 mb-2">
                      {siteSettings?.address || ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
