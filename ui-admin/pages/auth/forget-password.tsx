import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useForm } from 'react-hook-form';
import { ForgetPassword } from '@/services/reset-password';
import Image from 'next/image';
import { succesToastMessage, warningToastMessage } from '@/components/toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useTranslation } from "next-i18next";

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
    const { t, i18n } = useTranslation();
    const onSubmit = async (data: object) => {
        try {
            if (data) {
                const res = await ForgetPassword(data)
                if (res.status === 200) {
                    succesToastMessage(res.data.message)
                }
            }
        } catch (error: any) {
            console.log('hata', error);
            warningToastMessage(error.response.data.message)
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
                    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="mb-3 text-3xl font-bold text-white-dark">
                        {t('forget_password.forget_subtitle')}
                    </motion.h2>
                    <p className="mb-7">{t('forget_password.forget_page_description')}</p>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email">{t('login_page.email')}</label>
                            <input id="email" type="email" className="form-input" placeholder={`${t('login_page.email')}`} {...register('email', { required: true })} />
                        </div>

                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit" className="btn btn-primary w-full">
                            {t('forget_password.submit')}
                        </motion.button>
                    </form>

                </div>
            </div>
        </div>
    );
};
LoginCover.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default LoginCover;
