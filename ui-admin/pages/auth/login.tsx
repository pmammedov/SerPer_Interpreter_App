import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

// @ts-ignore
import Cookies from 'js-cookie';
import { loginService } from '@/services/auth';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { succesToastMessage, errorToastMessage } from '@/components/toastify';

const LoginCover = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Login Cover'));
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();
    const onSubmit = async (data: object) => {
        setLoading(true);
        try {
            const response = await loginService(data);
            if (response) {
                succesToastMessage(`${t('login_page.login_success')}`, 1500);
                Cookies.set('access_token', response.data.access);
                Cookies.set('refreshToken', response.data.refresh);
                await router.push('/');
            }
        } catch (error: any) {
            setLoading(false);
            if (error && error.response && error.response.data && error.response.data.message) {
                errorToastMessage(error.response.data.message, 1500);
            } else {
                errorToastMessage(`${t('login_page.login_error')}`, 1500);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden min-h-screen w-1/2 flex-col  items-center justify-center bg-gradient-to-t from-[#ff1361bf] to-[#44107A] p-4 text-white dark:text-black lg:flex">
                <div className="mx-auto mb-5 w-full">
                    <Image src={'/assets/images/auth-cover.svg'} className="mx-auto lg:max-w-[370px] xl:max-w-[500px]" width={1000} height={1000} alt={'tercümanlık management'} priority />
                </div>
                <h3 className="mb-4 text-center text-3xl font-bold">Join the community of expert developers</h3>
                <p>It is easy to setup with great customer experience. Start your 7-day free trial</p>
            </div>
            <div className="relative flex w-full items-center justify-center lg:w-1/2">
                <div className="max-w-[480px] p-5 md:p-10">
                    <motion.h1 initial={{ opacity: 0, translateX: 100 }} animate={{ opacity: 1, translateX: 0 }} transition={{ duration: 0.5 }} className="mb-3 text-3xl font-bold">
                        {i18n.language === 'tr' ? t('project_name') : t('project_name')}
                    </motion.h1>
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-3 text-3xl font-bold text-white-dark">
                        {t('login_page.title')}
                    </motion.h2>
                    <p className="mb-7">{t('login_page.subtitle')}</p>
                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email">{t('login_page.email')}</label>
                            <input id="email" type="email" className="form-input" placeholder={`${t('login_page.email')}`} {...register('email', { required: true })} />
                        </div>
                        <div>
                            <label htmlFor="password">{t('login_page.password')}</label>
                            <input id="password" type="password" className="form-input" placeholder={`${t('login_page.password')}`} {...register('password', { required: true })} />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <label className="cursor-pointer">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="text-white-dark">{t('login_page.remember')}</span>
                                </label>
                            </div>
                            <div>
                                <label className="ml-4 text-primary">
                                    <Link href="/auth/forget-password">{t('login_page.forgot_password')}</Link>
                                </label>
                            </div>
                        </div>
                        {loading ? (
                            <button type="button" disabled={loading} className="btn btn-primary w-full">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="inline-block h-5 w-5 animate-[spin_2s_linear_infinite] align-middle ltr:mr-2 rtl:ml-2"
                                >
                                    <line x1="12" y1="2" x2="12" y2="6"></line>
                                    <line x1="12" y1="18" x2="12" y2="22"></line>
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                    <line x1="2" y1="12" x2="6" y2="12"></line>
                                    <line x1="18" y1="12" x2="22" y2="12"></line>
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                </svg>
                                {t('login_page.login')}
                            </button>
                        ) : (
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit" className="btn btn-primary w-full">
                                {t('login_page.login')}
                            </motion.button>
                        )}
                    </form>
                    <div className="relative my-7 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2]  dark:before:bg-[#253b5c]">
                        <div className="relative z-[1] inline-block bg-[#fafafa] px-2 font-bold text-white-dark dark:bg-[#060818]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
LoginCover.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default LoginCover;
