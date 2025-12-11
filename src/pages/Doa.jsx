import React, { useState } from "react";
import Header, { HEADER_HEIGHT } from "../components/Header";
import { doaList } from "../data/do'aList";
import { useNavigate } from "react-router-dom";

const Doa = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const filteredDoa = doaList.filter((d) =>
    d.name.toLowerCase().includes(keyword.toLowerCase())
  );

  const headerPx =
    typeof HEADER_HEIGHT === "number" ? `${HEADER_HEIGHT}px` : HEADER_HEIGHT;

  return (
    <div
      className="app-container"
      style={{
        width: "100%",
        margin: "0 auto",
        paddingTop: HEADER_HEIGHT,
        height: `calc(100vh - ${headerPx})`,
        boxSizing: "border-box", // <= penting
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Header title="Doa" onSearchChange={setKeyword} />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {filteredDoa.map((d) => (
          <li
            key={d.name}
            style={{
              padding: "12px 16px",
              marginBottom: "10px",
              borderRadius: "12px",
              background: "#ffffff",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onClick={() =>
              navigate(
                `/ayat/doa/${encodeURIComponent(
                  d.name
                )}?name=${encodeURIComponent(d.name)}`
              )
            }
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "2px",
                color: "#222",
              }}
            >
              {d.name}
            </div>

            {/* Area Arab tetap ada, tetapi kosong */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: 600,
                marginBottom: "2px",
                color: "#222",
              }}
            >
              {d.arab || ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Doa;
