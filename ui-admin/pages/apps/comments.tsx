import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { Fragment } from 'react';
import 'react-quill/dist/quill.snow.css';
import {deleteComments, getComments, editComments, manyDeleteComments} from '@/services/comments';
import { Tooltip } from '@mantine/core';
import 'react-toastify/dist/ReactToastify.css';
import { errorToastMessage, succesToastMessage } from '@/components/toastify';

const Comments = () => {
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Comments'));
    });
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const [commentList, setCommentList] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [info, setInfo] = useState({});
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [selectedItemId, setSelectedItemId] = useState({});
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });

    useEffect(() => {
        const fetchSortedAndPaginatedComment = async () => {
            try {
                const sortOrder: string = sortStatus.direction === 'asc' ? sortStatus.columnAccessor : `-${sortStatus.columnAccessor}`;
                const response = await getComments(sortOrder, page, pageSize, search);
                if (response.data) {
                    setCommentList(response.data.data); // Güncellenmiş Yorumlar listesi
                    setTotalRecords(response.data.total); // Toplam kayıt sayısını API'dan al
                } else {
                    console.error('The expected data structure could not be obtained');
                }
            } catch (error) {
                console.error('An error occurred while retrieving comments:', error);
            }
        };

        fetchSortedAndPaginatedComment();
    }, [sortStatus, page, pageSize, search]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const handleDeleteComment = async (id: number) => {
        try {
            await deleteComments(id);
            // Yorumlar başarıyla silindikten sonra Yorumlar listesini güncelle
            const response = await getComments(sortStatus.columnAccessor, page, pageSize);
            succesToastMessage(`Comment deleted successfully`, 1500);
            setCommentList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('An error occurred while deleting the comment:', error);
            errorToastMessage(`Comment could not be deleted`, 1500);
        }
    };

    const refreshCommentsList = async () => {
        try {
            const response = await getComments(sortStatus.columnAccessor, page, pageSize);
            setCommentList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('An error occurred while retrieving comments:', error);
        }
    }


        // Update the is_active status of the selected row
    const handleCheckChange = async (commentsId: never, newIsActive: boolean) => {
        try {
            const currentUser = commentList.find((news: { id: any }) => news.id === commentsId);
            if (!currentUser) {
                throw new Error('No comments found');
            }

            const response = await editComments(commentsId, {
                is_active: newIsActive,
            });

            if (response.data) {
                succesToastMessage(`Comment status updated successfully`, 1500);
                refreshCommentsList();
            }
        } catch (error) {
            console.error('Error occurred while updating comment status:', error);
            errorToastMessage(`Error occurred while updating comment status:`, 1500);
        }
    };

    const selectCommentForEdit = (commentItem: any) => {
        setSelectedItemId(commentItem); // Seçilen yorumun bilgilerini saklayın
        setOpen(true); // Modalı açın
        // console.log('SelectedItemId', selectedItemId);
    };

    const refreshCommentList = async () => {
        try {
            const response = await getComments(sortStatus.columnAccessor, page, pageSize);
            setCommentList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Yorumlar alınırken hata oluştu:', error);
        }
    }
    const handleManyDelete = async () => {
        try {
            const idsToDelete = selectedRecords.map((record: { id: any; }) => record.id);
            console.log(idsToDelete);
            await manyDeleteComments({ ids: idsToDelete });
            succesToastMessage(`Seçilen diller başarı ile silindi.`, 1500);
            refreshCommentList();
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
                        records={commentList}
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
                                title: 'Name',
                                accessor: 'first_name',
                                render: ({ first_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{first_name}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Last Name',
                                accessor: 'last_name',
                                render: ({ last_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{last_name}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Email',
                                accessor: 'Email',
                                render: ({ email }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={email}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word', // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>{email?.length > 25 ? `${email.slice(0, 25)}...` : email}</div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Yorum',
                                accessor: 'Yorum',
                                render: ({ comment }) => (
                                    <div className="flex items-center font-semibold">
                                        <Tooltip
                                            label={comment}
                                            position="bottom"
                                            withArrow
                                            style={{
                                                maxWidth: '500px', // Maksimum genişlik değeri
                                                whiteSpace: 'normal', // İçerik uzunsa yeni satıra geç
                                                wordBreak: 'break-word', // Uzun kelimeleri satır sonlarında böl
                                            }}
                                        >
                                            <div>{comment?.length > 25 ? `${comment.slice(0, 25)}...` : comment}</div>
                                        </Tooltip>
                                    </div>
                                ),
                            },
                            {
                                title: 'Post Status',
                                accessor: 'is_active',
                                sortable: true,
                                render: ({ id, is_active }) => (
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id={`comments-${id}`}
                                            checked={is_active}
                                            onChange={(e) => handleCheckChange(id, e.target.checked)}
                                        />
                                        <span className="outline_checkbox bg-icon block h-full rounded-full border-2 border-[#ebedf2] before:absolute before:bottom-1 before:left-1 before:h-4 before:w-4 before:rounded-full before:bg-[#ebedf2] before:bg-[url(/assets/images/close.svg)] before:bg-center before:bg-no-repeat before:transition-all before:duration-300 peer-checked:border-primary peer-checked:before:left-7 peer-checked:before:bg-primary peer-checked:before:bg-[url(/assets/images/checked.svg)] dark:border-white-dark dark:before:bg-white-dark"></span>
                                    </label>
                                ),
                            },
                            {
                                accessor: 'Operations',
                                title: 'Operations',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id, comment }) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button type="button" className="flex hover:text-danger" onClick={() => selectCommentForEdit({ id, comment })}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    opacity="0.5"
                                                    d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path
                                                    d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                            </svg>
                                        </button>
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => handleDeleteComment(id)}>
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
            <Transition appear show={open} as={Fragment}>
                <Dialog
                    as="div"
                    open={open}
                    onClose={() => {
                        setOpen(false);
                        setSelectedItemId({});
                    }}
                >
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
                                <Dialog.Panel as="div" className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                    <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                        <div className="text-lg font-bold">Yorum</div>
                                    </div>
                                    <div className="p-5">
                                        <p>
                                            {commentList.map((item) => {
                                                if (item.id === selectedItemId?.id) {
                                                    return <span key={item?.id}>{selectedItemId?.comment}</span>;
                                                }
                                                return null;
                                            })}
                                        </p>
                                        <div className="mt-8 flex items-center justify-end">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setOpen(false)}>
                                                Kapat
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Comments;
