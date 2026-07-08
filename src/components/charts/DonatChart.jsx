"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonatChart({ value, total }) {
  const percent = total === 0 ? 0 : Math.round((value / total) * 100);

  const data = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [
          "#67A2C5", 
          "#e7e5e4", 
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: 180,
    circumference: 360,
    cutout: "90%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative h-30 w-30 sm:h-40 sm:w-40">
      <Doughnut data={data} options={options} />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-bold">{percent}%</div>

          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>
    </div>
  );
}
