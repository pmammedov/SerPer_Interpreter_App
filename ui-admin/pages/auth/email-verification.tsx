import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setPageTitle } from '@/store/themeConfigSlice';
import BlankLayout from '@/components/Layouts/BlankLayout';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import {useTranslation} from "next-i18next";
import 'react-toastify/dist/ReactToastify.css';
import { succesToastMessage, errorToastMessage } from "@/components/toastify"

const EmailVerification = () => {
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
    const {t, i18n} = useTranslation();

    useEffect(() => {
        const verifyEmail = async () => {
            const { token } = router.query;

            if (token) {
                try {
                    const response = await fetch(`http://127.0.0.1:8000/api/auth/verify/${token}`);
                    const data = await response.json();

                    if (data.status) {
                        succesToastMessage(data.message, 1500);
                        router.push('/');
                    } else {
                        errorToastMessage('Doğrulama başarısız.', 1500);
                    }
                } catch (error) {
                    errorToastMessage('Doğrulama sırasında bir hata oluştu.', 1500);
                }
            }
        };

        if (router.isReady) {
            verifyEmail();
        }
    }, [router, router.isReady]);


    return (
        <div className="flex flex-col items-center justify-center text-center">
            <div>
                <Image src={'/assets/images/email/email-verification.jpg'} className="rounded-2xl mb-3 justify-center mt-5" width={750} height={750} alt={'budget management'} />
            </div>
            <div>
                <motion.h1 initial={{ opacity: 0, translateX: 100 }} animate={{ opacity: 1, translateX: 0 }} transition={{ duration: 0.5 }} className="mb-2 text-3xl font-bold">
                    {
                        i18n.language === 'tr' ? t('project_name') : t('project_name')

                    }
                </motion.h1>
                <motion.p initial={{ opacity: 0, translateX: 100 }} animate={{ opacity: 1, translateX: 0 }} transition={{ duration: 0.5 }} className="text-gray-500">
                    Basariyla mail onaylandi
                </motion.p>
            </div>
        </div>
    );
};
EmailVerification.getLayout = (page: any) => {
    return <BlankLayout>{page}</BlankLayout>;
};
export default EmailVerification;
