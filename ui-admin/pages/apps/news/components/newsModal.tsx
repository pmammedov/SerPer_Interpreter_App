import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import 'file-upload-with-preview/dist/style.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import {addNewNews, editNews} from "@/services/news";
import 'react-toastify/dist/ReactToastify.css';
import {errorToastMessage, succesToastMessage} from "@/components/toastify";

// @ts-ignore
const NewsModal = ({ open, setOpen, open1, setOpen1, info, setInfo, refreshNewsList, defaultParams }) => {
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('News ekle'));
    }, [dispatch]);

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        // Convert the string 'true' or 'false' value for the 'is_active' field to boolean
        const newValue = name === 'is_active' ? value === 'true' : value;
        setInfo({ ...info, [name]: newValue });
    };

    const onImageChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        // Save the new list of images to the state
        setImages(imageList as never[]);
        // If there are images and there is a 'file' property, let's add the 'file' property of the first image to the info state
        const imageFile = imageList.length > 0 && imageList[0].file ? imageList[0].file : null;
        setInfo({ ...info, image: imageFile });
    };


    const handleSubmit = async (e:any) => {
        e.preventDefault();

        // Create a FormData object
        const formData = new FormData();

        // Check for emptiness for each field and add its value or null
        formData.append('title_tr', info.title_tr || "");
        formData.append('content_tr', info.content_tr || "");
        formData.append('title_en', info.title_en || "");
        formData.append('content_en', info.content_en || "");
        formData.append('title_ar', info.title_ar || "");
        formData.append('content_ar', info.content_ar || "");

        // Set the value of 'is_active' as boolean
        const is_active_bool = info.is_active === 'true' || info.is_active === true; // String 'true' or boolean true
        formData.append('is_active', is_active_bool.toString()); // Convert to the string representation expected by the backend.

        // Add the image to the FormData object
        if (images.length > 0 && images[0].file) {
            formData.append('image', images[0].file);
        }

        // Make the API request
        try {
            if (info.id) {
                await editNews(info.id, formData); // Editing news
            } else {
                await addNewNews(formData); // Add new news
            }
            setOpen(false); // Close the modal for adding new news
            setOpen1(false); // Close the news editing modal
            setInfo({}); // Reset the info state
            setImages([]); // Reset the image state
            refreshNewsList(); // Refresh the news list
            succesToastMessage(`The operation was successfully completed`, 1500);
        } catch (error) {
            console.error('Error during news operation:', error);
            errorToastMessage(`Operation not performed`, 1500);
        }
    };

    useEffect(() => {
        // Upload the existing image when the modal is opened
        if (open1 && info.image && typeof info.image === 'string') {
            // If 'image' is a URL, update the images state
            setImages([{ dataURL: info.image }]);
        }
    }, [open1, info.image]);

    useEffect(() => {
        // Reset the info state when the modal is closed
        if (!open && !open1) {
            setInfo({ ...defaultParams });
            setImages([]); // Reset the images as well
        }
    }, [open, open1]);

    return (
        <Transition appear show={open || open1} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" open={open || open1} onClose={() => { setOpen(false); setOpen1(false); }}>
                <div className="flex items-center justify-center min-h-screen p-4">
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

                    <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row bg-white rounded-lg">
                            <div className="md:flex md:flex-col md:w-1/2 p-4 space-y-4">
                                <ImageUploading
                                    value={images}
                                    onChange={onImageChange}
                                    maxNumber={maxNumber}
                                >
                                    {({
                                          imageList,
                                          onImageUpload,
                                          onImageRemoveAll,
                                          onImageUpdate,
                                          onImageRemove,
                                          isDragging,
                                          dragProps
                                      }) => (
                                        <div className="upload__image-wrapper">
                                            <div className="flex flex-wrap justify-center">
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image.dataURL} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                            <button onClick={() => onImageUpdate(index)} type="button">Update</button>
                                                            <button onClick={() => onImageRemove(index)} type="button">Remove</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onImageUpload();
                                                }}
                                                {...dragProps}
                                            >
                                                Dosya seç...
                                            </button>
                                            &nbsp;
                                            {images.length === 0 && (
                                                <div className="text-center">
                                                    <img src="/assets/images/file-preview.svg" alt="" className="m-auto" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ImageUploading>
                            </div>
                            <div className="md:w-1/2 p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="title_tr" className="block text-sm font-medium text-gray-700">Title in Turkish</label>
                                        <input
                                            id="title_tr"
                                            type="text"
                                            name="title_tr"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the title in Turkish"
                                            value={info.title_tr}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="content_tr" className="block text-sm font-medium text-gray-700">Description in Turkish</label>
                                        <input
                                            id="content_tr"
                                            type="text"
                                            name="content_tr"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the description in Turkish"
                                            value={info.content_tr}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">Title in English</label>
                                        <input
                                            id="title_en"
                                            type="text"
                                            name="title_en"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the title in English"
                                            value={info.title_en}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="content_en" className="block text-sm font-medium text-gray-700">Description in English</label>
                                        <input
                                            id="content_en"
                                            type="text"
                                            name="content_en"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the description in English"
                                            value={info.content_en}
                                            onChange={handleChange} />
                                    </div>
                                    <div >
                                        <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700">Title in Arabic</label>
                                        <input
                                            id="title_ar"
                                            type="text"
                                            name="title_ar"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the title in Arabic"
                                            value={info.title_ar}
                                            onChange={handleChange} />
                                    </div>
                                    <div >
                                        <label htmlFor="content_ar" className="block text-sm font-medium text-gray-700">Description in Arabic</label>
                                        <input
                                            id="content_ar"
                                            type="text"
                                            name="content_ar"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter the description in Arabic"
                                            value={info.content_ar}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">Durum</label>
                                <select id="is_active" name="is_active" className="form-select block w-full" value={info.is_active ? 'true' : 'false'} onChange={handleChange}>
                                    <option value="true">Active</option>
                                    <option value="false">Passive</option>
                                </select>
                                <div className="flex justify-end">
                                    <button type="button" className="btn btn-danger" onClick={() => { setOpen(false); setOpen1(false); }}>
                                        İptal
                                    </button>
                                    <button type="submit" className="btn btn-success ml-3">
                                        {open1 ? 'Update' : 'Save'}
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

export default NewsModal;
