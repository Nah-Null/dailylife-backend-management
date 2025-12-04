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
const UserManagement = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name");
    const itemsPerPage = 10;
    const navigate = useNavigate();


    const fetchUsers = async () => {
        try {
            const response = await fetch("https://daily-life-backend.vercel.app/user/gett-all");
            const data = await response.json();

            if (response.ok && Array.isArray(data.message)) {
                setUsers(data.message);
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

    // Filter users by search input
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

    // Paginate users
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    const deleteUser = async (id: number) => {
        // 1. Pop-up ยืนยันการลบ
        const isConfirmed = window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ ID: ${id}?`);

        // ถ้าผู้ใช้ยกเลิกการลบ (กด Cancel) ให้จบการทำงาน
        if (!isConfirmed) {
            console.log(`Deletion of user ID ${id} cancelled by user.`);
            return;
        }

        // โค้ดจะทำงานต่อเมื่อผู้ใช้กดยืนยัน (OK) เท่านั้น
        try {
            const url = `https://daily-life-backend.vercel.app/user/delete/${id}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    // สำหรับ DELETE, 'Content-Type' อาจไม่จำเป็นถ้าไม่มี Body แต่ใส่ไว้ก็ไม่เสียหาย
                    'Content-Type': 'application/json',
                }
            });

            // 2. ตรวจสอบสถานะ HTTP (Handle non-2xx statuses)
            if (!response.ok) {
                // อ่านข้อความ Error จาก Server (ถ้ามี)
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            // 3. การลบสำเร็จ (Status 200 OK หรือ 204 No Content)

            // ถ้า API ตอบกลับเป็น JSON
            // const data = await response.json();
            // console.log("Delete Success:", data.message);

            alert(`ลบผู้ใช้ ID ${id} สำเร็จ!`);
            window.location.reload();
            console.log(`Successfully deleted user ID ${id}.`);

            // *** ใส่โค้ดสำหรับรีเฟรชรายการผู้ใช้ หรืออัปเดต UI ที่นี่ ***
            // เช่น: refreshUserList();

        } catch (err: any) {
            // 4. จัดการ Network Error หรือ Error ที่โยนมาจาก response.ok
            console.error("Failed to delete user:", err.message);
            alert(`การลบผู้ใช้ ID ${id} ล้มเหลว: ${err.message}`);
        }
    }

    const viewUser = async (id: number) => { // <<< ต้องเป็น async function
        try {
            // 1. Fetch ข้อมูล: ต้องใช้ 'await' เพื่อรอ Response
            const response = await fetch(`https://daily-life-backend.vercel.app/user/get/${id}`, { // <<< แก้ไข URL ตาม API ที่คุณใช้ (สมมติว่าคุณแก้เป็น /api/userby/:id)
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // 2. ตรวจสอบ Response Status
            if (!response.ok) {
                // ถ้า Status ไม่ใช่ 200 OK ให้โยน Error
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch user. Status: ${response.status}`);
            }

            // 3. แปลง Response เป็น JSON
            const data = await response.json();

            // 4. แสดงข้อมูลที่ได้มา (ในกรณีนี้คือแสดงด้วย alert เพื่อให้เห็นผล)
            // สมมติว่าข้อมูลผู้ใช้จริงๆ อยู่ใน data.user (หรือ data.message ตามรูปแบบที่คุณใช้ใน fetchUsers)
            const user: UserProfile = data.user || data.message;

            if (user) {
                console.log("View User Data:", user);
                // หากต้องการเก็บข้อมูลไว้ใน Local Storage:
                localStorage.setItem("viewUser", JSON.stringify(user));
                navigate(`/view-user/${id}`);

            } else {
                alert(`ไม่พบข้อมูลผู้ใช้ ID: ${id}`);
            }

        } catch (err: any) {
            console.error("View User Error:", err.message);
            alert(`ไม่สามารถดึงข้อมูลผู้ใช้ ID: ${id} ได้: ${err.message}`);
        }
    }

        const editUser = async (id: number) => { // <<< ต้องเป็น async function
        try {
            // 1. Fetch ข้อมูล: ต้องใช้ 'await' เพื่อรอ Response
            const response = await fetch(`https://daily-life-backend.vercel.app/userby/${id}`, { // <<< แก้ไข URL ตาม API ที่คุณใช้ (สมมติว่าคุณแก้เป็น /api/userby/:id)
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // 2. ตรวจสอบ Response Status
            if (!response.ok) {
                // ถ้า Status ไม่ใช่ 200 OK ให้โยน Error
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch user. Status: ${response.status}`);
            }

            // 3. แปลง Response เป็น JSON
            const data = await response.json();

            // 4. แสดงข้อมูลที่ได้มา (ในกรณีนี้คือแสดงด้วย alert เพื่อให้เห็นผล)
            // สมมติว่าข้อมูลผู้ใช้จริงๆ อยู่ใน data.user (หรือ data.message ตามรูปแบบที่คุณใช้ใน fetchUsers)
            const user: UserProfile = data.user || data.message;

            if (user) {
                console.log("Edit User Data:", user);
                // หากต้องการเก็บข้อมูลไว้ใน Local Storage:
                localStorage.setItem("EditUser", JSON.stringify(user));
                navigate(`/edit-user/${id}`);

            } else {
                alert(`ไม่พบข้อมูลผู้ใช้ ID: ${id}`);
            }

        } catch (err: any) {
            console.error("View User Error:", err.message);
            alert(`ไม่สามารถดึงข้อมูลผู้ใช้ ID: ${id} ได้: ${err.message}`);
        }
    }

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

                    {/* Stats Cards */}
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

                {/* Main Card */}
                <div className="main-card">
                    {/* Search & Filter */}
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
                                {paginatedUsers.map((u, idx) => (
                                    <tr key={u.id} style={{
                                        animation: `slideIn 0.3s ease-out ${idx * 50}ms backwards`
                                    }}>
                                        <td>
                                            <div className="user-cell">
                                                <img
                                                    src={u.profile_image}
                                                    alt={u.firstname}
                                                    className="user-avatar"
                                                />
                                                <div className="user-info">
                                                    <h3>{u.firstname} {u.lastname}</h3>
                                                    <p>ID: {u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>
                                        <td>
                                            <span className="username-badge">@{u.username}</span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button
                                                    onClick={() => viewUser(u.id)}
                                                    className="action-btn view"
                                                    title="View"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                                <button
                                                onClick={() =>{editUser(u.id)}}
                                                    className="action-btn edit"
                                                    title="Edit"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="action-btn delete"
                                                    title="Delete"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
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
                            Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} results
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
export default UserManagement;