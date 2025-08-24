import * as React from "react";

interface PriceDropAlertEmailProps {
  productName: string;
  competitorName: string;
  oldPrice: number;
  newPrice: number;
  productUrl: string;
}

export const PriceDropAlertEmail: React.FC<
  Readonly<PriceDropAlertEmailProps>
> = ({ productName, competitorName, oldPrice, newPrice, productUrl }) => {
  const priceDropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "20px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ color: "#333" }}>🚨 Price Drop Alert</h1>
        <p>
          A significant price drop has been detected for a product you are
          tracking.
        </p>
        <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Product:</strong> {productName}
          </p>
          <p>
            <strong>Competitor:</strong> {competitorName}
          </p>
          <p>
            <strong>Price Change:</strong>
            <span style={{ textDecoration: "line-through", color: "#999" }}>
              ${oldPrice.toFixed(2)}
            </span>{" "}
            →
            <strong style={{ color: "#28a745" }}>
              {" "}
              ${newPrice.toFixed(2)}
            </strong>
          </p>
          <p style={{ fontSize: "18px", fontWeight: "bold", color: "#dc3545" }}>
            {priceDropPercentage.toFixed(1)}% Drop
          </p>
        </div>
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href={productUrl}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "12px 25px",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            View Product Page
          </a>
        </div>
      </div>
    </div>
  );
};
