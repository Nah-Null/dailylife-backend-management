import '../css/view.css'
import { useState, useEffect } from "react";

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

const ViewUser = () => {

    const [profile, setProfile] = useState<UserProfile>({});

    useEffect(() => {
        const datauser = localStorage.getItem("viewUser");

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

    const fullName = `${profile.firstname || ''} ${profile.lastname || ''}`.trim();

    return (
        <div className="view-user-container">
            <h2>👤 User Details</h2>

            {/* check ว่ามีข้อมูล */}
            {profile.id ? (
                <div className="profile-card">

                    {profile.profile_image && (
                        <img
                            src={profile.profile_image}
                            alt={`${fullName}'s profile`}
                            className="profile-image"
                        />
                    )}

                    <dl className="profile-details-list">
                        <dt>ID:</dt>
                        <dd>{profile.id}</dd>

                        <dt>Full Name:</dt>
                        <dd>{fullName || 'N/A'}</dd>

                        <dt>Username:</dt>
                        <dd>{profile.username || 'N/A'}</dd>

                        <dt>Password:</dt>
                        <dd>{profile.password || 'N/A'}</dd>

                        <dt>Email:</dt>
                        <dd>{profile.email || 'N/A'}</dd>

                        <dt>Phone:</dt>
                        <dd>{profile.phone || 'N/A'}</dd>

                        <dt>Profile-image:</dt>
                        <dd>{profile.profile_image || 'N/A'}</dd>

                        <dt>Account Created:</dt>
                        <dd>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</dd>
                    </dl>
                </div>
            ) : (
                <p>Loading user data, or data not found in local storage...</p>
            )}
        </div>
    )
}

export default ViewUser;
