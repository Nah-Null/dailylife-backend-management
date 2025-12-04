import "./css/menu.css";

type MenuProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Menu({ activeTab, setActiveTab }: MenuProps) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Dashboard</h2>

      <ul className="menu">
        <li
          className={activeTab === "user" ? "active" : ""}
          onClick={() => setActiveTab("user")}
        >
          User Management
        </li>

        <li
          className={activeTab === "university" ? "active" : ""}
          onClick={() => setActiveTab("university")}
        >
          University Management
        </li>

        <li
          className={activeTab === "events" ? "active" : ""}
          onClick={() => setActiveTab("events")}
        >
          Events Management
        </li>

        <li
          className={activeTab === "table" ? "active" : ""}
          onClick={() => setActiveTab("table")}
        >
          Table Management
        </li>
      </ul>
    </div>
  );
}
