import React, {forwardRef, useEffect, useState} from 'react';
import { getContactId } from '@/services/message';

interface MessageDetailProps {
    id: number | null; // The type of 'id' can be either number or null
    onClose: () => void; // onClose is a function and it doesn't return anything
}

const MessageDetail = forwardRef<HTMLDivElement, MessageDetailProps>(({ id, onClose }, ref) => {
    const [details, setDetails] = useState({});

    useEffect(() => {
        const fetchDetails = async () => {
            if (id) {
                try {
                    const response = await getContactId(id);
                    setDetails(response.data);
                } catch (error) {
                    console.error('Detaylar yüklenirken hata:', error);
                }
            }
        };

        fetchDetails();
    }, [id]);


    return (
        <div ref={ref} className="panel m-auto w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                <div className="text-lg font-bold">Incoming Message Information</div>
            </div>
            {/* Modal content will be here */}
            <div className="px-4 py-2">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label htmlFor="first_name">Name</label>
                        <input type="text" id="first_name" className="form-input" value={details.first_name} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Surname</label>
                        <input type="text" id="last_name" className="form-input" value={details.last_name} readOnly />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="text" className="form-input" value={details.email} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Telephone</label>
                        <input type="text" className="form-input" value={details.phone} readOnly />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label>Message Time</label>
                        <input type="text" className="form-input" value={details.created_at} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <div className="form-input" style={{ color: details.is_reply ? 'green' : 'red' }}>
                            {details.is_reply ? 'Cevap verildi' : 'Cevap verilmedi'}
                        </div>
                    </div>
                </div>
                <div className="form-group mb-2">
                    <label>Subject</label>
                    <input type="text" className="form-input" value={details.title} readOnly />
                </div>
                <div className="form-group">
                    <label>Message</label>
                    <textarea className="form-input" value={details.message} readOnly></textarea>
                </div>
                <div className="mt-3 flex items-center justify-end">
                    <button type="button" className="btn btn-outline-danger"  onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
});

export default MessageDetail;
