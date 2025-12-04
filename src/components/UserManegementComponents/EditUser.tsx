import "../css/edit.css";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

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

const API_BASE_URL = "https://daily-life-backend.vercel.app";

const EditUser = () => {
    const [profile, setProfile] = useState<UserProfile>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

    // Load user from localStorage
    useEffect(() => {
        const datauser = localStorage.getItem("EditUser");

        if (datauser) {
            try {
                // 🟢 แก้ 1: parse เป็น object ไม่ใช่ array
                const parsedData: UserProfile = JSON.parse(datauser);
                console.log("Parsed user:", parsedData);

                // 🟢 แก้ 2: setProfile โดยตรง
                setProfile(parsedData);

            } catch (error) {
                console.error("Error parsing localStorage 'viewUser' data:", error);
            }
        }
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMessage(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!profile.id) {
            setMessage({ success: false, text: "Error: User ID not found." });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const updatePayload = {
                firstname: profile.firstname,
                lastname: profile.lastname,
                email: profile.email,
                phone: profile.phone,
                username: profile.username,
                password: profile.password,
                profile_image: profile.profile_image,
            };

            const response = await axios.put(
                `${API_BASE_URL}/admin/user/${profile.id}`,
                updatePayload
            );

            setMessage({
                success: response.data.success,
                text: response.data.message,
            });

            if (response.data.success) {
                const newLocal = [{ ...profile, ...updatePayload }];
                localStorage.setItem("EditUser", JSON.stringify(newLocal));
            }
        } catch (error: any) {
            console.error("API Update Error:", error);
            const errorMsg =
                error.response?.data?.message ||
                "An unknown error occurred during update.";

            setMessage({ success: false, text: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile.id) {
        return (
            <div className="view-user-container">
                <h2>👤 Edit User</h2>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="view-user-container">
            <h2>✍️ Edit User: {profile.username}</h2>

            {message && (
                <div
                    className={`alert ${message.success ? "alert-success" : "alert-error"
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-group">
                    <label>User ID</label>
                    <input
                        type="text"
                        value={profile.id}
                        readOnly
                        className="read-only"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstname">First Name</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={profile.firstname || ""}
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
                            value={profile.lastname || ""}
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
                        value={profile.username || ""}
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
                        value={profile.email || ""}
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
                        value={profile.phone || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password (Leave blank to keep existing)</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={profile.password || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profile_image">Profile Image URL</label>
                    <input
                        type="text"
                        id="profile_image"
                        name="profile_image"
                        value={profile.profile_image || ""}
                        onChange={handleInputChange}
                    />

                    {profile.profile_image && (
                        <img
                            src={profile.profile_image}
                            alt="Current Profile"
                            className="current-profile-image"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-button"
                >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

export default EditUser;
