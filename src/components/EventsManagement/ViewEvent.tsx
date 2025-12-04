// src/components/EventManagementComponents/ViewEvent.tsx
import '../css/view.css'
import { useState, useEffect } from "react";

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

const ViewEvent = () => {
    const [profile, setProfile] = useState<EventProfile | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("viewEvent");

        if (data) {
            try {
                const parsed: EventProfile = JSON.parse(data);
                setProfile(parsed);
                if (parsed.activities && parsed.activities.length > 0) {
                    setSelectedActivity(parsed.activities[0]);
                }
            } catch (err) {
                console.error("Failed to parse localStorage data", err);
            }
        }
    }, []);

    if (!profile) {
        return <div className="loading-container">Loading event data...</div>;
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="view-user-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2>📅 Event Details</h2>

            {/* Organizer Info */}
            <div className="profile-card" style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🏢 Organizer Information</h3>
                <dl className="profile-details-list" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: '12px', columnGap: '20px' }}>
                    <dt>Organizer ID:</dt>
                    <dd>{profile.organizer_id}</dd>

                    <dt>Organizer Name:</dt>
                    <dd>{profile.organizer_name}</dd>

                    <dt>Total Activities:</dt>
                    <dd>{profile.activities?.length || 0}</dd>
                </dl>
            </div>

            {/* Activities List */}
            <div className="profile-card" style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📋 Activities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {profile.activities && profile.activities.length > 0 ? (
                        profile.activities.map(activity => (
                            <button
                                key={activity.activity_id}
                                onClick={() => setSelectedActivity(activity)}
                                style={{
                                    padding: '12px 15px',
                                    border: selectedActivity?.activity_id === activity.activity_id ? '2px solid #007bff' : '1px solid #ddd',
                                    background: selectedActivity?.activity_id === activity.activity_id ? '#e7f1ff' : '#fff',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.3s'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', color: '#333' }}>{activity.title}</div>
                                <small style={{ color: '#666' }}>ID: {activity.activity_id}</small>
                            </button>
                        ))
                    ) : (
                        <p>No activities found</p>
                    )}
                </div>
            </div>

            {/* Activity Details */}
            {selectedActivity && (
                <div className="profile-card" style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📌 Activity Details</h3>

                    {selectedActivity.image && (
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <img 
                                src={selectedActivity.image} 
                                alt={selectedActivity.title} 
                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} 
                            />
                        </div>
                    )}

                    <dl className="profile-details-list" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: '12px', columnGap: '20px', marginBottom: '15px' }}>
                        <dt>Activity ID:</dt>
                        <dd>{selectedActivity.activity_id}</dd>

                        <dt>Title:</dt>
                        <dd>{selectedActivity.title}</dd>

                        <dt>Location:</dt>
                        <dd>{selectedActivity.location}</dd>

                        <dt>Status:</dt>
                        <dd>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: selectedActivity.status === 'เปิดรับ' ? '#28a745' : 
                                           selectedActivity.status === 'ใกล้เต็ม' ? '#ffc107' : '#dc3545',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {selectedActivity.status}
                            </span>
                        </dd>

                        <dt>Open Date:</dt>
                        <dd>{formatDate(selectedActivity.open_date)}</dd>

                        <dt>Close Date:</dt>
                        <dd>{formatDate(selectedActivity.close_date)}</dd>
                    </dl>

                    <div style={{ 
                        background: '#f8f9fa', 
                        padding: '15px', 
                        borderRadius: '8px',
                        marginTop: '15px'
                    }}>
                        <strong>Description:</strong>
                        <p style={{ margin: '10px 0 0 0', lineHeight: '1.6', color: '#555' }}>
                            {selectedActivity.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewEvent;