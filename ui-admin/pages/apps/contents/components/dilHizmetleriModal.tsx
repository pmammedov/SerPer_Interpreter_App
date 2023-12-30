import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '@/store/themeConfigSlice';
import 'file-upload-with-preview/dist/style.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {errorToastMessage, succesToastMessage} from "@/components/toastify";
import {addNewLanguages, editLanguages} from "@/services/languages";

// @ts-ignore
const DilHizmetleriModal = ({ open, setOpen, open1, setOpen1, info, setInfo, refreshLanguagesList, defaultParams }) => {
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Dil Hizmeti ekle'));
    }, [dispatch]);

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        // 'is_active' alanı için string 'true' veya 'false' değerini boolean'a dönüştür
        const newValue = name === 'is_active' ? value === 'true' : value;
        setInfo({ ...info, [name]: newValue });
    };

    const onImageChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        // Yeni resim listesini state'e kaydet
        setImages(imageList as never[]);
        // Eğer resimler varsa ve bir 'file' özelliği varsa, ilk resmin 'file' özelliğini info state'ine ekleyelim.
        const imageFile = imageList.length > 0 && imageList[0].file ? imageList[0].file : null;
        setInfo({ ...info, image: imageFile });
    };


    const handleSubmit = async (e:any) => {
        e.preventDefault();

        // FormData nesnesini oluştur
        const formData = new FormData();

        // Her alan için boş kontrolü yap ve değeri veya null ekle
        formData.append('name_tr', info.name_tr || "");
        formData.append('name_en', info.name_en || "");
        formData.append('name_ar', info.name_ar || "");
        formData.append('order', info.order || "");

        // 'is_active' değerini boolean olarak ayarla
        const is_active_bool = info.is_active === 'true' || info.is_active === true; // String "true" veya boolean true
        formData.append('is_active', is_active_bool.toString()); // Backend'in beklediği string ifadeye dönüştür

        // Resmi FormData nesnesine ekle
        if (images.length > 0 && images[0].file) {
            formData.append('image', images[0].file);
        }

        // API isteğini yap
        try {
            if (info.id) {
                await editLanguages(info.id, formData);
            } else {
                await addNewLanguages(formData);
            }
            setOpen(false);
            setOpen1(false);
            setInfo({});
            setImages([]);
            refreshLanguagesList();
            succesToastMessage(`İşlem başarı ile gerçekleşti.`, 1500);
        } catch (error) {
            console.error('Dil ekleöe işlemi sırasında hata:', error);
            errorToastMessage(`İşlem gerçekleştirilmedi.`, 1500);
        }
    };

    useEffect(() => {
        // Modal açıldığında mevcut resmi yükle
        if (open1 && info.image && typeof info.image === 'string') {
            // Eğer 'image' bir URL ise, images state'ini güncelle
            setImages([{ dataURL: info.image }]);
        }
    }, [open1, info.image]);

    useEffect(() => {
        // Modal kapandığında info state'ini sıfırla
        if (!open && !open1) {
            setInfo({ ...defaultParams });
            setImages([]); // Resimler de sıfırlansın
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
                                                Choose File...
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
                                        <label htmlFor="name_tr" className="block text-sm font-medium text-gray-700">Language (Turkish)</label>
                                        <input
                                            id="name_tr"
                                            type="text"
                                            name="name_tr"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter a language"
                                            value={info.name_tr}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="name_en" className="block text-sm font-medium text-gray-700">Language (English)</label>
                                        <input
                                            id="name_en"
                                            type="text"
                                            name="name_en"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter a language"
                                            value={info.name_en}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="name_ar" className="block text-sm font-medium text-gray-700">Language (Arabic)</label>
                                        <input
                                            id="name_ar"
                                            type="text"
                                            name="name_ar"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Enter a language"
                                            value={info.name_ar}
                                            onChange={handleChange} />
                                    </div>
                                    <div>
                                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">Sort</label>
                                        <input
                                            id="order"
                                            type="text"
                                            name="order"
                                            className="mt-1 form-input block w-full"
                                            placeholder="Sayfa sıralamasını girin"
                                            value={info.order}
                                            onChange={handleChange} />
                                    </div>
                                </div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">Status</label>
                                <select id="is_active" name="is_active" className="form-select block w-full" value={info.is_active ? 'true' : 'false'} onChange={handleChange}>
                                    <option value="true">Active</option>
                                    <option value="false">Passive</option>
                                </select>
                                <div className="flex justify-end">
                                    <button type="button" className="btn btn-danger" onClick={() => { setOpen(false); setOpen1(false); }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success ml-3">
                                        {open1 ? 'Güncelle' : 'Kaydet'}
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

export default DilHizmetleriModal;


