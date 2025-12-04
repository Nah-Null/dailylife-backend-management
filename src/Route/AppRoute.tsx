import { Routes, Route } from 'react-router-dom'
import ViewUser from '../components/UserManegementComponents/ViewUser'
import Index from '../components/Index'
import EditUser from '../components/UserManegementComponents/EditUser'
import ViewUniversity from '../components/UniversityManegementComponents/ViewUniversity'
import EditUniversity from '../components/UniversityManegementComponents/EditUniversity'

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
        </Routes>
    )
}
export default AppRoute