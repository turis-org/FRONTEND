import Header from "../components/Header";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";

export default function MainLayout({ children }) {
    return (
        <>
            <Header/>
            <main className="main-content">
                {/* {children} */}
                <Outlet />
            </main>
        </>
    );
}
