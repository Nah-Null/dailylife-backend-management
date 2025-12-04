import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface UniversityForm {
    university_th: string;
    university_en: string;
    university_shortname: string;
    university_type: string;
    province: string;
    website: string;
    logo: string;
    campuses: Array<{ campus_name: string }>;
    faculties: Array<{ faculty_name: string }>;
    majors: Array<{ major_name: string }>;
}

const API_BASE_URL = "https://daily-life-backend.vercel.app";

const AddUniversity = () => {
    const [form, setForm] = useState<UniversityForm>({
        university_th: "",
        university_en: "",
        university_shortname: "",
        university_type: "",
        province: "",
        website: "",
        logo: "",
        campuses: [{ campus_name: "" }],
        faculties: [{ faculty_name: "" }],
        majors: [{ major_name: "" }]
    });

    const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setMessage(null);
    };

    // Handle dynamic field changes
    const handleDynamicChange = (
        type: "campuses" | "faculties" | "majors",
        index: number,
        value: string
    ) => {
        setForm(prev => ({
            ...prev,
            [type]: prev[type].map((item, i) => 
                i === index 
                    ? { ...item, [type === "campuses" ? "campus_name" : type === "faculties" ? "faculty_name" : "major_name"]: value }
                    : item
            )
        }));
        setMessage(null);
    };

    // Add new item
    const addItem = (type: "campuses" | "faculties" | "majors") => {
        setForm(prev => ({
            ...prev,
            [type]: [...prev[type], type === "campuses" ? { campus_name: "" } : type === "faculties" ? { faculty_name: "" } : { major_name: "" }]
        }));
    };

    // Remove item
    const removeItem = (type: "campuses" | "faculties" | "majors", index: number) => {
        setForm(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Filter empty items
        const payload = {
            ...form,
            campuses: form.campuses.filter(c => c.campus_name.trim()),
            faculties: form.faculties.filter(f => f.faculty_name.trim()),
            majors: form.majors.filter(m => m.major_name.trim())
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/university/add`, payload);

            setMessage({
                success: true,
                text: "🎉 University added successfully!"
            });

            // Reset form
            setForm({
                university_th: "",
                university_en: "",
                university_shortname: "",
                university_type: "",
                province: "",
                website: "",
                logo: "",
                campuses: [{ campus_name: "" }],
                faculties: [{ faculty_name: "" }],
                majors: [{ major_name: "" }]
            });

        } catch (error: any) {
            const msg = error.response?.data?.message || "An error occurred";
            setMessage({ success: false, text: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="view-user-container wider">
            <h2>➕ Add New University</h2>

            {message && (
                <div className={`alert ${message.success ? "alert-success" : "alert-error"}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="edit-form">

                {/* BASIC INFO */}
                <div className="form-row">
                    <div className="form-group">
                        <label>University Name (TH)</label>
                        <input 
                            type="text" 
                            name="university_th" 
                            value={form.university_th} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>University Name (EN)</label>
                        <input 
                            type="text" 
                            name="university_en" 
                            value={form.university_en} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Short Name</label>
                        <input 
                            type="text" 
                            name="university_shortname" 
                            value={form.university_shortname} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>University Type</label>
                        <input 
                            type="text" 
                            name="university_type" 
                            value={form.university_type} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Province</label>
                        <input 
                            type="text" 
                            name="province" 
                            value={form.province} 
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label>Website</label>
                        <input 
                            type="text" 
                            name="website" 
                            value={form.website} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>

                {/* LOGO + PREVIEW */}
                <div className="form-group">
                    <label>University Logo (URL)</label>
                    <input 
                        type="text" 
                        name="logo" 
                        value={form.logo} 
                        onChange={handleChange} 
                    />

                    {form.logo && (
                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                            <img
                                src={form.logo}
                                alt="Preview"
                                className="current-profile-image"
                                style={{ width: "200px", borderRadius: "10px" }}
                            />
                        </div>
                    )}
                </div>

                {/* CAMPUSES */}
                <h3>🏫 Campuses</h3>
                {form.campuses.map((campus, idx) => (
                    <div key={idx} className="dynamic-row">
                        <input
                            type="text"
                            placeholder="Enter campus name"
                            value={campus.campus_name}
                            onChange={(e) => handleDynamicChange("campuses", idx, e.target.value)}
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeItem("campuses", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addItem("campuses")}
                >
                    ➕ Add Campus
                </button>

                {/* FACULTIES */}
                <h3>🏛 Faculties</h3>
                {form.faculties.map((faculty, idx) => (
                    <div key={idx} className="dynamic-row">
                        <input
                            type="text"
                            placeholder="Enter faculty name"
                            value={faculty.faculty_name}
                            onChange={(e) => handleDynamicChange("faculties", idx, e.target.value)}
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeItem("faculties", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addItem("faculties")}
                >
                    ➕ Add Faculty
                </button>

                {/* MAJORS */}
                <h3>📚 Majors</h3>
                {form.majors.map((major, idx) => (
                    <div key={idx} className="dynamic-row">
                        <input
                            type="text"
                            placeholder="Enter major name"
                            value={major.major_name}
                            onChange={(e) => handleDynamicChange("majors", idx, e.target.value)}
                        />
                        <button
                            type="button"
                            className="delete-btn"
                            onClick={() => removeItem("majors", idx)}
                        >
                            ❌
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addItem("majors")}
                >
                    ➕ Add Major
                </button>

                <button type="submit" disabled={isSubmitting} className="submit-button">
                    {isSubmitting ? "Saving..." : "Add University"}
                </button>

            </form>
        </div>
    );
};

export default AddUniversity;