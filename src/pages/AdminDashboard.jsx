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

const AdminDashboard = () => {
  return (
    <AdminProvider>
      <div className="admin-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage semesters, courses, and academic data
            </p>
          </div>

          <Tabs defaultValue="semesters" className="admin-tabs">
            <TabsList className="tabs-list">
              <TabsTrigger value="semesters" className="tab-trigger">
                Semesters
              </TabsTrigger>
              <TabsTrigger value="courses" className="tab-trigger">
                Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="semesters" className="tab-content">
              <SemesterManager />
            </TabsContent>

            <TabsContent value="courses" className="tab-content">
              <CourseManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminDashboard;
