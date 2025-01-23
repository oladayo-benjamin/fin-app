import React, { useState } from "react";
import axios from "axios";
import "./SearchBar.css";

function SearchBar({ onSearchSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    setQuery(e.target.value);

    if (e.target.value.length > 2) {
      try {
        // Fetch cryptocurrency suggestions
        const cryptoResponse = await axios.get(
          `https://api.coingecko.com/api/v3/search?query=${e.target.value}`
        );
        const cryptoSuggestions = cryptoResponse.data.coins.map((crypto) => ({
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol,
          type: "crypto",
        }));

        // Fetch stock suggestions
        const stockResponse = await axios.get(
          "https://www.alphavantage.co/query",
          {
            params: {
              function: "SYMBOL_SEARCH",
              keywords: e.target.value,
              apikey: "QDCMZ8VB9GBHI78R",
            },
          }
        );

        const stockSuggestions =
          stockResponse.data &&
          stockResponse.data.bestMatches &&
          Array.isArray(stockResponse.data.bestMatches)
            ? stockResponse.data.bestMatches.map((stock) => ({
                id: stock["1. symbol"],
                name: stock["2. name"],
                symbol: stock["1. symbol"],
                type: "stock",
              }))
            : [];

        // Combine and set suggestions
        setSuggestions([...cryptoSuggestions, ...stockSuggestions]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    onSearchSelect(item);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for cryptocurrency or stock..."
      />
      <ul className="suggestions">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} onClick={() => handleSelect(suggestion)}>
            {suggestion.name} ({suggestion.symbol})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBar;
