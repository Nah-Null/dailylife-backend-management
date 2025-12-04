import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../css/UserManagement.css'

type Activity = {
    activity_id: string;
    title: string;
    description: string;
    location: string;
    open_date: string;
    close_date: string;
    status: string;
    image: string;
};

type EventProfile = {
    organizer_id: string;
    organizer_name: string;
    activities: Activity[];
};

// ====== BASE URL ======
const BASE_URL = "http://localhost:5000";

const EventsManagement = () => {
    const [events, setEvents] = useState<EventProfile[]>([]);
    const [flattenedEvents, setFlattenedEvents] = useState<(Activity & { organizer_name: string; organizer_id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name");
    const itemsPerPage = 10;
    const navigate = useNavigate();

    // ========== FETCH ALL EVENTS ==========
    const fetchEvents = async () => {
        try {
            const response = await fetch(`${BASE_URL}/event/get`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.data)) {
                setEvents(data.data);
                
                // Flatten activities from all organizers
                const flattened = data.data.flatMap((org: EventProfile) =>
                    org.activities.map(activity => ({
                        ...activity,
                        organizer_name: org.organizer_name,
                        organizer_id: org.organizer_id
                    }))
                );
                setFlattenedEvents(flattened);
            } else {
                console.error("Invalid event data format");
            }

        } catch (err) {
            console.error("Network error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events
    const filteredEvents = flattenedEvents.filter(e =>
        e.organizer_name.toLowerCase().includes(search.toLowerCase()) ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase()) ||
        e.status.toLowerCase().includes(search.toLowerCase())
    );

    // Sort events
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        if (sortBy === "name") {
            return a.organizer_name.localeCompare(b.organizer_name);
        } else if (sortBy === "title") {
            return a.title.localeCompare(b.title);
        } else if (sortBy === "date") {
            return new Date(a.open_date).getTime() - new Date(b.open_date).getTime();
        }
        return 0;
    });

    // Pagination
    const paginatedEvents = sortedEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    // ========== DELETE EVENT ==========
    const deleteEvent = async (activityId: string) => {
        const confirmed = window.confirm(`ต้องการลบกิจกรรม ID: ${activityId} จริงหรือไม่?`);
        if (!confirmed) return;

        try {
            const response = await fetch(`${BASE_URL}/event/delete/${activityId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message);
            }

            alert("ลบสำเร็จ!");
            setFlattenedEvents(prev => prev.filter(e => e.activity_id !== activityId));

        } catch (err: any) {
            alert("การลบล้มเหลว: " + err.message);
        }
    };

    // ========== VIEW EVENT ==========
    const viewEvent = async (activityId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/event/get/${activityId}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("viewEvent", JSON.stringify(data.data));
            navigate(`/view-event/${activityId}`);

        } catch (err: any) {
            alert(`ไม่สามารถโหลดข้อมูลกิจกรรม: ${err.message}`);
        }
    };

    // ========== EDIT EVENT ==========
    const editEvent = async (activityId: string) => {
        try {
            const response = await fetch(`${BASE_URL}/event/get/${activityId}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("editEvent", JSON.stringify(data.data));
            navigate(`/edit-event/${activityId}`);

        } catch (err: any) {
            alert(`โหลดข้อมูลกิจกรรมไม่สำเร็จ: ${err.message}`);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status color
    const getStatusColor = (status: string) => {
        if (status === "เปิดรับ") return "badge-open";
        if (status === "ใกล้เต็ม") return "badge-almost-full";
        return "badge-closed";
    };

    return (
        <div className="backend-container">
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-top">
                        <div className="header-title">
                            <h1>Admin Dashboard - Events</h1>
                            <p>
                                <span className="dot"></span>
                                Manage {flattenedEvents.length} activities
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card primary">
                            <p className="stat-label">Total Activities</p>
                            <p className="stat-value">{flattenedEvents.length}</p>
                        </div>
                        <div className="stat-card secondary">
                            <p className="stat-label">Active</p>
                            <p className="stat-value">{flattenedEvents.filter(e => e.status === "เปิดรับ").length}</p>
                        </div>
                        <div className="stat-card success">
                            <p className="stat-label">Organizations</p>
                            <p className="stat-value">{events.length}</p>
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
                                placeholder="Search by organizer, title or location..."
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
                            <option value="name">Sort by Organizer</option>
                            <option value="title">Sort by Title</option>
                            <option value="date">Sort by Date</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Organizer</th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Dates</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEvents.map((event) => (
                                    <tr key={event.activity_id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-info">
                                                    <h3>{event.organizer_name}</h3>                                                </div>
                                            </div>
                                        </td>
                                        <td>{event.title}</td>
                                        <td>{event.location}</td>
                                        <td>
                                            <small>
                                                {formatDate(event.open_date)} - {formatDate(event.close_date)}
                                            </small>
                                        </td>
                                        <td>
                                            <span className={`username-badge ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                <button className="action-btn view" onClick={() => viewEvent(event.activity_id)}>View</button>
                                                <button className="action-btn edit" onClick={() => editEvent(event.activity_id)}>Edit</button>
                                                <button className="action-btn delete" onClick={() => deleteEvent(event.activity_id)}>Delete</button>
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
                            Showing {paginatedEvents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                            {" "}to{" "}
                            {Math.min(currentPage * itemsPerPage, sortedEvents.length)}
                            {" "}of {sortedEvents.length} results
                        </p>

                        <div className="pagination-buttons">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={currentPage === page ? "active" : ""}
                                >
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventsManagement;