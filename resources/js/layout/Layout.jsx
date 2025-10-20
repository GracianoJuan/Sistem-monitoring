import Header from "./Header";
import SidebarLayout from "./Sidebar";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import { apiService } from "../services/ApiServices";

const role = {
    admin, editor, viewer
}

const accessPage = (userRole) => {
    try {
        
    } catch (error) {
        
    }
}

const Layout = (role, user, session) => {
    <div>
        <Header />
        <SidebarLayout />
        <BrowserRouter>
            <Routes>
                <Router path='/'></Router>
                <Route path='/chart'></Route>
            </Routes>
        </BrowserRouter>
    </div>
}

export default Layout;