import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PdfViewer = () => {
  const navigate = useNavigate();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  // Daftar PDF sesuai dengan folder Anda
  const pdfList = [
    { id: 1, title: "Surah Al-Kahfi", url: "/surah/Surah Al-Kahfi.pdf" },
    { id: 2, title: "Surah Al-Mulk", url: "/surah/Surah Al-Mulk.pdf" },
    { id: 3, title: "Surah Al-Waqi'ah", url: "/surah/Surah Al-Waqi'ah.pdf" },
    { id: 4, title: "Surah Yasin", url: "/surah/Surah Yasin.pdf" },
  ];

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // Scroll down - sembunyikan header
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY) {
      // Scroll up - tampilkan header
      setShowHeader(true);
    }
    
    setLastScrollY(currentScrollY);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      {/* Header - dengan animasi slide */}
      <div
        style={{
          backgroundColor: "#2c5f2d",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          position: selectedPdf ? "fixed" : "relative",
          top: selectedPdf ? (showHeader ? "0" : "-70px") : "0",
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "top 0.3s ease",
        }}
      >
        {selectedPdf && (
          <button
            onClick={() => {
              setSelectedPdf(null);
              setShowHeader(true);
            }}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
            }}
          >
            ←
          </button>
        )}
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {selectedPdf ? `Surah - ${selectedPdf.title}` : "Pilih Surah"}
        </h2>
        {!selectedPdf && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "1px solid white",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              padding: "8px 15px",
              borderRadius: "5px",
            }}
          >
            Kembali
          </button>
        )}
      </div>

      {/* Content Area */}
      {selectedPdf ? (
        /* PDF Iframe - Full Screen */
        <div
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            position: "relative",
            paddingTop: showHeader ? "60px" : "0",
            transition: "padding-top 0.3s ease",
          }}
        >
          <iframe
            src={selectedPdf.url}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "white",
            }}
            title="PDF Document"
          />
        </div>
      ) : (
        /* List PDF */
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "20px",
          }}
          onScroll={handleScroll}
        >
          <div
            style={{
              display: "grid",
              gap: "15px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {pdfList.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => setSelectedPdf(pdf)}
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#2c5f2d",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  📖
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      color: "#2c3e50",
                      marginBottom: "5px",
                    }}
                  >
                    {pdf.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#7f8c8d",
                    }}
                  >
                    Klik untuk membuka
                  </p>
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    color: "#95a5a6",
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;