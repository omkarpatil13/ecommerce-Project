import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (value) => {
    setInput(value);
    if (value.trim().length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8091/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];

  return (
    <header>
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/add_product">
                  Add Product
                </a>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Categories
                </a>
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark-theme" ? (
                <i className="bi bi-moon-fill"></i>
              ) : (
                <i className="bi bi-sun-fill"></i>
              )}
            </button>

            <div className="d-flex align-items-center cart" ref={searchRef}>
              <a href="/cart" className="nav-link text-dark">
                <i className="bi bi-cart me-2">Cart</i>
              </a>
              <div style={{ position: "relative" }}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => {
                    if (input.trim().length > 0) setShowSearchResults(true);
                  }}
                />
                {showSearchResults && (
                  <ul
                    className="list-group"
                    style={{
                      position: "absolute",
                      top: "40px",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      background: "#fff",
                      maxHeight: "250px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                    }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <li
                          key={result.id}
                          className="list-group-item"
                          style={{ cursor: "pointer" }}
                        >
                          <a
                            href={`/product/${result.id}`}
                            className="search-result-link"
                            style={{ textDecoration: "none", color: "black" }}
                          >
                            {result.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      noResults && (
                        <li className="list-group-item text-muted">
                          No Product Found
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
