import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = ({ labels, dataPoints, gradientFrom, gradientTo }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Satışlar",
        data: dataPoints,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return null;
          // Üstten alta doğru fərqli keçidli gradient
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, gradientFrom);
          gradient.addColorStop(1, gradientTo);
          return gradient;
        },
        borderRadius: 10,
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e293b",
        titleFont: { size: 18, weight: "bold", family: "sans-serif" },
        bodyFont: { size: 16, family: "sans-serif" },
        padding: 16,
        borderColor: "#94a3b8",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#cbd5e1",
          font: { size: 16, weight: "bold", family: "sans-serif" },
        },
      },
      y: {
        grid: { color: "rgba(203, 213, 225, 0.2)" },
        ticks: {
          color: "#cbd5e1",
          font: { size: 16, weight: "bold", family: "sans-serif" },
        },
      },
    },
  };

  return (
    <div className="max-w-full p-8 bg-gradient-to-br from-indigo-900/70 to-blue-900/70 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Dekorativ elementlər */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-yellow-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-200/10 rounded-full blur-3xl"></div>

      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 text-center mb-8 relative z-10">
        Satış İstatistikləri
      </h2>
      <div className="relative h-80 sm:h-96 md:h-[32rem] z-10">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default ChartComponent;
