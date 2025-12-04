// src/components/UniversityManegementComponents/ViewUniversity.tsx
import '../css/view.css'
import { useState, useEffect } from "react";

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
    [key: string]: any;
}

interface UniversityProfile {
    id: number;
    uni_id: string;
    university_th: string;
    university_en: string;
    university_shortname: string;
    university_type: string;
    province: string;
    website: string;
    logo: string;
    campuses: Campus[];
    faculties: Faculty[];
    majors: Major[];
    raw_json: RawJSON;
}

const ViewUniversity = () => {
    const [profile, setProfile] = useState<UniversityProfile | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("viewUniversity");

        if (data) {
            try {
                const parsed: UniversityProfile[] = JSON.parse(data);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setProfile(parsed[0]);
                } else {
                    console.warn("Data is empty array");
                }
            } catch (err) {
                console.error("Failed to parse localStorage data", err);
            }
        }
    }, []);

    if (!profile) {
        return <div className="loading-container">Loading university data...</div>;
    }

    return (
        <div className="view-user-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h2>🎓 University Details</h2>
            <div className="profile-card" style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                {profile.logo && (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src={profile.logo} alt="logo" style={{ maxWidth: '150px', borderRadius: '8px' }} />
                    </div>
                )}

                <dl className="profile-details-list" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', rowGap: '10px', columnGap: '20px' }}>
                    <dt>ID:</dt>
                    <dd>{profile.id}</dd>

                    <dt>Uni ID:</dt>
                    <dd>{profile.uni_id || 'N/A'}</dd>

                    <dt>ชื่อภาษาไทย:</dt>
                    <dd>{profile.university_th || 'N/A'}</dd>

                    <dt>ชื่อภาษาอังกฤษ:</dt>
                    <dd>{profile.university_en || 'N/A'}</dd>

                    <dt>ชื่อย่อ:</dt>
                    <dd>{profile.university_shortname || 'N/A'}</dd>

                    <dt>ประเภทมหาวิทยาลัย:</dt>
                    <dd>{profile.university_type || 'N/A'}</dd>

                    <dt>จังหวัด:</dt>
                    <dd>{profile.province || 'N/A'}</dd>

                    <dt>เว็บไซต์:</dt>
                    <dd>
                        {profile.website ? <a href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a> : 'N/A'}
                    </dd>

                    <dt>Campuses:</dt>
                    <dd>
                        {profile.campuses && profile.campuses.length > 0
                            ? profile.campuses.map(c => c.campus_name).join(', ')
                            : 'N/A'}
                    </dd>

                    <dt>Faculties:</dt>
                    <dd>
                        {profile.faculties && profile.faculties.length > 0
                            ? profile.faculties.map(f => f.faculty_name).join(', ')
                            : 'N/A'}
                    </dd>

                    <dt>Majors:</dt>
                    <dd>
                        {profile.majors && profile.majors.length > 0
                            ? profile.majors.map(m => m.major_name).join(', ')
                            : 'N/A'}
                    </dd>

                    <dt>Raw JSON:</dt>
                    <dd>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                            {JSON.stringify(profile.raw_json, null, 2)}
                        </pre>
                    </dd>
                </dl>
            </div>
        </div>
    );
}

export default ViewUniversity;
