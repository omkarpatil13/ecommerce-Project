import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const Home = ({ selectedCategory }) => {
  const { addToCart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const location = useLocation(); // refetch when route changes

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      setIsDataFetched(false);
      try {
        const res = await axios.get("http://localhost:8091/api/products");
        const productList = Array.isArray(res.data) ? res.data : [];

        const updated = await Promise.all(
          productList.map(async (product) => {
            try {
              const imageRes = await axios.get(
                `http://localhost:8091/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(imageRes.data);
              return { ...product, imageUrl };
            } catch (err) {
              console.error("Error fetching image for product id:", product.id, err);
              return {
                ...product,
                imageUrl: "https://via.placeholder.com/250x150?text=No+Image",
              };
            }
          })
        );

        if (mounted) setProducts(updated);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setIsDataFetched(true);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  // filter (case-insensitive)
  const filteredProducts =
    !selectedCategory || selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            (p.category || "").toLowerCase() ===
            (selectedCategory || "").toLowerCase()
        );

  return (
    <div style={{ paddingTop: "72px" /* leave room for navbar */ }}>
      <div
        className="grid"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(220px, 1fr))", // four per row
          gap: "20px",
          padding: "20px",
        }}
      >
        {isDataFetched && filteredProducts.length === 0 ? (
          <h2
            style={{
              textAlign: "center",
              gridColumn: "1 / -1",
              color: "#555",
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const {
              id,
              brand = "",
              name = "",
              price = "",
              productAvailable = true,
              imageUrl,
            } = product;

            return (
              <div
                className="card mb-3"
                key={id}
                style={{
                  width: "100%",
                  height: "360px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: productAvailable ? "#fff" : "#f0f0f0",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link
                  to={`/product/${id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ height: 180, overflow: "hidden", background: "#fafafa" }}>
                    <img
                      src={imageUrl}
                      alt={name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/250x150?text=No+Image";
                      }}
                    />
                  </div>

                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "12px",
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                        {name.toUpperCase()}
                      </h5>
                      <div style={{ fontStyle: "italic", color: "#666", marginTop: 6 }}>
                        {"~ " + brand}
                      </div>
                    </div>

                    <div>
                      <div style={{ marginTop: 8, fontWeight: 600, color: "#333" }}>
                        {"$" + price}
                      </div>
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: 8 }}
                        onClick={(e) => {
                          e.preventDefault(); // prevent Link navigation when clicking button
                          addToCart(product);
                        }}
                        disabled={!productAvailable}
                      >
                        {productAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
