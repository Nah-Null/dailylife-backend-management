import { Routes, Route } from 'react-router-dom'
import Index from '../components/Index'
import ViewUser from '../components/UserManegementComponents/ViewUser'
import EditUser from '../components/UserManegementComponents/EditUser'
import ViewUniversity from '../components/UniversityManegementComponents/ViewUniversity'
import EditUniversity from '../components/UniversityManegementComponents/EditUniversity'
import AddUniversity from "../components/UniversityManegementComponents/AddUniversity";
import ViewEvent from '../components/EventsManagement/ViewEvent'
import EditEvent from '../components/EventsManagement/EditEvent'


const AppRoute = () => {
    return (
        // 💡 ต้องครอบด้วย <Routes> เสมอใน React Router v6+
        <Routes>
            {/* Route หลักสำหรับหน้าแรก */}
            <Route path="/" element={<Index />} />
            {/* Route สำหรับดูรายละเอียดผู้ใช้ โดยใช้ Parameter :id */}
            <Route path="/view-user/:id" element={<ViewUser />} />
            {/* Route สำหรับแก้ไขผู้ใช้ โดยใช้ Parameter :id */}
            <Route path="/edit-user/:id" element={<EditUser />} />
            {/* Route สำหรับดูรายละเอียดมหาวิทยาลัย โดยใช้ Parameter :id */}
            <Route path="/view-university/:id" element={<ViewUniversity />} />
            {/* Route สำหรับแก้ไขมหาวิทยาลัย โดยใช้ Parameter :id */}
            <Route path="/edit-university/:id" element={<EditUniversity />} />
            {/* Route สำหรับเพิ่มมหาวิทยาลัยใหม่ */}
            <Route path="/add-university" element={<AddUniversity />} />
            {/* Route สำหรับดูรายละเอียดกิจกรรม โดยใช้ Parameter :id */}
            <Route path="/view-event/:id" element={<ViewEvent />} />
            {/* Route สำหรับแก้ไขกิจกรรม โดยใช้ Parameter :id */}
            <Route path="/edit-event/:id" element={<EditEvent />} />

        </Routes>
    )
}
export default AppRoute