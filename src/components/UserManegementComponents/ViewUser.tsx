import '../css/view.css'
import { useState, useEffect } from "react";

// NOTE: All properties were made optional (?) in the original code,
// which is usually fine for a state variable that might start empty.
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

    // Initialize state as an empty object conforming to UserProfile
    const [profile, setProfile] = useState<UserProfile>({});

    useEffect(() => {
        const datauser = localStorage.getItem("viewUser");

        if (datauser) {
            try {
                // 1. Parse the string into an Array of UserProfile objects
                const parsedArray: UserProfile[] = JSON.parse(datauser);

                // 2. Check if the array exists and has at least one element
                if (Array.isArray(parsedArray) && parsedArray.length > 0) {

                    // 3. Get the first user object from the array (index 0)
                    const userProfile: UserProfile = parsedArray[0];

                    // 4. Set State
                    setProfile(userProfile);

                    console.log("Successfully set user profile from array:", userProfile);
                } else {
                    console.warn("Parsed data is an empty array.");
                }
            } catch (error) {
                console.error("Error parsing localStorage 'viewUser' data:", error);
            }
        }
    }, []);

    // Helper to format the full name
    const fullName = `${profile.firstname || ''} ${profile.lastname || ''}`.trim();

    return (
        <div className="view-user-container">
            <h2>👤 User Details</h2>
            {/* Conditional Rendering: Check if the profile object has been loaded (e.g., check for an ID) */}
            {profile.id ? (
                <div className="profile-card">
                    {/* Display the profile image */}
                    {profile.profile_image && (
                        <img
                            src={profile.profile_image}
                            alt={`${fullName}'s profile`}
                            className="profile-image"
                        />
                    )}

                    {/* Display the details in a structured way */}
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

                        {/* ⚠️ NOTE: We should generally NOT display the 'password' field in a view component. */}
                    </dl>
                </div>
            ) : (
                <p>Loading user data, or data not found in local storage...</p>
            )}
        </div>
    )
}
export default ViewUser;