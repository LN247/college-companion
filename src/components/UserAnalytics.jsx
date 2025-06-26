import React from "react";
import "../styles/UserAnalytics.css";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  FaBook,
  FaClock,
  FaCheckCircle,
  FaUserGraduate,
  FaCalendarCheck,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserAnalytics = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  // User metrics data
  const metrics = [
    {
      id: 1,
      title: "Total Courses",
      value: 8,
      icon: <FaBook className="metricIcon" />,
      change: "+2 this semester",
    },
    {
      id: 2,
      title: "Attendance Rate",
      value: "92%",
      icon: <FaCalendarCheck className="metricIcon" />,
      change: "+5% from last month",
    },
    {
      id: 3,
      title: "Assignment Completion",
      value: "87%",
      icon: <FaCheckCircle className="metricIcon" />,
      change: "12 assignments pending",
    },
    {
      id: 4,
      title: "Avg. Study Hours",
      value: "3.2h/day",
      icon: <FaClock className="metricIcon" />,
      change: "+0.4h from last week",
    },
  ];

  // Performance data for chart
  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Study Hours",
        data: [3.2, 4.1, 2.8, 3.5, 2.9, 1.5, 2.0],
        backgroundColor: "#0a1a4f",
        borderRadius: 6,
      },
      {
        label: "Productivity",
        data: [78, 85, 72, 90, 68, 40, 65],
        backgroundColor: "#F68712",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: isMobile ? 12 : 14,
            family: "'Segoe UI', 'Roboto', sans-serif",
          },
          boxWidth: 15,
        },
      },
      tooltip: {
        backgroundColor: "#0a1a4f",
        titleFont: {
          size: 14,
          family: "'Segoe UI', 'Roboto', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Segoe UI', 'Roboto', sans-serif",
        },
        padding: 12,
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 12,
            family: "'Segoe UI', 'Roboto', sans-serif",
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: "'Segoe UI', 'Roboto', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="analyticsContainer">
      <Typography variant="h4" className="title-1">
        Academic Performance Dashboard
      </Typography>

      <Grid container spacing={3} className="gridContainer">
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card className="metricCard">
              <CardContent>
                <div className="metricHeader">
                  {metric.icon}
                  <Typography variant="h6" className="metricTitle">
                    {metric.title}
                  </Typography>
                </div>
                <Typography variant="h3" className="metricValue">
                  {metric.value}
                </Typography>
                <Typography variant="body2" className="metricChange">
                  {metric.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Card className="chartCard">
            <CardContent>
              <div className="cardHeader">
                <Typography variant="h6" className="cardTitle">
                  Weekly Performance
                </Typography>
                <div className="legend">
                  <div className="legendItem">
                    <div className={`legendColor studyHours`}></div>
                    <span>Study Hours</span>
                  </div>
                  <div className="legendItem">
                    <div className={`legendColor studyHours`}></div>
                    <span>Study Hours</span>
                  </div>
                  <div className="legendItem">
                    <div className={`legendColor productivity`}></div>
                    <span>Productivity %</span>
                  </div>
                </div>
              </div>
              <div className="chartWrapper">
                <Bar data={performanceData} options={options} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}></Grid>
      </Grid>
    </div>
  );
};

export default UserAnalytics;
