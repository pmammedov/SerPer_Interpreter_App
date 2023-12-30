import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import {editSitesettings, getSitesettingsId} from "@/services/siteSettings";
import 'react-toastify/dist/ReactToastify.css';
import {errorToastMessage, succesToastMessage} from "@/components/toastify";

const SettingsAdd = () => {
    const dispatch = useDispatch();
    const [formValues, setFormValues] = useState({
        title: '',
        about_us_tr: '',
        about_us_en: '',
        about_us_ar: '',
        phone: '',
        email: '',
        address: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        google: '',
        youtube: ''
    });

    useEffect(() => {
        dispatch(setPageTitle('Site Ayarları Ekle'));
        const fetchData = async () => {
            const response = await getSitesettingsId(1);
            setFormValues(response.data);
        };
        fetchData();
    }, [dispatch]);

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try {
            const response = await editSitesettings(1, formValues);
            if (response.status === 200) {
                // Eğer güncelleme başarılıysa, kullanıcıya gösterilmek üzere yeni verileri tekrar çek
                succesToastMessage(`Site settings have been updated`, 1500);
                refetchSettings();
            } else {
                // Eğer API'den beklenmedik bir yanıt geliyorsa, bir hata mesajı göster
                errorToastMessage(`Site settings could not be updated.`, 1500);
            }
        } catch (error) {
            console.log(error);
            errorToastMessage(`Site settings could not be updated`, 1500);
        }
    };

    const refetchSettings = async () => {
        try {
            const response = await getSitesettingsId(1);
            setFormValues(response.data);
        } catch (error) {
            console.error('Settings fetch failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mt-2 w-full lg:max-w-fit">
                {/* Form Alanları */}
                <div className="flex flex-col justify-between lg:flex-row">
                    {/* Sol Taraf */}
                    <div className="w-full lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
                        {/* Başlık */}
                        <div className="flex items-center ">
                            <label htmlFor="title" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Başlık
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className=" lg:w-[550px] form-input max-w-sm"
                                value={formValues.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="about_us_tr" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Hakkımızda Türkçe
                            </label>
                            <textarea
                                id="about_us_tr"
                                name="about_us_tr"
                                rows={6}
                                className="lg:w-[550px] form-textarea max-w-sm"
                                value={formValues.about_us_tr || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="about_us_en" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Hakkımızda İngilizce
                            </label>
                            <textarea
                                id="about_us_en"
                                name="about_us_en"
                                rows={6}
                                className=" lg:w-[550px] form-textarea max-w-sm "
                                value={formValues.about_us_en || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="about_us_ar" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Hakkımızda Arapça
                            </label>
                            <textarea
                                id="about_us_ar"
                                name="about_us_ar"
                                rows={6}
                                className=" lg:w-[550px] form-textarea max-w-sm "
                                value={formValues.about_us_ar || ''}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                    </div>
                    {/* Sağ Taraf */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex items-center">
                            <label htmlFor="phone" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Telefon
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                className="form-input max-w-sm  lg:w-[550px]"
                                value={formValues.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="email" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-input max-w-sm  lg:w-[550px]"
                                value={formValues.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="address" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Adres
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={2}
                                className="form-textarea max-w-sm lg:w-[550px] "
                                value={formValues.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="facebook" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Facebook
                            </label>
                            <input
                                id="facebook"
                                type="url"
                                name="facebook"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.facebook}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="instagram" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Instagram
                            </label>
                            <input
                                id="instagram"
                                type="url"
                                name="instagram"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.instagram}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="twitter" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Twitter
                            </label>
                            <input
                                id="twitter"
                                type="url"
                                name="twitter"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.twitter}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="linkedin" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Linkedin
                            </label>
                            <input
                                id="linkedin"
                                type="url"
                                name="linkedin"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.linkedin}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="google" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Google
                            </label>
                            <input
                                id="google"
                                type="url"
                                name="google"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.google}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            <label htmlFor="youtube" className="mb-0 flex-1 ltr:mr-2 rtl:ml-2">
                                Youtube
                            </label>
                            <input
                                id="youtube"
                                type="url"
                                name="youtube"
                                className="form-input max-w-sm lg:w-[550px]"
                                value={formValues.youtube}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
                {/* Kaydet Butonu */}
                <div className="mt-3 flex justify-end">
                    <button type="submit" className="btn btn-success gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ltr:mr-2 rtl:ml-2">
                            <path
                                d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Kaydet
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SettingsAdd;
