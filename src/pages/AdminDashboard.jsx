import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { AdminProvider } from "../context/AdminContext";
import SemesterManager from "../components/SemesterManager";
import "../Styles/AdminDashboard.css";
import CourseManager from "../components/CourseManager";
import AnalyticsBoard from "../components/AnalyticsBoard";

const AdminDashboard = () => {
  return (
    <AdminProvider>
      <div className="admin-dashboard__root">
        <div className="admin-dashboard__container">
          <div className="admin-dashboard__header">
            <h1 className="admin-dashboard__title">Admin Dashboard</h1>
            <p className="admin-dashboard__subtitle">
              Manage semesters, courses, and academic data
            </p>
          </div>
               <AnalyticsBoard/>
          <Tabs defaultValue="semesters" className="admin-dashboard__tabs">
            <TabsList className="admin-dashboard__tabs-list">
              <TabsTrigger value="semesters" className="admin-dashboard__tab-trigger">
                Semesters
              </TabsTrigger>
              <TabsTrigger value="courses" className="admin-dashboard__tab-trigger">
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semesters" className="admin-dashboard__tab-content">
              <SemesterManager />
            </TabsContent>

            <TabsContent value="courses" className="admin-dashboard__tab-content">
              <CourseManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminDashboard;
