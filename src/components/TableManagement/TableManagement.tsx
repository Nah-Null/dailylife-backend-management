import { useState, useEffect } from "react";
import '../css//TableManegement.css'

type TableInfo = {
    TABLE_NAME: string;
    TABLE_ROWS: number;
    DATA_LENGTH: number;
    INDEX_LENGTH: number;
    ENGINE: string;
    TABLE_COLLATION: string;
    CREATE_TIME: string;
    UPDATE_TIME: string;
};

type TableSize = {
    TABLE_NAME: string;
    size_mb: number;
    TABLE_ROWS: number;
    avg_row_size_bytes: number;
};

type TableColumn = {
    COLUMN_NAME: string;
    DATA_TYPE: string;
    IS_NULLABLE: string;
    COLUMN_KEY: string;
    EXTRA: string;
};

const BASE_URL = "http://localhost:5000";

const TableManagement = () => {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [tableSizes, setTableSizes] = useState<TableSize[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [columns, setColumns] = useState<TableColumn[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("name");

    // ========== FETCH ALL TABLES ==========
    const fetchTables = async () => {
        try {
            const response = await fetch(`${BASE_URL}/table/get`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.data)) {
                setTables(data.data);
                if (data.data.length > 0) {
                    setSelectedTable(data.data[0].TABLE_NAME);
                }
            }
        } catch (err) {
            console.error("Error fetching tables:", err);
        }
    };

    // ========== FETCH TABLE SIZES ==========
    const fetchTableSizes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/tables/size/all`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.data)) {
                setTableSizes(data.data);
            }
        } catch (err) {
            console.error("Error fetching table sizes:", err);
        } finally {
            setLoading(false);
        }
    };

    // ========== FETCH TABLE COLUMNS ==========
    const fetchTableColumns = async (tableName: string) => {
        try {
            const response = await fetch(`${BASE_URL}/table/${tableName}/columns`);
            const data = await response.json();

            if (response.ok && Array.isArray(data.data)) {
                setColumns(data.data);
            }
        } catch (err) {
            console.error("Error fetching columns:", err);
        }
    };

    useEffect(() => {
        fetchTables();
        fetchTableSizes();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            fetchTableColumns(selectedTable);
        }
    }, [selectedTable]);

    // Sort tables
    const sortedTables = [...tables].sort((a, b) => {
        if (sortBy === "name") {
            return a.TABLE_NAME.localeCompare(b.TABLE_NAME);
        } else if (sortBy === "rows") {
            return b.TABLE_ROWS - a.TABLE_ROWS;
        }
        return 0;
    });

    // Format size
    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="backend-container">
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                {/* Header */}
                <div className="header-section">
                    <div className="header-top">
                        <div className="header-title">
                            <h1>📊 Database Tables</h1>
                            <p>
                                <span className="dot"></span>
                                Manage {tables.length} tables
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card primary">
                            <p className="stat-label">Total Tables</p>
                            <p className="stat-value">{tables.length}</p>
                        </div>
                        <div className="stat-card secondary">
                            <p className="stat-label">Total Rows</p>
                            <p className="stat-value">{tableSizes.reduce((sum, t) => sum + (t.TABLE_ROWS || 0), 0).toLocaleString()}</p>
                        </div>
                        <div className="stat-card success">
                            <p className="stat-label">Database Size</p>
                            <p className="stat-value">
                                {formatSize(tableSizes.reduce((sum, t) => sum + (t.size_mb || 0) * 1024 * 1024, 0))}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-card" style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
                    
                    {/* Tables List */}
                    <div style={{ borderRight: "1px solid #e0e0e0", paddingRight: "20px" }}>
                        <h3 style={{ margin: "0 0 15px 0" }}>📋 Tables</h3>
                        
                        <div className="search-wrapper" style={{ marginBottom: "15px" }}>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                                style={{ width: "100%" }}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="rows">Sort by Rows</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {sortedTables.map((table) => (
                                <button
                                    key={table.TABLE_NAME}
                                    onClick={() => setSelectedTable(table.TABLE_NAME)}
                                    style={{
                                        padding: "12px 15px",
                                        border: selectedTable === table.TABLE_NAME ? "2px solid #007bff" : "1px solid #ddd",
                                        background: selectedTable === table.TABLE_NAME ? "#e7f1ff" : "#fff",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.3s"
                                    }}
                                >
                                    <div style={{ fontWeight: "bold", color: "#333" }}>
                                        {table.TABLE_NAME}
                                    </div>
                                    <small style={{ color: "#666" }}>
                                        {table.TABLE_ROWS.toLocaleString()} rows
                                    </small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Details */}
                    {selectedTable && (
                        <div>
                            <h3 style={{ margin: "0 0 15px 0" }}>📌 {selectedTable}</h3>

                            {/* Table Info */}
                            <div style={{
                                background: "#f8f9fa",
                                padding: "15px",
                                borderRadius: "8px",
                                marginBottom: "15px"
                            }}>
                                {(() => {
                                    const tableInfo = tables.find(t => t.TABLE_NAME === selectedTable);
                                    const tableSize = tableSizes.find(t => t.TABLE_NAME === selectedTable);
                                    return (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                            <div>
                                                <strong>Engine:</strong> {tableInfo?.ENGINE}
                                            </div>
                                            <div>
                                                <strong>Collation:</strong> {tableInfo?.TABLE_COLLATION}
                                            </div>
                                            <div>
                                                <strong>Rows:</strong> {tableInfo?.TABLE_ROWS.toLocaleString()}
                                            </div>
                                            <div>
                                                <strong>Size:</strong> {tableSize?.size_mb} MB
                                            </div>
                                            <div>
                                                <strong>Created:</strong> {formatDate(tableInfo?.CREATE_TIME || "")}
                                            </div>
                                            <div>
                                                <strong>Updated:</strong> {formatDate(tableInfo?.UPDATE_TIME || "")}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Columns Table */}
                            <div style={{ overflowX: "auto" }}>
                                <table className="admin-table" style={{ width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <th>Column Name</th>
                                            <th>Data Type</th>
                                            <th>Nullable</th>
                                            <th>Key</th>
                                            <th>Extra</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {columns.map((col, idx) => (
                                            <tr key={idx}>
                                                <td><strong>{col.COLUMN_NAME}</strong></td>
                                                <td>{col.DATA_TYPE}</td>
                                                <td>
                                                    <span style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        background: col.IS_NULLABLE === "YES" ? "#d4edda" : "#f8d7da",
                                                        color: col.IS_NULLABLE === "YES" ? "#155724" : "#721c24"
                                                    }}>
                                                        {col.IS_NULLABLE}
                                                    </span>
                                                </td>
                                                <td>{col.COLUMN_KEY || "-"}</td>
                                                <td>{col.EXTRA || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableManagement;