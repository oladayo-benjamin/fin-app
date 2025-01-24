import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PriceDisplay.css";

function PriceDisplay({ item }) {
  const [data, setData] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [convertedPrice, setConvertedPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (item.type === "crypto") {
        setData(item);
        setConvertedPrice(item.current_price);
      } else if (item.type === "stock") {
        const response = await axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: item.id,
            apikey: "CSAUN0DPOA3SPBAO",
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
        setConvertedPrice(stockData["05. price"]);
      }
    };

    fetchData();
  }, [item]);

  useEffect(() => {
    const convertCurrency = async () => {
      if (item.type === "crypto") {
        try {
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
              params: {
                ids: item.id,
                vs_currencies: currency,
              },
            }
          );
          setConvertedPrice(response.data[item.id][currency]);
        } catch (error) {
          console.error("Error converting cryptocurrency price:", error);
        }
      }
    };

    convertCurrency();
  }, [currency, item]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="PriceDisplay">
      <h2>{data.name}</h2>
      <p>Symbol: {data.symbol}</p>
      <p>
        Price: {convertedPrice} {currency.toUpperCase()}
      </p>
      <p>24h Change: {data.change || data.price_change_percentage_24h}%</p>
      <p>Trading Volume: {data.volume || data.total_volume} USD</p>

      <div>
        <label htmlFor="currency-select">Convert to: </label>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
          <option value="inr">INR</option>
          <option value="jpy">JPY</option>
        </select>
      </div>
    </div>
  );
}

export default PriceDisplay;
