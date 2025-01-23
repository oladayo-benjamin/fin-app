import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PriceDisplay.css";

function PriceDisplay({ item }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (item.type === "crypto") {
        setData(item);
      } else if (item.type === "stock") {
        const response = await axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: item.id,
            apikey: "QDCMZ8VB9GBHI78R",
          },
        });
        const stockData = response.data["Global Quote"];
        setData({
          name: item.name,
          symbol: item.id,
          price: stockData["05. price"],
          change: stockData["10. change percent"],
          volume: stockData["06. volume"],
        });
      }
    };

    fetchData();
  }, [item]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="PriceDisplay">
      <h2>{data.name}</h2>
      <p>Symbol: {data.symbol}</p>
      <p>Price: {data.price || data.current_price} USD</p>
      <p>24h Change: {data.change || data.price_change_percentage_24h}%</p>
      <p>Trading Volume: {data.volume || data.total_volume} USD</p>
    </div>
  );
}

export default PriceDisplay;
