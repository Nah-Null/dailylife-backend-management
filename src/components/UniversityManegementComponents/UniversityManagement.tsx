import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../css/UniversityManagement.css'

type UserProfile = {
    id: number;
    uni_id: string;
    university_th: string;
    university_en: string;
    university_shortname: string;
    university_type: string;
    province: string;
    website: string;
    logo: string;
    campuses: string;
    faculties: string;
    majors: string;
    raw_json: string;
};

const UniversityManagement = () => {
    const [universities, setUniversities] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("university_th");
    const itemsPerPage = 10;
    const navigate = useNavigate();

    const fetchUniversities = async () => {
        try {
            const response = await fetch("https://daily-life-backend.vercel.app/university/get-all");
            const data = await response.json();

            if (response.ok && Array.isArray(data.message)) {
                setUniversities(data.message);
            } else {
                console.error("Invalid data format");
            }
        } catch (err) {
            console.error("Network error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    // Filter
    const filteredUniversities = universities.filter(u =>
        u.university_th.toLowerCase().includes(search.toLowerCase()) ||
        u.university_en.toLowerCase().includes(search.toLowerCase()) ||
        u.university_shortname.toLowerCase().includes(search.toLowerCase()) ||
        u.province.toLowerCase().includes(search.toLowerCase())
    );

    // Sort
    const sortedUniversities = [...filteredUniversities].sort((a, b) => {
        if (sortBy === "university_th") return a.university_th.localeCompare(b.university_th);
        if (sortBy === "province") return a.province.localeCompare(b.province);
        return 0;
    });

    // Pagination
    const paginatedUniversities = sortedUniversities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedUniversities.length / itemsPerPage);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    // Actions
    const deleteUniversity = async (id: number) => {
        if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบมหาวิทยาลัย ID: ${id}?`)) return;

        try {
            const response = await fetch(`https://daily-life-backend.vercel.app/api/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            alert(`ลบมหาวิทยาลัย ID ${id} สำเร็จ!`);
            setUniversities(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            console.error("Failed to delete university:", err.message);
            alert(`การลบล้มเหลว: ${err.message}`);
        }
    }

    const viewUniversity = (id: number) => {
        const uni = universities.find(u => u.id === id);
        if (uni) {
            localStorage.setItem("viewUniversity", JSON.stringify([uni])); // เก็บเป็น array
            navigate(`/view-university/${id}`);
        }
    }

    const editUniversity = (id: number) => {
        const uni = universities.find(u => u.id === id);
        if (uni) {
            localStorage.setItem("editUniversity", JSON.stringify(uni));
            navigate(`/edit-university/${id}`);
        } else {
            alert(`ไม่พบข้อมูลมหาวิทยาลัย ID: ${id}`);
        }
    }

    return (
        <div className="backend-container">
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                <div className="header-section">
                    <div className="header-top">
                        <div className="header-title">
                            <h1>University Dashboard</h1>
                            <p><span className="dot"></span> Manage {universities.length} universities</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card primary">
                            <p className="stat-label">Total Universities</p>
                            <p className="stat-value">{universities.length}</p>
                        </div>
                    </div>
                </div>

                <div className="main-card">
                    <div className="search-section">
                        <div className="search-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, shortname, or province..."
                                className="search-input"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="university_th">Sort by University Name</option>
                            <option value="province">Sort by Province</option>
                        </select>
                    </div>

                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>University</th>
                                    <th>Shortname</th>
                                    <th>Type</th>
                                    <th>Province</th>
                                    <th>Website</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUniversities.map((u, idx) => (
                                    <tr key={u.id} style={{ animation: `slideIn 0.3s ease-out ${idx * 50}ms backwards` }}>
                                        <td>{u.university_th}</td>
                                        <td>{u.university_shortname}</td>
                                        <td>{u.university_type}</td>
                                        <td>{u.province}</td>
                                        <td><a href={u.website} target="_blank" rel="noreferrer">{u.website}</a></td>
                                        <td style={{ textAlign: "center" }}>
                                            <button className="action-btn view" onClick={() => viewUniversity(u.id)}>View</button>
                                            <button className="action-btn edit" onClick={() => editUniversity(u.id)}>Edit</button>
                                            <button className="action-btn delete" onClick={() => deleteUniversity(u.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-section">
                        <p className="pagination-info">
                            Showing {paginatedUniversities.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedUniversities.length)} of {sortedUniversities.length} results
                        </p>
                        <div className="pagination-buttons">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="page-btn"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="page-btn"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UniversityManagement;
