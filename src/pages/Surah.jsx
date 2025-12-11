import React, { useState } from "react";
import Header, { HEADER_HEIGHT } from "../components/Header";
import { surahList } from "../data/surahList";
import { useNavigate } from "react-router-dom";

const Surah = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const filteredSurah = surahList.filter(
    (s) =>
      s.name.toLowerCase().includes(keyword.toLowerCase()) ||
      s.arab.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div
      className="app-container"
      style={{
        width: "100%",
        margin: "0 auto",
        paddingTop: HEADER_HEIGHT,
        paddingBottom: HEADER_HEIGHT,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Header title="Surah" onSearchChange={setKeyword} />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {filteredSurah.map((s) => (
          <li
            key={s.name}
            style={{
              padding: "12px 16px",
              marginBottom: "10px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
              cursor: "pointer",

              display: "flex", // ← bikin horizontal
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onClick={() =>
              navigate(
                `/ayat/surah/${encodeURIComponent(
                  s.name
                )}?name=${encodeURIComponent(s.name)}`
              )
            }
          >
            {/* Nama Surah (kiri) */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#222",
              }}
            >
              {s.name}
            </div>

            {/* Arab (kanan) */}
            <div
              style={{
                fontSize: "16px",
                color: "#444",
                fontWeight: "500",
                marginLeft: "10px",
                direction: "rtl",
              }}
            >
              {s.arab}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Surah;
