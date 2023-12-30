import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {IRootState} from '@/store';
import {setPageTitle} from '@/store/themeConfigSlice';
import Dropdown from '../../../components/Dropdown';
import {Dialog, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import {errorToastMessage, succesToastMessage} from "@/components/toastify";
import {deleteContact, editContact, getContact, manyDeleteContact} from "@/services/message";
import {Tooltip} from "@mantine/core";
import MessageDetail from "@/pages/apps/message/components/messageDetail";
import ReplyModal from "@/pages/apps/message/components/replyModal";

const InComingMessage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Gelen Mesajlar'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const [messsageList, setMesssageList] = useState([])
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
    const [search, setSearch] = useState('');
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [modal1, setModal1] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    useEffect(() => {
        const fetchSortedAndPaginatedMesssage = async () => {
            try {
                const sortOrder: string = sortStatus.direction === 'asc' ? sortStatus.columnAccessor : `-${sortStatus.columnAccessor}`;
                const response = await getContact(sortOrder, page, pageSize, search);
                if (response.data) {
                    setMesssageList(response.data.data); // Güncellenmiş mesajlar listesi
                    setTotalRecords(response.data.total); // Toplam kayıt sayısını API'dan al
                } else {
                    console.error('Beklenen veri yapısı alınamadı');
                }
            } catch (error) {
                console.error('Mesajlar alınırken hata oluştu:', error);
            }
        };

        fetchSortedAndPaginatedMesssage();
    }, [sortStatus, page, pageSize, search]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const handleDeleteNews = async (id: number) => {
        try {
            await deleteContact(id);
            // Haber başarıyla silindikten sonra haber listesini güncelle
            const response = await getContact(sortStatus.columnAccessor, page, pageSize);
            succesToastMessage(`Mesaj başarı ile silindi.`, 1500);
            setMesssageList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Mesaj silinirken hata oluştu:', error);
            errorToastMessage(`Mesaj silinirken hata oluştu.`, 1500);
        }
    };

    const refreshMesssageList = async () => {
        try {
            const response = await getContact(sortStatus.columnAccessor, page, pageSize);
            setMesssageList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Mesajlar yeniden çekilirken hata oluştu:', error);
        }
    };

    const downloadFile = async (fileUrl: any, pdf: string) => {
        try {
            // URL'den dosya adını elde etme
            const fileName = fileUrl.split('/').pop();

            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Dosya indirilemedi');
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            // Başarılı indirme sonrası toast mesajı
            succesToastMessage("Dosya başarıyla indirildi", 1500);
        } catch (error) {
            console.error('Dosya indirme hatası:', error);

            // Hata durumunda toast mesajı
            errorToastMessage("Dosya indirilemedi", 1500);
        }
    };

    const openMessageDetails = async (id: any) => {
        setSelectedMessageId(id);
        setOpen(true);

        // API çağrısı yaparak mesajın is_active durumunu True olarak güncelle
        try {
            const response = await editContact(id, { is_active: true });
            if (response.status === 200) {
                succesToastMessage("Mesaj okundu olarak işaretlendi.", 1500);
                refreshMesssageList(); // Listeyi yenilemek için çağır
            }
        } catch (error) {
            console.error('Mesaj durumu güncellenirken hata oluştu:', error);
            errorToastMessage("Mesaj durumu güncellenemedi.", 1500);
        }
    };

    // Okunmadı olarak işaretle butonu için event handler
    const handleMarkAsUnread = async (id:any) => {
        try {
            const response = await editContact(id, { is_active: false });
            if (response.status === 200) {
                succesToastMessage("Mesaj okunmadı olarak işaretlendi.", 1500);
                refreshMesssageList(); // Mesaj listesini yenile
            }
        } catch (error) {
            console.error('Mesaj durumu güncellenirken hata oluştu:', error);
            errorToastMessage("Mesaj durumu güncellenemedi.", 1500);
        }
    };

    const openReplyMessage = async (id: any) => {
        setSelectedMessageId(id);
        setModal1(true);

        // API çağrısı yaparak mesajın is_active durumunu True olarak güncelle
        try {
            const response = await editContact(id, { is_active: true });
            if (response.status === 200) {
                succesToastMessage("Mesaj okundu olarak işaretlendi.", 1500);
                refreshMesssageList(); // Listeyi yenilemek için çağır
            }
        } catch (error) {
            console.error('Mesaj durumu güncellenirken hata oluştu:', error);
            errorToastMessage("Mesaj durumu güncellenemedi.", 1500);
        }
    };

    const handleManyDelete = async () => {
        try {
            const idsToDelete = selectedRecords.map((record: { id: any; }) => record.id);
            console.log(idsToDelete);
            await manyDeleteContact({ ids: idsToDelete });
            succesToastMessage(`Seçilen diller başarı ile silindi.`, 1500);
            await refreshMesssageList();
        } catch (error) {
            console.error('Diller silinirken hata oluştu:', error);
            errorToastMessage(`Diller silinemedi.`, 1500);
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
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={messsageList}
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
                                title: 'İsim',
                                accessor: 'first_name',
                                render: ({ first_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{first_name}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Soyisim',
                                accessor: 'last_name',
                                render: ({ last_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'E-posta',
                                accessor: 'email',
                                render: ({ email }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{email}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Telefon',
                                accessor: 'phone',
                                render: ({ phone }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{phone}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Mesaj Tarih',
                                accessor: 'created_at',
                                sortable: true,
                                render: ({ created_at }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{created_at}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Konu',
                                accessor: 'title',
                                render: ({ title }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{title}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Mesaj',
                                accessor: 'message',
                                render: ({ message }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={message}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word' // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>
                                                {message?.length > 20 ? `${message.slice(0, 20)}...` : message}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Cevap Durumu',
                                accessor: 'is_reply',
                                sortable: true,
                                render: ({ is_reply }) => (
                                    <span
                                        style={{
                                            color: is_reply ? 'green' : 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {is_reply ? 'Cevap verildi' : 'Cevap verilmedi'}
                                    </span>
                                ),
                            },
                            {
                                title: 'Okunma Durumu',
                                accessor: 'is_active',
                                sortable: true,
                                render: ({ is_active }) => (
                                    <span
                                        style={{
                                            color: is_active ? 'green' : 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {is_active ? 'Okundu' : 'Okunmadı'}
                                    </span>
                                ),
                            },
                            {
                                title: 'Dosya',
                                accessor: 'file_path',
                                render: ({ file_path }) => (
                                    <div className="flex items-center font-semibold">
                                        {file_path ? (
                                            <button
                                                onClick={() => downloadFile(file_path, 'indirilecek_dosya.pdf')}
                                                className="btn btn-primary"
                                            >
                                                İndir
                                            </button>
                                        ) : (
                                            <div>Dosya Yok</div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'İşlemler',
                                title: 'İşlemler',
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="dropdown">
                                        <Dropdown
                                            offset={[0, 5]}
                                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                            button={
                                                <svg className="m-auto h-5 w-5 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                    <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                                </svg>
                                            }
                                        >
                                            <ul>
                                                <li>
                                                    <button type="button" onClick={() => openMessageDetails(id)}>
                                                        Oku
                                                    </button>
                                                </li>
                                                <li>
                                                    <button type="button" onClick={() => openReplyMessage(id)}>
                                                        Cevapla
                                                    </button>
                                                </li>
                                                <li>
                                                    <button type="button" onClick={() => handleMarkAsUnread(id)}>
                                                        Okunmadı olarak işaretle
                                                    </button>
                                                </li>
                                                <li>
                                                    <button type="button" onClick={() => handleDeleteNews(id)}>
                                                        Sil
                                                    </button>
                                                </li>
                                            </ul>
                                        </Dropdown>
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
            {/* Yanıtla modal */}
            <Transition appear show={modal1} as={Fragment}>
                <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <ReplyModal id={selectedMessageId} onClose={() => setModal1(false)} />
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {/* oku modal */}
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" open={open} onClose={() => setOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <MessageDetail id={selectedMessageId} onClose={() => setOpen(false)} />
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default InComingMessage;
