import { useState, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";

import { CiUser } from "react-icons/ci";
import {
  IoGridOutline,
  IoSettingsOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import { HiOutlineUserGroup, HiOutlineUsers } from "react-icons/hi2";
import { PiCreditCard } from "react-icons/pi";
import { TfiWrite } from "react-icons/tfi";
import { CiPen } from "react-icons/ci";
import { AiOutlineUser } from "react-icons/ai";
import { SlOrganization } from "react-icons/sl";
import { AiOutlineBell } from "react-icons/ai";
import { GrDocumentNotes } from "react-icons/gr";
import { MdAssignmentAdd } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { LuNotebookTabs } from "react-icons/lu";
import { RiSpam2Line } from "react-icons/ri";

import {
  IoIosLogOut,
  IoIosHelpCircleOutline,
  IoIosGitBranch,
  IoIosSwap,
  IoIosCheckboxOutline,
  IoMdBook,
  IoMdMenu,
} from "react-icons/io";
import { BiMessage } from "react-icons/bi";

import { NavLink, useLocation } from "react-router-dom";

import "./Header.css";
import Expired from "../../pages/Expired/Expired";
// import UserDashboard from "../../pages/01-UserDashboard/UserDashboard";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

// Define types for the route structure
interface Route {
  path: string;
  name: string;
  icon: JSX.Element;
}

const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  const [visible, setVisible] = useState(false);

  const utId = localStorage.getItem("refUtId");

  // Define the routes based on refUtId
  const userRoutes: Route[] = [
    { path: "/users/dashboard", name: "Dashboard", icon: <IoGridOutline /> },
    { path: "/users/notes", name: "User Notes", icon: <IoMdBook /> },
    {
      path: "/users/attendance",
      name: "Attendance",
      icon: <IoIosCheckboxOutline />,
    },
    { path: "/users/payment", name: "Payment", icon: <IoIosSwap /> },
    { path: "/users/branch", name: "Branch", icon: <IoIosGitBranch /> },
    { path: "/users/profile", name: "Profile", icon: <CiUser /> },
    {
      path: "/users/support",
      name: "Support",
      icon: <IoIosHelpCircleOutline />,
    },
    { path: "/logout", name: "Logout", icon: <IoIosLogOut /> },
  ];

  const staffRoutes: Route[] = [
    {
      path: "/staff/Dashboard",
      name: "Dashboard",
      icon: <IoGridOutline />,
    },
    {
      path: "/staff/users",
      name: "All Users",
      icon: <HiOutlineUsers />,
    },
    {
      path: "/staff/registeredUsers",
      name: "Trial & Fee Due",
      icon: <HiOutlineUsers />,
    },
    {
      path: "/staff/signedupUsers",
      name: "Future Clients",
      icon: <HiOutlineUserGroup />,
    },
    {
      path: "/staff/feedback",
      name: "Feedback",
      icon: <BiMessage />,
    },
    { path: "/users/profile", name: "Profile", icon: <CiUser /> },
    {
      path: "/users/support",
      name: "Support",
      icon: <IoIosHelpCircleOutline />,
    },
    { path: "/logout", name: "Logout", icon: <IoIosLogOut /> },
  ];

  const directorRoutes: Route[] = [
    {
      path: "/staff/Dashboard",
      name: "Dashboard",
      icon: <IoGridOutline />,
    },
    {
      path: "/staff/users",
      name: "All Users",
      icon: <HiOutlineUsers />,
    },
    {
      path: "/therapist/approve",
      name: "Registered Users",
      icon: <HiOutlineUserGroup />,
    },
    {
      path: "/staff/registeredUsers",
      name: "Trial & Fee Due",
      icon: <HiOutlineUsers />,
    },
    {
      path: "/staff/payment",
      name: "Payment",
      icon: <FaFileInvoiceDollar />,
    },
    {
      path: "/staff/attendance",
      name: "Attendance",
      icon: <LuNotebookTabs />,
    },

    {
      path: "/staff/signedupUsers",
      name: "Future Clients",
      icon: <HiOutlineUserGroup />,
    },

    {
      path: "/dir/staff",
      name: "Staff / Employee",
      icon: <AiOutlineUser />,
    },
    {
      path: "/dir/notify",
      name: "User Audit Page",
      icon: <AiOutlineBell />,
    },
    {
      path: "/yoganotes",
      name: "Add Notes",
      icon: <MdAssignmentAdd />,
    },
    {
      path: "/assignnotes",
      name: "Assign Notes",
      icon: <GrDocumentNotes />,
    },
    {
      path: "/staff/transaction",
      name: "Transactions",
      icon: <IoIosSwap />,
    },
    {
      path: "/staff/feedback",
      name: "Feedback",
      icon: <BiMessage />,
    },

    {
      path: "/staff/payroll",
      name: "Payroll",
      icon: <PiCreditCard />,
    },
    {
      path: "/reports",
      name: "Directors - Reports",
      icon: <IoBarChartOutline />,
    },
    { path: "/blogs", name: "Directors - Blogs", icon: <TfiWrite /> },
    { path: "/editNotes", name: "Directors - Notes", icon: <CiPen /> },
    {
      path: "/restrictions",
      name: "Directors - Restrictions",
      icon: <RiSpam2Line />,
    },
    {
      path: "/dir/organization",
      name: "Organization Chart",
      icon: <SlOrganization />,
    },
    { path: "/users/profile", name: "Profile", icon: <CiUser /> },
    { path: "/settings", name: "Settings", icon: <IoSettingsOutline /> },
    {
      path: "/users/support",
      name: "Support",
      icon: <IoIosHelpCircleOutline />,
    },
    { path: "/logout", name: "Logout", icon: <IoIosLogOut /> },
  ];

  const financeRoutes: Route[] = [
    {
      path: "/staff/Dashboard",
      name: "Dashboard",
      icon: <IoGridOutline />,
    },
    {
      path: "/staff/transaction",
      name: "Transactions",
      icon: <IoIosSwap />,
    },
    {
      path: "/staff/payroll",
      name: "Payroll",
      icon: <PiCreditCard />,
    },
    {
      path: "/reports",
      name: "Reports",
      icon: <IoBarChartOutline />,
    },
    { path: "/users/profile", name: "Profile", icon: <CiUser /> },
    {
      path: "/users/support",
      name: "Support",
      icon: <IoIosHelpCircleOutline />,
    },
    { path: "/logout", name: "Logout", icon: <IoIosLogOut /> },
  ];

  const therapist: Route[] = [
    {
      path: "/staff/Dashboard",
      name: "Dashboard",
      icon: <IoGridOutline />,
    },
    {
      path: "/staff/users",
      name: "All Users",
      icon: <HiOutlineUsers />,
    },
    // {
    //   path: "/staff/registeredUsers",
    //   name: "Trial & Fee Due Users",
    //   icon: <HiOutlineUsers />,
    // },
    // {
    //   path: "/staff/signedupUsers",
    //   name: "Future Clients",
    //   icon: <HiOutlineUserGroup />,
    // },
    {
      path: "/therapist/approve",
      name: "Registered Users",
      icon: <HiOutlineUserGroup />,
    },
    // {
    //   path: "/dir/staff",
    //   name: "Staff / Employee",
    //   icon: <AiOutlineUser />,
    // },
    {
      path: "/staff/feedback",
      name: "Feedback",
      icon: <BiMessage />,
    },
    // {
    //   path: "/staff/transaction",
    //   name: "Transactions",
    //   icon: <IoIosSwap />,
    // },
    // {
    //   path: "/staff/payroll",
    //   name: "Payroll",
    //   icon: <PiCreditCard />,
    // },
    // {
    //   path: "/reports",
    //   name: "Directors - Reports",
    //   icon: <IoBarChartOutline />,
    // },
    // { path: "/blogs", name: "Directors - Blogs", icon: <TfiWrite /> },
    // { path: "/editNotes", name: "Directors - Notes", icon: <CiPen /> },
    // {
    //   path: "/restrictions",
    //   name: "Directors - Restrictions",
    //   icon: <RiSpam2Line />,
    // },
    // {
    //   path: "/dir/organization",
    //   name: "Organization Chart",
    //   icon: <SlOrganization />,
    // },
    { path: "/users/profile", name: "Profile", icon: <CiUser /> },
    {
      path: "/users/support",
      name: "Support",
      icon: <IoIosHelpCircleOutline />,
    },
    { path: "/logout", name: "Logout", icon: <IoIosLogOut /> },
  ];

  useEffect(() => {
    const parsedUtId = utId ? parseInt(utId, 10) : null;

    if (parsedUtId === 5 || parsedUtId === 6) {
      setRoutes(userRoutes);
    } else if (parsedUtId === 4) {
      setRoutes(staffRoutes);
    } else if (parsedUtId === 7) {
      setRoutes(directorRoutes);
    } else if (parsedUtId === 8) {
      setRoutes(financeRoutes);
    } else if (parsedUtId === 11) {
      setRoutes(therapist);
    } else {
      console.warn("Unknown refUtId:", parsedUtId);
    }
  }, [utId]);

  const [headername, setHeadername] = useState<string | undefined>(undefined);
  console.log("headername", headername);

  const location = useLocation();

  useEffect(() => {
    const matchedRoute1 = userRoutes.find(
      (route) => route.path === location.pathname
    );

    if (matchedRoute1) {
      setHeadername(matchedRoute1.name);
    }

    const matchedRoute2 = staffRoutes.find(
      (route) => route.path === location.pathname
    );

    if (matchedRoute2) {
      setHeadername(matchedRoute2.name);
    }

    const matchedRoute3 = directorRoutes.find(
      (route) => route.path === location.pathname
    );

    if (matchedRoute3) {
      setHeadername(matchedRoute3.name);
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname != "/expired" ? (
        <div>
          <div className="main_container">
            <motion.div className="sidebar">
              <div className="top_section">
                <div className="bars pr-4">
                  <IoMdMenu onClick={() => setVisible(true)} />
                </div>
              </div>

              <section className="routes">
                {routes.map((route) => (
                  <NavLink
                    to={route.path}
                    key={route.name}
                    className={({ isActive }) =>
                      isActive ? "link active" : "link"
                    }
                  >
                    <div className="icon">{route.icon}</div>
                  </NavLink>
                ))}
              </section>
            </motion.div>
            <main style={{ minWidth: "95vw" }}>{children}</main>
          </div>

          <div className="primaryNav">
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
            <p className="font-bold text-black">Dashboard</p>
            <p className="text-[#f95005]">Logged in as: Username</p>
          </div>
        </div>
      ) : (
        <>
          <Expired />
        </>
      )}
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <div className="flex flex-col justify-between h-full"></div>
      </Sidebar>
    </>
  );
};

export default Header;
