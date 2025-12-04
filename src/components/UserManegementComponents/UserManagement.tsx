import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/UserManagement.css'

type UserProfile = {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    phone: string;
    profile_image: string;
};

// ====== BASE URL ======
const BASE_URL = "http://localhost:5000";

const UserManagement = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name");
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // ========== FETCH ALL USERS ==========
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/get-all`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.data)) {
                setUsers(data.data);
            } else {
                console.error("Invalid user data format");
            }

        } catch (err) {
            console.error("Network error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users
    const filteredUsers = users.filter(u =>
        `${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortBy === "name") {
            return `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`);
        }
        return a.email.localeCompare(b.email);
    });

    // Pagination
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    // ========== DELETE USER ==========
    const deleteUser = async (id: number) => {
        const confirmed = window.confirm(`ต้องการลบผู้ใช้ ID: ${id} จริงหรือไม่?`);
        if (!confirmed) return;

        try {
            const response = await fetch(`${BASE_URL}/user/delete/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }

            alert("ลบสำเร็จ!");
            setUsers(prev => prev.filter(u => u.id !== id)); // อัปเดต UI โดยไม่ reload

        } catch (err: any) {
            alert("การลบล้มเหลว: " + err.message);
        }
    };

    // ========== VIEW USER ==========
    const viewUser = async (id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/user/get/${id}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("viewUser", JSON.stringify(data.data));
            navigate(`/view-user/${id}`);

        } catch (err: any) {
            alert(`ไม่สามารถโหลดข้อมูลผู้ใช้: ${err.message}`);
        }
    };

    // ========== EDIT USER ==========
    const editUser = async (id: number) => {
        try {
            const response = await fetch(`${BASE_URL}/user/get/${id}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("EditUser", JSON.stringify(data.data));
            navigate(`/edit-user/${id}`);

        } catch (err: any) {
            alert(`โหลดข้อมูลผู้ใช้ไม่สำเร็จ: ${err.message}`);
        }
    };

    return (
        <div className="backend-container">
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-top">
                        <div className="header-title">
                            <h1>Admin Dashboard</h1>
                            <p>
                                <span className="dot"></span>
                                Manage {users.length} users
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card primary">
                            <p className="stat-label">Total Users</p>
                            <p className="stat-value">{users.length}</p>
                        </div>
                        <div className="stat-card secondary">
                            <p className="stat-label">Active Users</p>
                            <p className="stat-value">{users.length}</p>
                        </div>
                        <div className="stat-card success">
                            <p className="stat-label">This Month</p>
                            <p className="stat-value">{users.length}</p>
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div className="main-card">
                    
                    {/* Search */}
                    <div className="search-section">
                        <div className="search-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name, email or username..."
                                className="search-input"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="email">Sort by Email</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Username</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="user-cell">
                                                <img src={u.profile_image} className="user-avatar" />
                                                <div className="user-info">
                                                    <h3>{u.firstname} {u.lastname}</h3>
                                                    <p>ID: {u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td><span className="username-badge">@{u.username}</span></td>

                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-btn view" onClick={() => viewUser(u.id)}>View</button>
                                                <button className="action-btn edit" onClick={() => editUser(u.id)}>Edit</button>
                                                <button className="action-btn delete" onClick={() => deleteUser(u.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="pagination-section">
                        <p className="pagination-info">
                            Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                            {" "}to{" "}
                            {Math.min(currentPage * itemsPerPage, sortedUsers.length)}
                            {" "}of {sortedUsers.length} results
                        </p>

                        <div className="pagination-buttons">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>{"<"}</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "active" : ""}
                                >
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
