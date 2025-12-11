import { useState } from "react";
import Header, { HEADER_HEIGHT } from "../components/Header";
import { dalailList } from "../data/dalailList";
import { useNavigate } from "react-router-dom";

const Dalail = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const filteredDalail = dalailList.filter((d) =>
    d.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div
      className="app-container"
      style={{
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto",
        paddingTop: HEADER_HEIGHT,
        paddingBottom: HEADER_HEIGHT,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Header title="Dalail" onSearchChange={setKeyword} />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {filteredDalail.map((d) => (
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
                `/ayat/dalail/${encodeURIComponent(
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

            <div
              style={{
                fontSize: "12px",
                color: "#666",
                minHeight: "16px",
              }}
            >
              {d.info || ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dalail;
