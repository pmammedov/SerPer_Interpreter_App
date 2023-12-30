import { Dialog, Transition } from '@headlessui/react';
import React, { useState, Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { errorToastMessage, succesToastMessage } from '@/components/toastify';
import { useTranslation } from "next-i18next";
import {userPasswordUpdate} from "@/services/users";

type UserProps = {
    isAddEventModal: boolean;
    setIsAddEventModal: (value: boolean) => void;
    editEvent: Function;
}

type UpdateUserPass = {
    old_password: string;
    new_password: string;
    new_password_repeat: string;
}

export default function PasswordUpdateModal({ isAddEventModal, setIsAddEventModal, editEvent }: UserProps) {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const { t } = useTranslation();

    const onSubmit = async (data: any) => {
        try {
            await userPasswordUpdate(data).then((res: any) => {
                if (res.status === 200) {
                    succesToastMessage("Şifreniz Güncellendi", 1000)
                    editEvent();
                    setIsAddEventModal(false);
                }
            });
        } catch (error) {
            errorToastMessage("Şifre güncellenirken hata oluştu", 1000)
        }
    }

    return (
        <div>
            <Transition appear show={isAddEventModal} as={Fragment}>
                <Dialog as="div" onClose={() => setIsAddEventModal(false)} open={isAddEventModal}
                    className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="panel w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <button
                                        type="button"
                                        className="absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600"
                                        onClick={() => setIsAddEventModal(false)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div
                                        className="bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]">
                                        {t("user.user_update_password")}
                                    </div>
                                    <div className="p-5">
                                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                                            <div>
                                                <label htmlFor="oldPassword">{t("user.old_password")}</label>
                                                <input
                                                    id="oldPassword"
                                                    type="password"
                                                    className="form-input"
                                                    placeholder={`${t('user.enter_old_password')}`}
                                                    {...register('old_password', { required: true })}
                                                />
                                                <div className="mt-2 text-danger" id="oldPasswodErr"></div>
                                            </div>

                                            <div>
                                                <label htmlFor="newPassword">{t("user.new_password")}</label>
                                                <input
                                                    id="newPassword"
                                                    type="password"
                                                    className="form-input"
                                                    placeholder={`${t('user.enter_new_password')}`}
                                                    {...register('new_password', { required: true })}
                                                />
                                                <div className="mt-2 text-danger" id="newPasswordErr"></div>
                                            </div>
                                            <div>
                                                <label htmlFor="reNewPass">{t("user.new_password_repeat")}</label>
                                                <input
                                                    id="reNewPass"
                                                    type="password"
                                                    className="form-input"
                                                    placeholder={`${t("user.confirm_password")}`}
                                                    {...register('new_password_repeat', { required: true })}
                                                />
                                                <div className="mt-2 text-danger" id="reNewPassErr"></div>
                                            </div>
                                            <div className="!mt-8 flex items-center justify-end">
                                                <button type="button" className="btn btn-outline-danger"
                                                    onClick={() => setIsAddEventModal(false)}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                                    Güncelle
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
