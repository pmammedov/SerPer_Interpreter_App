import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';

// import 'file-upload-with-preview/dist/file-upload-with-preview.min.css';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { addPortfolio, editPortfolio } from '@/services/portfolio';

const PortfoyModal = ({ info, setInfo, open, setOpen, open1, setOpen1, refreshPortList, defaultParams }) => {
    // console.log('info', info);
    const [images, setImages] = useState<any>([]);
    const maxNumber = 69;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Portfoy'));
    });

    const handleChange = (e: any) => {
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

    const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
        setImages(imageList as never[]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        // FormData nesnesini oluştur
        const formData = new FormData();

        // Her alan için boş kontrolü yap ve değeri veya null ekle
        formData.append('title_tr', info.title_tr || '');
        formData.append('content_tr', info.content_tr || '');
        formData.append('title_en', info.title_en || '');
        formData.append('content_en', info.content_en || '');
        formData.append('title_ar', info.title_ar || '');
        formData.append('content_ar', info.content_ar || '');

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
                await editPortfolio(info.id, formData); // Portfolio düzenleme
            } else {
                await addPortfolio(formData); // Yeni haber ekleme
            }
            setOpen(false); // Yeni Portfolio ekleme modalını kapat
            setOpen1(false); // Portfolio düzenleme modalını kapat
            setInfo({}); // Info state'ini sıfırla
            setImages([]); // Image state'ini sıfırla
            refreshPortList(); // Portfolio listesini yenile
        } catch (error) {
            console.error('Portfolio işlemi sırasında hata:', error);
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
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                open={open || open1}
                onClose={() => {
                    setOpen(false);
                    setOpen1(false);
                }}
            >
                <div className="flex min-h-screen items-center justify-center p-4">
                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

                    <div className="my-8 inline-block w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <form onSubmit={handleSubmit} className="flex flex-col rounded-lg bg-white md:flex-row">
                            <div className="space-y-4 p-4 md:flex md:w-1/2 md:flex-col">
                                <ImageUploading value={images} onChange={onImageChange} maxNumber={maxNumber}>
                                    {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
                                        <div className="upload__image-wrapper">
                                            <div className="flex flex-wrap justify-center">
                                                {imageList.map((image, index) => (
                                                    <div key={index} className="image-item">
                                                        <img src={image.dataURL} alt="" width="100" />
                                                        <div className="image-item__btn-wrapper">
                                                            <button onClick={() => onImageUpdate(index)} type="button">
                                                                Update
                                                            </button>
                                                            <button onClick={() => onImageRemove(index)} type="button">
                                                                Remove
                                                            </button>
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
                                                Choose a folder...
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
                            <div className="space-y-4 p-4 md:w-1/2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="title_tr" className="block text-sm font-medium text-gray-700">
                                            Title in Turkish
                                        </label>
                                        <input
                                            id="title_tr"
                                            type="text"
                                            name="title_tr"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a title in Turkish"
                                            value={info.title_tr}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content_tr" className="block text-sm font-medium text-gray-700">
                                        Description in Turkish
                                        </label>
                                        <input
                                            id="content_tr"
                                            type="text"
                                            name="content_tr"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a description in Turkish"
                                            value={info.content_tr}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="title_en" className="block text-sm font-medium text-gray-700">
                                        Title in English
                                        </label>
                                        <input
                                            id="title_en"
                                            type="text"
                                            name="title_en"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a title in English"
                                            value={info.title_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content_en" className="block text-sm font-medium text-gray-700">
                                        Description in English
                                        </label>
                                        <input
                                            id="content_en"
                                            type="text"
                                            name="content_en"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a description in English"
                                            value={info.content_en}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700">
                                        Title in Arabic
                                        </label>
                                        <input
                                            id="title_ar"
                                            type="text"
                                            name="title_ar"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a title in Arabic"
                                            value={info.title_ar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="content_ar" className="block text-sm font-medium text-gray-700">
                                        Description in Arabic
                                        </label>
                                        <input
                                            id="content_ar"
                                            type="text"
                                            name="content_ar"
                                            className="form-input mt-1 block w-full"
                                            placeholder="Enter a description in Arabic"
                                            value={info.content_ar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
                                    Durum
                                </label>
                                <select id="is_active" name="is_active" className="form-select block w-full" value={info.is_active ? 'true' : 'false'} onChange={handleChange}>
                                    <option value="true">Active</option>
                                    <option value="false">Passive</option>
                                </select>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setOpen(false);
                                            setOpen1(false);
                                        }}
                                    >
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

export default PortfoyModal;
