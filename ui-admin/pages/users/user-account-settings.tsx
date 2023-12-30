import { useEffect, useState } from 'react';
import { setPageTitle } from '@/store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import { succesToastMessage, errorToastMessage } from "@/components/toastify"
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useTranslation } from "next-i18next";
import PasswordUpdateModal from './components/PasswordUpdateModal';
import {userGetMe, userUpdateService} from "@/services/users";

interface UserProfile {
    email: string,
    full_name: string,
}

const AccountSetting = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [userProfile, setUserProfile] = useState<UserProfile>()
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const [isAddEventModal, setIsAddEventModal] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    });

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
    });
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };

    useEffect(() => {
        setValue('full_name', userProfile?.full_name)
        setValue('email', userProfile?.email)
    }, [userProfile])

    const onSubmit = async (data: object) => {
        try {
            if (data) {
                const response = await userUpdateService(data);
                if (response.status === 200) {
                    succesToastMessage("Kullanici Basariyla Guncellendi")
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            }
        } catch (e) {
            errorToastMessage("Kullanici Guncellenirken Hata Olustu")
        }
    }

    useEffect(() => {
        const getMe = async () => {
            const res = await userGetMe()
            setUserProfile(res.data)
        }
        isMounted && getMe()
    }, [isMounted])

    const editEvent = () => {
        setIsAddEventModal(true)
    };

    return (
        <div>
            <Breadcrumbs
                components="sidebar_title.user_panel"
                page="sidebar_title.user_title"
            />
            <div className="pt-5">
                <PasswordUpdateModal
                    isAddEventModal={isAddEventModal}
                    setIsAddEventModal={() => setIsAddEventModal(false)}
                    editEvent={() => editEvent()}
                />
                <div>
                    <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black"
                        onSubmit={handleSubmit(onSubmit)}>
                        <h6 className="mb-5 text-lg font-bold">{t('user.information')}</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name">{t('user.full_name')}</label>
                                    <input id="name" type="text" placeholder="" className="form-input"
                                        {...register("full_name", { required: true })} />
                                </div>
                                <div>
                                    <label htmlFor="email">{t('user.email')}</label>
                                    <input id="email" type="email" placeholder="Jimmy@gmail.com" className="form-input"
                                        {...register("email", { required: true })} />
                                </div>
                                <div className="mt-3 flex gap-2 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        {t('user.update')}
                                    </button>
                                    <button type="button" className="btn btn-primary rounded-md justify-end" onClick={() => editEvent()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 me-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        {t('user.user_update_password')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AccountSetting;
