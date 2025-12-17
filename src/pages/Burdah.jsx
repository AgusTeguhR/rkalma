import { useState } from "react";
import Header, { HEADER_HEIGHT } from "../components/Header";
import { burdahList } from "../data/burdahList";
import { useNavigate } from "react-router-dom";

const Burdah = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const filteredBurdah = burdahList.filter((b) =>
    b.name.toLowerCase().includes(keyword.toLowerCase())
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
      <Header title="Burdah" onSearchChange={setKeyword} />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        {filteredBurdah.map((b) => (
          <li
            key={b.name}
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
                `/ayat/burdah/${encodeURIComponent(
                  b.name
                )}?name=${encodeURIComponent(b.name)}`
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
              {b.name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Burdah;
