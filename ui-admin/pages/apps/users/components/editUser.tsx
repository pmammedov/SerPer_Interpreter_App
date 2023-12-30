import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Dialog, Transition } from '@headlessui/react';
// @ts-ignore
import { addUser, editUser } from '@/services/users';

import 'react-toastify/dist/ReactToastify.css';
import { errorToastMessage, succesToastMessage } from '@/components/toastify';

interface EditUserProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    info: any;
    setInfo: (info: any) => void;
    refreshUsersList: () => void;
    isNewUser: boolean;
}

const EditUser: React.FC<EditUserProps> = ({ open, setOpen, info, setInfo, refreshUsersList, isNewUser }) => {
    const dispatch = useDispatch();
    const [localInfo, setLocalInfo] = useState(info);
    const [passwordRepeat, setPasswordRepeat] = useState('');

    useEffect(() => {
        if (open) {
            setLocalInfo({ ...info });
            setPasswordRepeat('');
        }

        const pageTitle = isNewUser ? 'Add the User' : 'Edit the User';
        dispatch(setPageTitle(pageTitle));
    }, [dispatch, open, isNewUser]);

    useEffect(() => {
        if (open) {
            setLocalInfo({ ...info });
        }
    }, [info, open]);

    const handleChange = (e: {
        target: {
            name: any;
            value: any;
        };
    }) => {
        const { name, value } = e.target;
        if (name === 'status') {
            const isSuperuser = value === '2';
            setLocalInfo({
                ...localInfo,
                status: value,
                is_superuser: isSuperuser,
            });
        } else {
            setLocalInfo({ ...localInfo, [name]: value });
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (isNewUser && localInfo.password !== passwordRepeat) {
            errorToastMessage('Passwords do not match', 1500);
            return;
        }
        try {
            if (isNewUser) {
                // Yeni kullanıcı ekleyin
                await addUser({
                    full_name: localInfo.full_name,
                    email: localInfo.email,
                    status: localInfo.status,
                    is_superuser: localInfo.is_superuser,
                    password: localInfo.password,
                });
                succesToastMessage('User added successfully', 1500);
            } else {
                await editUser(localInfo.id, {
                    full_name: localInfo.full_name,
                    email: localInfo.email,
                    status: localInfo.status,
                    is_superuser: localInfo.is_superuser,
                });
                succesToastMessage('User updated successfully', 1500);
            }
            refreshUsersList();
        } catch (error) {
            console.error('Error occurred during user operation:', error);
            errorToastMessage('An error occurred during the user operation', 1500);
        }
        setOpen(false);
    };

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <div className="flex min-h-screen items-center justify-center p-4">
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

                    <div className="my-8 inline-block w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <form onSubmit={handleSubmit} className="flex flex-col rounded-lg bg-white md:flex-row">
                            <div className="space-y-4 p-4 md:w-full">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                            Name Surname
                                        </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            name="full_name"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter the Full Name"
                                            value={localInfo.full_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="text"
                                            name="email"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter the email address"
                                            value={localInfo.email || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                {isNewUser && (
                                    <>
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                name="password"
                                                className="form-input mt-1 block w-full"
                                                placeholder="Enter the password"
                                                value={localInfo.password || ""}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="passwordRepeat" className="block text-sm font-medium text-gray-700">
                                                Password Confirmation
                                            </label>
                                            <input
                                                id="passwordRepeat"
                                                type="password"
                                                name="passwordRepeat"
                                                className="form-input mt-1 block w-full"
                                                placeholder="Enter the Password Again"
                                                value={passwordRepeat}
                                                onChange={(e) => setPasswordRepeat(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Rol
                                </label>
                                <select
                                  id="status"
                                  name="status"
                                  className="form-select block w-full"
                                  value={localInfo.status || ""}
                                  onChange={handleChange}
                                  required
                                >
                                    <option value="" disabled>Please Select a Role</option>
                                    <option value="1">Admin</option>
                                    <option value="2">Super Admin</option>
                                </select>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        İptal
                                    </button>
                                    <button type="submit" className="btn btn-success ml-3">
                                        {isNewUser ? 'Kaydet' : 'Güncelle'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};
export default EditUser;
