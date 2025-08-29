// EditModal.jsx
import React, { useEffect, useState } from "react";

const initialFormData = {
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    people: "",
    message: ""
};

const EditModal = ({ isOpen, onClose, data, onSave }) => {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        // Reset form data mỗi khi modal mở và data thay đổi
        if (isOpen && data) {
            setFormData({
                ...initialFormData,
                ...data
            });
        }
    }, [isOpen, data]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        await onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black-75 z-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-xl p-6 w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">Edit Reservation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input name="name" value={formData?.name || ''} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
                    <input name="email" value={formData?.email || ''} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
                    <input name="phone" value={formData?.phone || ''} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
                    <input name="date" type="date" value={formData?.date ? formData.date.slice(0, 10) : ''} onChange={handleChange} className="border p-2 rounded" />
                    <input name="time" type="time" value={formData?.time || ''} onChange={handleChange} className="border p-2 rounded" />
                    <input name="people" value={formData?.people || ''} onChange={handleChange} placeholder="People" className="border p-2 rounded" />
                    <textarea name="message" value={formData?.message || ''} onChange={handleChange} placeholder="Message" className="border p-2 rounded col-span-1 sm:col-span-2" />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
