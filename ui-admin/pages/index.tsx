import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import {deleteNews, getNews, manyDeleteNews, editNews} from "@/services/news";
import {errorToastMessage, succesToastMessage} from "@/components/toastify";
import {Tooltip} from "@mantine/core";
import NewsModal from "@/pages/apps/news/components/newsModal";

const Index = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Haberler Duyurular'));
    });
    const defaultParams = {
        id: null,
        title_tr: '',
        title_en: '',
        title_ar: '',
        content_tr: '',
        content_en: '',
        content_ar: '',
        image: '',
        is_active: false,
    };

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const [newsList, setNewsList] = useState([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [info, setInfo] = useState({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSortedAndPaginatedNews = async () => {
            try {
                const sortOrder: string = sortStatus.direction === 'asc' ? sortStatus.columnAccessor : `-${sortStatus.columnAccessor}`;
                const response = await getNews(sortOrder, page, pageSize, search);
                if (response.data) {
                    setNewsList(response.data.data); // Güncellenmiş haber listesi
                    setTotalRecords(response.data.total); // Toplam kayıt sayısını API'dan al
                } else {
                    console.error('Beklenen veri yapısı alınamadı');
                }
            } catch (error) {
                console.error('Haberler alınırken hata oluştu:', error);
            }
        };

        fetchSortedAndPaginatedNews();
    }, [sortStatus, page, pageSize, search]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    const handleDeleteNews = async (id: number) => {
        try {
            await deleteNews(id);
            // Haber başarıyla silindikten sonra haber listesini güncelle
            const response = await getNews(sortStatus.columnAccessor, page, pageSize);
            succesToastMessage(`Haber başarı ile silindi.`, 1500);
            setNewsList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Haber silinirken hata oluştu:', error);
            errorToastMessage(`Haber silinemedi.`, 1500);
        }
    };

    const refreshNewsList = async () => {
        try {
            const response = await getNews(sortStatus.columnAccessor, page, pageSize);
            setNewsList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Haberler yeniden çekilirken hata oluştu:', error);
        }
    };

    const selectNewsForEdit = (newsItem:any) => {
        setInfo(newsItem); // Seçilen haberin bilgilerini saklayın
        setOpen1(true); // Modalı açın
    };

    const handleNewNews = () => {
        setInfo({ ...defaultParams }); // `defaultParams` ile `info` state'ini sıfırla
        setOpen(true); // Modalı aç
    };

    const handleManyDelete = async () => {
        try {
            const idsToDelete = selectedRecords.map((record: { id: any; }) => record.id);
            console.log(idsToDelete);
            await manyDeleteNews({ ids: idsToDelete });
            succesToastMessage(`Seçilen diller başarı ile silindi.`, 1500);
            await refreshNewsList();
        } catch (error) {
            console.error('Diller silinirken hata oluştu:', error);
            errorToastMessage(`Diller silinemedi.`, 1500);
        }
    };

    const handleCheckChange = async (newsId: never, newIsActive: boolean) => {
        try {
            const currentUser = newsList.find((news: { id: any }) => news.id === newsId);
            if (!currentUser) {
                throw new Error('Haberler bulunamadı');
            }

            const response = await editNews(newsId, {
                is_active: newIsActive,
            });

            if (response.data) {
                succesToastMessage(`Haber durumu başarılı ile güncellendi.`, 1500);
                refreshNewsList();
            }
        } catch (error) {
            console.error('Haber durumu güncellenirken hata:', error);
            errorToastMessage(`Haber durumu güncellenirken hata oluştu.`, 1500);
        }
    };

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={handleManyDelete}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path
                                    d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                ></path>
                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                <path
                                    opacity="0.5"
                                    d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                ></path>
                            </svg>
                            Delete
                        </button>
                        <button onClick={handleNewNews} className="btn btn-primary gap-2">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Yeni Haber Yayınla
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={newsList}
                        columns={[
                            {
                                title: 'ID',
                                accessor: 'id',
                                sortable: true,
                                render: ({ id }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{id}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Resim',
                                accessor: 'image',
                                render: ({ image }) => (image ? <img src={image} alt="Haber Resmi" style={{ width: '50px', height: '50px' }} /> : 'Resim Yok'),
                            },
                            {
                                title: 'Türkçe Başlık',
                                accessor: 'title_tr',
                                render: ({ title_tr }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{title_tr}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Türkçe İçerik',
                                accessor: 'content_tr',
                                render: ({ content_tr }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={content_tr}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word' // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>
                                                {content_tr?.length > 25 ? `${content_tr.slice(0, 25)}...` : content_tr}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'İngilizce Başlık',
                                accessor: 'title_en',
                                render: ({ title_en }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{title_en}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'İngilizce İçerik',
                                accessor: 'content_en',
                                render: ({ content_en }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={content_en}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word' // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>
                                                {content_en?.length > 25 ? `${content_en.slice(0, 25)}...` : content_en}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Arapça Başlık',
                                accessor: 'title_ar',
                                render: ({ title_ar }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{title_ar}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Arapça İçerik',
                                accessor: 'content_ar',
                                render: ({ content_ar }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={content_ar}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word' // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>
                                                {content_ar?.length > 25 ? `${content_ar.slice(0, 25)}...` : content_ar}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Yayın Durumu',
                                accessor: 'is_active',
                                sortable: true,
                                render: ({ id, is_active }) => (
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id={`news-${id}`}
                                            checked={is_active}
                                            onChange={(e) => handleCheckChange(id, e.target.checked)}
                                        />
                                        <span className="outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(/assets/images/close.svg)] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(/assets/images/checked.svg)] dark:border-white-dark dark:before:bg-white-dark"></span>
                                    </label>
                                ),
                            },
                            {
                                accessor: 'İşlemler',
                                title: 'İşlemler',
                                textAlignment: 'center',
                                render: ({ id, title_tr, content_tr, title_en, content_en, title_ar, content_ar, image, is_active }) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button onClick={() => selectNewsForEdit({ id, title_tr, content_tr, title_en, content_en, title_ar, content_ar, image, is_active })} className="flex hover:text-info">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5">
                                                <path
                                                    opacity="0.5"
                                                    d="M22 10.5V12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2H13.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path
                                                    d="M17.3009 2.80624L16.652 3.45506L10.6872 9.41993C10.2832 9.82394 10.0812 10.0259 9.90743 10.2487C9.70249 10.5114 9.52679 10.7957 9.38344 11.0965C9.26191 11.3515 9.17157 11.6225 8.99089 12.1646L8.41242 13.9L8.03811 15.0229C7.9492 15.2897 8.01862 15.5837 8.21744 15.7826C8.41626 15.9814 8.71035 16.0508 8.97709 15.9619L10.1 15.5876L11.8354 15.0091C12.3775 14.8284 12.6485 14.7381 12.9035 14.6166C13.2043 14.4732 13.4886 14.2975 13.7513 14.0926C13.9741 13.9188 14.1761 13.7168 14.5801 13.3128L20.5449 7.34795L21.1938 6.69914C22.2687 5.62415 22.2687 3.88124 21.1938 2.80624C20.1188 1.73125 18.3759 1.73125 17.3009 2.80624Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                                <path
                                                    opacity="0.5"
                                                    d="M16.6522 3.45508C16.6522 3.45508 16.7333 4.83381 17.9499 6.05034C19.1664 7.26687 20.5451 7.34797 20.5451 7.34797M10.1002 15.5876L8.4126 13.9"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </button>
                                        <button type="button" className="flex hover:text-danger" onClick={() => handleDeleteNews(id)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path
                                                    d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                ></path>
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path
                                                    opacity="0.5"
                                                    d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={totalRecords}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Toplam satır sayısı: ${totalRecords}`}
                    />
                </div>
            </div>
            <NewsModal
                open={open}
                setOpen={setOpen}
                open1={open1}
                setOpen1={setOpen1}
                info={info}
                setInfo={setInfo}
                refreshNewsList={refreshNewsList}
                defaultParams={defaultParams}
            />
        </div>
    );
};

export default Index;
