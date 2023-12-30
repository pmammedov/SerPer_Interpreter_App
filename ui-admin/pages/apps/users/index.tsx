import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@/store';
import { setPageTitle } from '@/store/themeConfigSlice';
import 'react-toastify/dist/ReactToastify.css';
import { errorToastMessage, succesToastMessage } from '@/components/toastify';
import { deleteUser, editUser, getUsers, manyDeleteUsers } from '@/services/users';
import EditUser from '@/pages/apps/users/components/editUser';

const Users = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Users'));
    });
    const defaultParams = {
        id: null,
        email: '',
        full_name: '',
        status: 0,
        is_active: false,
        is_deleted: false,
        is_staff: false,
        is_superuser: false,
    };

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme) === 'dark' ? true : false;
    const [usersList, setUsersList] = useState([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'firstName',
        direction: 'asc',
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [info, setInfo] = useState({});

    useEffect(() => {
        const fetchSortedAndPaginatedNews = async () => {
            try {
                const sortOrder: string = sortStatus.direction === 'asc' ? sortStatus.columnAccessor : `-${sortStatus.columnAccessor}`;
                const response = await getUsers(sortOrder, page, pageSize, search);
                if (response.data) {
                    setUsersList(response.data.data); // Güncellenmiş kullanıcı listesi
                    setTotalRecords(response.data.total); // Toplam kayıt sayısını API'dan al
                } else {
                    console.error('The expected data structure could not be obtained');
                }
            } catch (error) {
                console.error('An error occurred while retrieving news:', error);
            }
        };

        fetchSortedAndPaginatedNews();
    }, [sortStatus, page, pageSize, search]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const handleDeleteNews = async (id: number) => {
        try {
            await deleteUser(id);
            // Haber başarıyla silindikten sonra haber listesini güncelle
            const response = await getUsers(sortStatus.columnAccessor, page, pageSize);
            succesToastMessage(`User deleted successfully.`, 1500);
            setUsersList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('An error occurred while deleting the user:', error);
            errorToastMessage(`Kullanıcı silinirken hata oluştu:.`, 1500);
        }
    };

    const refreshUsersList = async () => {
        try {
            const response = await getUsers(sortStatus.columnAccessor, page, pageSize);
            setUsersList(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Haberler yeniden çekilirken hata oluştu:', error);
        }
    };

    const selectUsersForEdit = (newsItem: any) => {
        setInfo(newsItem); // Seçilen kullanıclarının bilgilerini saklayın
        setOpen(true); // Modalı açın
    };

    const handleManyDelete = async () => {
        try {
            const idsToDelete = selectedRecords.map((record: { id: any }) => record.id);
            console.log(idsToDelete);
            await manyDeleteUsers({ ids: idsToDelete });
            succesToastMessage(`Selected users were successfully deleted`, 1500);
            await refreshUsersList();
        } catch (error) {
            console.error('An error occurred while deleting users:', error);
            errorToastMessage(`An error occurred while deleting users`, 1500);
        }
    };

    const handleSuperuserChange = async (userId: never, newIsSuperuser: boolean) => {
        try {
            // @ts-ignore
            const currentUser = usersList.find((user) => user.id === userId);
            if (!currentUser) {
                throw new Error('Kullanıcı bulunamadı');
            }

            const updatedStatus = newIsSuperuser ? 2 : 1;

            const response = await editUser(userId, {
                is_superuser: newIsSuperuser,
                status: updatedStatus,
                email: currentUser.email,
            });

            if (response.data) {
                succesToastMessage(`Kullanıcı durumu başarılı ile güncellendi.`, 1500);
                refreshUsersList();
            }
        } catch (error) {
            console.error('Kullanıcı durumu güncellenirken hata:', error);
            errorToastMessage(`Kullanıcı durumu güncellenirken hata oluştu.`, 1500);
        }
    };

    const getUserRole = (status: number) => {
        switch (status) {
            case 0:
                return 'User';
            case 1:
                return 'Admin';
            case 2:
                return 'Super Admin';
            default:
                return 'Unknown Role';
        }
    };

    const handleAddUser = () => {
        setInfo({ ...defaultParams });
        setOpen(true);
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
                        <button type="button" className="btn btn-primary gap-2" onClick={handleAddUser}>
                            <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Yeni Kullanıcı Ekle
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className={`${isDark} table-hover whitespace-nowrap`}
                        records={usersList}
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
                                title: 'Name Surname',
                                accessor: 'full_name',
                                render: ({ full_name }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{full_name}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'E-mail',
                                accessor: 'email',
                                render: ({ email }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{email}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Registration Date',
                                accessor: 'created_at',
                                sortable: true,
                                render: ({ created_at }) => (
                                    <div className="flex items-center font-semibold">
                                        <div>{created_at}</div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Role',
                                accessor: 'status',
                                sortable: true,
                                render: ({ status }) => (
                                    <span
                                        style={{
                                            color: status === 2 ? 'green' : status === 1 ? 'orange' : 'red',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {getUserRole(status)}
                                    </span>
                                ),
                            },
                            {
                                title: 'SuperAdmin Permission',
                                accessor: 'is_superuser',
                                sortable: true,
                                render: ({ id, is_superuser, status }) => (
                                    <label className="relative h-6 w-12">
                                        <input
                                            type="checkbox"
                                            className="custom_switch peer absolute z-10 h-full w-full cursor-pointer opacity-0"
                                            id={`superuser-${id}`}
                                            checked={is_superuser && status === 2}
                                            onChange={(e) => handleSuperuserChange(id, e.target.checked)}
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
                                render: ({ id, email, full_name, status, is_active, is_deleted, is_superuser, created_at }) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <button
                                            onClick={() =>
                                                selectUsersForEdit({
                                                    id,
                                                    email,
                                                    full_name,
                                                    status,
                                                    is_active,
                                                    is_deleted,
                                                    is_superuser,
                                                    created_at,
                                                })
                                            }
                                            className="flex hover:text-info"
                                        >
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
                        paginationText={({ from, to, totalRecords }) => `Total number of rows: ${totalRecords}`}
                    />
                </div>
            </div>
            <EditUser open={open} setOpen={setOpen} info={info} setInfo={setInfo} refreshUsersList={refreshUsersList} isNewUser={info.id === null} />
        </div>
    );
};

export default Users;
