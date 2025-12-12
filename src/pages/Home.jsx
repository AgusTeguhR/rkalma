import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    // Set ready setelah component mount
    // Karena semua gambar sudah di-preload di Index, ini akan instant
    requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => window.removeEventListener("resize", setVH);
  }, []);

  // useMemo untuk menuItems agar tidak re-create setiap render
  const menuItems = useMemo(
    () => [
      { img: "/images/surah.png", route: "/surah" },
      { img: "/images/wirid.png", route: "/wirid" },
      { img: "/images/doa.png", route: "/doa" },
      { img: "/images/khutbah.png", route: "/khutbah" },
      { img: "/images/dalail.png", route: "/dalail" },
      { img: "/images/tasbih.png", route: "/tasbih" },
      { img: "/images/burdah.png", route: "/burdah" },
      { img: "/images/simt.png", route: "/simthud" },
      { img: "/images/ma.png", route: "/maulid" },
    ],
    []
  );

  const handleClick = (route, index) => {
    setActiveIndex(index);
    setTimeout(() => {
      setActiveIndex(null);
      navigate(route);
    }, 150);
  };

  return (
    <div
      className="app-container"
      style={{
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)",
        backgroundImage: "url(/images/backgroundmain.webp)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        position: "relative",
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.2s ease-in",
      }}
    >
      {/* KONTAINER-ALL */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          width: "100%",
          height: "57%",
          borderRadius: "20px 20px 0 0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* GRID WRAPPER */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 1fr)",
            gap: "5px",
          }}
        >
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.route, index)}
              style={{
                cursor: "pointer",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.15s ease-out",
                // Optimasi: akan-berubah untuk smooth animation
                willChange: activeIndex === index ? "transform" : "auto",
              }}
            >
              <img
                src={item.img}
                alt={`Menu ${index + 1}`}
                loading="eager" // Prioritas tinggi karena sudah di-preload
                style={{
                  width: "80%",
                  height: "83%",
                  objectFit: "fill",
                  borderRadius: "18%",
                  // Optimasi: disable image dragging
                  userSelect: "none",
                  WebkitUserDrag: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;