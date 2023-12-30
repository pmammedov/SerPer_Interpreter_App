import React, {forwardRef, useEffect, useState} from 'react';
import {editReply, getContactId} from "@/services/message";
import 'react-toastify/dist/ReactToastify.css';
import {errorToastMessage, succesToastMessage} from "@/components/toastify";

interface ReplyModalProps {
    id: number | null;
    onClose: () => void;
}
const ReplyModal = forwardRef<HTMLDivElement, ReplyModalProps>(({ id, onClose }, ref) => {
    const [details, setDetails] = useState({});
    const [replyMessage, setReplyMessage] = useState('');

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

    const handleSend = async () => {
        try {
            const dataToSend = {
                reply_message: replyMessage
            };

            const response = await editReply(id, dataToSend);

            if (response.status === 200) {
                succesToastMessage("Mesaj başarıyla gönderildi.", 1500);
                onClose(); // Close the Modal
                window.location.reload(); // Refresh the page
            }
        } catch (error) {
            console.error('Mesaj gönderilirken hata oluştu:', error);
            errorToastMessage("Mesaj gönderilmedi.", 1500);
        }
    };

    return (
        <div ref={ref} className="panel m-auto w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
            <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                <div className="text-lg font-bold">Gönderilecek Mesaj</div>
            </div>
            {/* Modal content will be here */}
            <div className="px-4 py-2">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label htmlFor="first_name">İsim</label>
                        <input type="text" id="first_name" className="form-input" value={details.first_name} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Soyisim</label>
                        <input type="text" id="last_name" className="form-input" value={details.last_name} readOnly />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label>E-posta</label>
                        <input type="text" className="form-input" value={details.email} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Telefon</label>
                        <input type="text" className="form-input" value={details.phone} readOnly />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="form-group">
                        <label>Konu</label>
                        <input type="text" className="form-input" value={details.title} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Mesaj Tarih</label>
                        <input type="text" className="form-input" value={details.created_at} readOnly />
                    </div>
                </div>
                <div className="form-group">
                    <label>Gelen Mesaj</label>
                    <textarea className="form-input" value={details.message} readOnly></textarea>
                </div>
                <div className="form-group">
                    <label>Gönderilecek Mesaj</label>
                    <textarea
                        className="form-input"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="btn btn-success" onClick={handleSend}>
                        Gönder
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onClose}>
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ReplyModal;
