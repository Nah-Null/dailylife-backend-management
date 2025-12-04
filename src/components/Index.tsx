import { useState } from "react";
import "../App.css";

import BackendManagement from "./UserManegementComponents/UserManagement";
import UniversityManagement from "./UniversityManegementComponents/UniversityManagement";
import Menu from "./menu";

function App() {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="app-container">
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content-area">
        {activeTab === "user" && <BackendManagement />}
        {activeTab === "university" && <UniversityManagement />}
        {activeTab === "events" && <h2>Events Management</h2>}
        {activeTab === "table" && <h2>Table Management</h2>}
      </div>
    </div>
  );
}

export default App;
