"use client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface DashboardChartProps {
  dashboardData?: {
    total_properties?: number;
    total_earnings?: number;
    total_transactions?: number;
  };
}

const DashboardChart = ({ dashboardData }: DashboardChartProps) => {
  // Create chart data based on dashboard stats
  const data = {
    labels: ["Properties", "Earnings", "Transactions"],
    datasets: [
      {
        label: "Dashboard Statistics",
        width: "14px",
        backgroundColor: "#0072c6",
        borderColor: "#0072c6",
        borderWidth: 1,
        hoverBackgroundColor: "#0072c6",
        hoverBorderColor: "#0072c6",
        data: [
          dashboardData?.total_properties || 0,
          dashboardData?.total_earnings
            ? Number(dashboardData.total_earnings) / 1000
            : 0, // Scale down for chart
          dashboardData?.total_transactions || 0,
        ],
      },
    ],
  };

  // Bar chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString();
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <Bar data={data} options={options} />
    </>
  );
};

export default DashboardChart;
