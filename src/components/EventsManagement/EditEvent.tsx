import '../css/edit.css';
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";


interface EventProfile {
    id?: number;
    organizer_id: string;
    organizer_name: string;
    activity_id: string;
    title: string;
    description: string;
    location: string;
    open_date: string;
    close_date: string;
    status: string;
    image: string;
}

const API_BASE_URL = "https://daily-life-backend.vercel.app";

const EditEvent = () => {
    const [profile, setProfile] = useState<EventProfile | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("editEvent");
        if (data) {
            try {
                const parsed: EventProfile = JSON.parse(data);
                setProfile(parsed);
            } catch (error) {
                console.error("Error parsing localStorage 'editEvent':", error);
            }
        }
    }, []);

    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => prev ? { ...prev, [name]: value } : null);
        setMessage(null);
    };

    // Submit update
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!profile?.id) {
            setMessage({ success: false, text: "❌ Event ID ไม่พบ" });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await axios.put(
                `${API_BASE_URL}/event/edit/${profile.organizer_id}`,
                profile
            );

            setMessage({
                success: response.data.success,
                text: response.data.message
            });

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "เกิดข้อผิดพลาดขณะอัปเดต";
            setMessage({ success: false, text: `Update Failed: ${errorMsg}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile) return <p>Loading...</p>;

    const formatDateTimeLocal = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    return (
        <div className="view-user-container wider">
            <h2>📅 Edit Event: {profile.title}</h2>

            {message && (
                <div className={`alert ${message.success ? "alert-success" : "alert-error"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">

                {/* Basic Fields */}
                <div className="form-group-short">
                    <div className="form-group">
                        <label>Event ID</label>
                        <input
                            type="text"
                            value={profile.activity_id || ""}
                            disabled
                            className="read-only"
                            style={{
                                color:'black'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Activity ID</label>
                        <input
                            type="text"
                            name="activity_id"
                            value={profile.activity_id || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={profile.title || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group-short">
                    <div className="form-group">
                        <label>Organizer ID</label>
                        <input
                            type="text"
                            name="organizer_id"
                            value={profile.organizer_id || ""}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Organizer Name</label>
                        <input
                            type="text"
                            name="organizer_name"
                            value={profile.organizer_name || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={profile.description || ""}
                        onChange={handleInputChange}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1.5px solid #d0d0d0',
                            borderRadius: '8px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={profile.location || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group-short">
                    <div className="form-group">
                        <label>Open Date & Time</label>
                        <input
                            type="datetime-local"
                            name="open_date"
                            value={formatDateTimeLocal(profile.open_date)}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Close Date & Time</label>
                        <input
                            type="datetime-local"
                            name="close_date"
                            value={formatDateTimeLocal(profile.close_date)}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group-short">
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={profile.status || ""}
                            onChange={(e) => {
                                const event = {
                                    ...e,
                                    target: { ...e.target, name: "status" }
                                } as any;
                                handleInputChange(event);
                            }}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1.5px solid #d0d0d0',
                                borderRadius: '8px',
                                fontSize: '15px'
                            }}
                        >
                            <option value="">Select Status</option>
                            <option value="เปิดรับ">เปิดรับ (Open)</option>
                            <option value="ใกล้เต็ม">ใกล้เต็ม (Almost Full)</option>
                            <option value="ปิด">ปิด (Closed)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={profile.image || ""}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Image Preview */}
                {profile.image && (
                    <div className="form-group image-preview-container">
                        <div className="image-center">
                            <img
                                src={profile.image}
                                alt="Event Preview"
                                className="current-profile-image"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

            </form>
        </div>
    );
};

export default EditEvent;