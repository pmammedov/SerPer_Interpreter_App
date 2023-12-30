import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import 'react-quill/dist/quill.snow.css';
import {getSentContact} from "@/services/message";
import {Tooltip} from "@mantine/core";

const InComingMessage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sent Message'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const [messsageList, setMesssageList] = useState([])
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSortedAndPaginatedMesssage = async () => {
            try {
                const sortOrder: string = sortStatus.direction === 'asc' ? sortStatus.columnAccessor : `-${sortStatus.columnAccessor}`;
                const response = await getSentContact(sortOrder, page, pageSize, search);
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

    return (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b]">
            <div className="invoice-table">
                <div className="mb-4.5 flex flex-col gap-5 px-5 md:flex-row md:items-center">
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
                                title: 'Konu',
                                accessor: 'title',
                                render: ({ title }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{title}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Gelen Mesaj',
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
                                                {message?.length > 25 ? `${message.slice(0, 25)}...` : message}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Gönderilen Mesaj',
                                accessor: 'message',
                                render: ({ reply }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={reply}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word' // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>
                                                {reply?.length > 25 ? `${reply.slice(0, 25)}...` : reply}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Gelen Mesaj Tarih',
                                accessor: 'created_at',
                                sortable: true,
                                render: ({ created_at }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{created_at}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Gönderilen Mesaj Tarih',
                                accessor: 'reply_at',
                                sortable: true,
                                render: ({ reply_at }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{reply_at}</div>
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
                        // selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Toplam satır sayısı: ${totalRecords}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default InComingMessage;
