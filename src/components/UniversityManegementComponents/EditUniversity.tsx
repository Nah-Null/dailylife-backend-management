import '../css/edit.css';
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Campus {
    campus_id: number;
    campus_name: string;
}

interface Faculty {
    id: number;
    faculty_name: string;
}

interface Major {
    id: number;
    major_name: string;
}

interface RawJSON {
    logo: string;
}

interface UniversityProfile {
    id?: number;
    university_th?: string;
    university_en?: string;
    university_shortname?: string;
    university_type?: string;
    province?: string;
    website?: string;
    logo?: string;
    campuses: Campus[];
    faculties: Faculty[];
    majors: Major[];
    raw_json: RawJSON;
}

const API_BASE_URL = "https://daily-life-backend.vercel.app";

const EditUniversity = () => {

    const [profile, setProfile] = useState<UniversityProfile | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("editUniversity");
        if (data) {
            try {
                const parsed: UniversityProfile = JSON.parse(data);
                setProfile(parsed);
            } catch (error) {
                console.error("Error parsing localStorage 'editUniversity':", error);
            }
        }
    }, []);

    // -----------------------------
    // Handle Input (normal fields)
    // -----------------------------
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value } as UniversityProfile));
        setMessage(null);
    };

    // -----------------------------
    // Dynamic Input Handlers
    // -----------------------------
    const handleDynamicChange = (
        type: "campuses" | "faculties" | "majors",
        index: number,
        field: string,
        value: string
    ) => {
        if (!profile) return;

        const updatedArray = [...profile[type]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };

        setProfile(prev => ({
            ...prev!,
            [type]: updatedArray
        }));
    };

    const addDynamicItem = (type: "campuses" | "faculties" | "majors") => {
        if (!profile) return;

        const newItem =
            type === "campuses"
                ? { campus_id: Date.now(), campus_name: "" }
                : type === "faculties"
                    ? { id: Date.now(), faculty_name: "" }
                    : { id: Date.now(), major_name: "" };

        setProfile(prev => ({
            ...prev!,
            [type]: [...prev![type], newItem]
        }));
    };

    const removeDynamicItem = (
        type: "campuses" | "faculties" | "majors",
        index: number
    ) => {
        if (!profile) return;

        const filtered = profile[type].filter((_, i) => i !== index);

        setProfile(prev => ({
            ...prev!,
            [type]: filtered
        }));
    };

    // -----------------------------
    // Submit Update
    // -----------------------------
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!profile?.id) {
            setMessage({ success: false, text: "❌ University ID ไม่พบ" });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const updatePayload = {
                ...profile,
                campuses: profile.campuses,
                faculties: profile.faculties,
                majors: profile.majors
            };

            const response = await axios.put(
                `${API_BASE_URL}/university/edit/${profile.id}`,
                updatePayload
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

    return (
        <div className="view-user-container wider">
            <h2>🏫 Edit University: {profile.university_en}</h2>

            {message && (
                <div className={`alert ${message.success ? "alert-success" : "alert-error"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">

                {/* Basic Fields */}
                <div className="form-group">
                    <label>ID</label>
                    <input
                        type="text"
                        name="university_th"
                        value={profile.id || ""}
                        onChange={handleInputChange}
                        className="read-only"
                        style={{ color: "black" }}
                    />
                </div>
                <div className="form-group">
                    <label>University TH</label>
                    <input
                        type="text"
                        name="university_th"
                        value={profile.university_th || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>University EN</label>
                    <input
                        type="text"
                        name="university_th"
                        value={profile.university_en || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>University EN</label>
                    <input
                        type="text"
                        name="university_th"
                        value={profile.university_type || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Short Name</label>
                    <input
                        type="text"
                        name="university_shortname"
                        value={profile.university_shortname || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>University Type</label>
                    <input
                        type="text"
                        name="university_shortname"
                        value={profile.university_type || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Province</label>
                    <input
                        type="text"
                        name="university_shortname"
                        value={profile.province || ""}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Website</label>
                    <input
                        type="text"
                        name="university_shortname"
                        value={profile.website || ""}
                        onChange={handleInputChange}
                    />
                </div>

                {/* IMAGE */}
                <div className="form-group image-preview-container">
                    <label>University Logo URL</label>
                    <input
                        type="text"
                        name="logo"
                        value={profile.logo || ""}
                        onChange={handleInputChange}
                    />

                    {profile.logo && (
                        <div className="image-center">
                            <img
                                src={profile.logo}
                                alt="Preview"
                                className="current-profile-image"
                            />
                        </div>
                    )}
                </div>

                {/* ----------------------------------------- */}
                {/*      CAMPUS SECTION                       */}
                {/* ----------------------------------------- */}
                <h3>🏫 Campus</h3>
                {profile.campuses.map((campus, idx) => (
                    <div key={campus.campus_id} className="dynamic-row">
                        <input
                            type="text"
                            value={campus.campus_name}
                            onChange={(e) =>
                                handleDynamicChange("campuses", idx, "campus_name", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeDynamicItem("campuses", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addDynamicItem("campuses")}
                >
                    ➕ Add Campus
                </button>

                {/* ----------------------------------------- */}
                {/*      FACULTY SECTION                      */}
                {/* ----------------------------------------- */}
                <h3>🏛 Faculty</h3>
                {profile.faculties.map((faculty, idx) => (
                    <div key={faculty.id} className="dynamic-row">
                        <input
                            type="text"
                            value={faculty.faculty_name}
                            onChange={(e) =>
                                handleDynamicChange("faculties", idx, "faculty_name", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeDynamicItem("faculties", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addDynamicItem("faculties")}
                >
                    ➕ Add Faculty
                </button>

                {/* ----------------------------------------- */}
                {/*      MAJOR SECTION                        */}
                {/* ----------------------------------------- */}
                <h3>📚 Major</h3>
                {profile.majors.map((major, idx) => (
                    <div key={major.id} className="dynamic-row">
                        <input
                            type="text"
                            value={major.major_name}
                            onChange={(e) =>
                                handleDynamicChange("majors", idx, "major_name", e.target.value)
                            }
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeDynamicItem("majors", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addDynamicItem("majors")}
                >
                    ➕ Add Major
                </button>

                {/* SUBMIT */}
                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                </button>

            </form>
        </div>
    );
};

export default EditUniversity;
