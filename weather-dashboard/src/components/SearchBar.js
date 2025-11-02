import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Remove useSelector from import
import { fetchCurrentWeather } from '../store/weatherSlice';
import { CITY_SUGGESTIONS } from '../store/weatherSlice';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const filtered = CITY_SUGGESTIONS.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleSearch = (searchQuery = null) => {
    const cityToSearch = searchQuery || query;
    if (cityToSearch.trim()) {
      dispatch(fetchCurrentWeather(cityToSearch));
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for cities..."
            className="search-input"
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
          />
          <button 
            type="submit"
            className="search-btn"
          >
            <span className="search-icon">🔍</span>
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="suggestion-text">{suggestion}</span>
                <span className="suggestion-hint">Click to add</span>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && query.length > 1 && suggestions.length === 0 && (
          <div className="suggestions-dropdown">
            <div className="suggestion-item no-results">
              No cities found. Try different spelling.
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;