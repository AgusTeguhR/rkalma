import React from "react";
import OfflineDownloader from "./OfflineDownloader";

export const HEADER_HEIGHT = 50;

const Header = ({ title, onSearchChange }) => {
  // 🔽 DAFTAR FILE OFFLINE (NANTI BISA AUTO-GENERATE)
  const fileList = [
    "/surah/Al-Kahfi.pdf",
    "/surah/Al-Baqarah.pdf",
    // tambah PDF / image / font lain di sini
  ];

  return (
    <header
      style={{
        width: "100%",
        height: `${HEADER_HEIGHT}px`,
        backgroundColor: "#244502",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        padding: "0 12px",
      }}
    >
      {/* ⬅ Back Button */}
      <button
        onClick={() => window.history.back()}
        style={{
          fontSize: "22px",
          fontWeight: "500",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#ffffff",
          position: "relative",
          top: "-1px",
        }}
      >
        ←
      </button>

      {/* 🏷️ Title */}
      <div
        style={{
          marginLeft: "8px",
          fontSize: "19px",
          fontWeight: "bold",
          color: "#ffffff",
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </div>

      {/* 🔍 Search Bar */}
      {onSearchChange ? (
        <input
          type="text"
          placeholder="Cari..."
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "18px",
            border: "none",
            fontSize: "14px",
            outline: "none",
            width: "120px",
            background: "#ffffff",
            color: "#000",
            marginRight: "6px",
            transform: "translateX(-4px)",
          }}
        />
      ) : (
        <div style={{ width: "110px" }} />
      )}

      {/* ⬇️ Offline Downloader */}
      <OfflineDownloader fileList={fileList} />
    </header>
  );
};

export default Header;
