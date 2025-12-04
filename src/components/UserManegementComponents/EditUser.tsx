import '../css/edit.css'
import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
// สมมติว่าคุณใช้ Axios ในการเรียก API
import axios from 'axios'; 

// NOTE: All properties were made optional (?) in the original code,
// but for the form state, we'll treat the keys we edit as required strings.
interface UserProfile {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
    profile_image?: string;
    created_at?: string;
}

const API_BASE_URL = "https://daily-life-backend.vercel.app"; // ⚠️ เปลี่ยนเป็น URL API ของคุณ

const EditUser = () => {
    
    // State สำหรับเก็บข้อมูลผู้ใช้ที่กำลังแก้ไข
    const [profile, setProfile] = useState<UserProfile>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

    // 1. โหลดข้อมูลจาก Local Storage (โค้ดเดิม)
    useEffect(() => {
        const datauser = localStorage.getItem("EditUser");

        if (datauser) {
            try {
                const parsedArray: UserProfile[] = JSON.parse(datauser);
                if (Array.isArray(parsedArray) && parsedArray.length > 0) {
                    setProfile(parsedArray[0]);
                }
            } catch (error) {
                console.error("Error parsing localStorage 'viewUser' data:", error);
            }
        }
    }, []);

    // 2. จัดการการเปลี่ยนแปลงของ Input Fields
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // อัปเดต State โดยเก็บค่าเดิมไว้ และเปลี่ยนแค่ field ที่ถูกแก้ไข
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
        // ล้างข้อความแจ้งเตือนเมื่อมีการแก้ไข
        setMessage(null); 
    };

    // 3. จัดการการ Submit Form
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!profile.id) {
            setMessage({ success: false, text: "Error: User ID not found." });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            // ดึงเฉพาะข้อมูลที่ต้องการส่งไปยัง API
            const updatePayload = {
                firstname: profile.firstname,
                lastname: profile.lastname,
                email: profile.email,
                phone: profile.phone,
                username: profile.username,
                password: profile.password, // ⚠️ ควรจัดการ hashing password ที่นี่หรือใน API
                profile_image: profile.profile_image,
            };

            const response = await axios.put(`${API_BASE_URL}/admin/user/${profile.id}`, updatePayload);

            setMessage({ 
                success: response.data.success, 
                text: response.data.message 
            });

            // Optional: รีเฟรชข้อมูลใน Local Storage หากอัปเดตสำเร็จ
            if (response.data.success) {
                // ... โค้ดสำหรับการรีเฟรชข้อมูลใน localStorage
            }

        } catch (error: any) {
            console.error("API Update Error:", error);
            const errorMsg = error.response?.data?.message || "An unknown error occurred during update.";
            setMessage({ 
                success: false, 
                text: `Update Failed: ${errorMsg}` 
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // หากไม่มีข้อมูลผู้ใช้
    if (!profile.id) {
        return (
             <div className="view-user-container">
                <h2>👤 Edit User</h2>
                <p>Loading user data, or data not found in local storage...</p>
            </div>
        );
    }

    // 4. ส่วนแสดงผล (JSX)
    return (
        <div className="view-user-container">
            <h2>✍️ Edit User: {profile.username}</h2>
            
            {message && (
                <div className={`alert ${message.success ? 'alert-success' : 'alert-error'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">
                
                {/* ⚠️ ID และ Created At ควรแสดงเป็น Read-Only */}
                <div className="form-group">
                    <label>User ID</label>
                    <input type="text" value={profile.id} readOnly className="read-only" />
                </div>
                
                {/* 5. Input Fields ที่แก้ไขได้ */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input 
                            type="text" 
                            id="firstname" 
                            name="firstname" 
                            value={profile.firstname || ''} 
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastname">Last Name</label>
                        <input 
                            type="text" 
                            id="lastname" 
                            name="lastname" 
                            value={profile.lastname || ''} 
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={profile.username || ''} 
                        onChange={handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={profile.email || ''} 
                        onChange={handleInputChange} 
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={profile.phone || ''} 
                        onChange={handleInputChange} 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password (Leave blank to keep existing)</label>
                    {/* NOTE: เราจะไม่แสดงรหัสผ่านปัจจุบันใน field นี้ เพื่อความปลอดภัย */}
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={profile.password || ''} 
                        onChange={handleInputChange} 
                        // เนื่องจาก API ของคุณอนุญาตให้ส่ง field ว่างเพื่อไม่เปลี่ยนรหัสผ่าน
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="profile_image">Profile Image URL</label>
                    <input 
                        type="text" 
                        id="profile_image" 
                        name="profile_image" 
                        value={profile.profile_image || ''} 
                        onChange={handleInputChange} 
                    />
                    {profile.profile_image && (
                        <img src={profile.profile_image} alt="Current Profile" className="current-profile-image" />
                    )}
                </div>

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}

export default EditUser;