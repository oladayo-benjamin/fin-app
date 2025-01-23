import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./PriceChart.css";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PriceChart({ item }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        let response;
        let prices = [];

        if (item.type === "crypto") {
          response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${item.id}/market_chart`,
            { params: { vs_currency: "usd", days: 7 } }
          );
          if (response.data?.prices) {
            prices = response.data.prices.map(([timestamp, price]) => ({
              x: new Date(timestamp).toLocaleDateString(),
              y: price,
            }));
          }
        } else if (item.type === "stock") {
          response = await axios.get("https://www.alphavantage.co/query", {
            params: {
              function: "TIME_SERIES_DAILY",
              symbol: item.id,
              apikey: "CSAUN0DPOA3SPBAO",
            },
          });
          const timeSeries = response.data["Time Series (Daily)"];
          if (timeSeries) {
            prices = Object.entries(timeSeries)
              .map(([date, value]) => ({
                x: new Date(date).toLocaleDateString(),
                y: parseFloat(value["4. close"]),
              }))
              .slice(0, 7);
          }
        }

        if (prices.length > 0) {
          setChartData({
            labels: prices.map((point) => point.x),
            datasets: [
              {
                label: `${item.name} Price (last 7 days)`,
                data: prices.map((point) => point.y),
                fill: true,
                backgroundColor:
                  item.type === "crypto"
                    ? "rgba(66, 165, 245, 0.2)"
                    : "rgba(245, 66, 66, 0.2)",
                borderColor: item.type === "crypto" ? "#42a5f5" : "#f54242",
                tension: 0.1,
              },
            ],
          });
          setError(null);
        } else {
          setError("No data available for the selected item.");
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to fetch chart data. Please try again.");
      }
    };

    if (item?.id && item?.type) {
      fetchChartData();
    }
  }, [item]);

  return (
    <div className="PriceChart">
      {error ? (
        <p className="error">{error}</p>
      ) : chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default PriceChart;
