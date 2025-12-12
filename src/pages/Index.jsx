import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // perbaikan tinggi layar (untuk mobile)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    // Auto navigate setelah splash
    const timer = setTimeout(() => {
      navigate("/home");
    }, 2500); // lama splash screen

    return () => {
      window.removeEventListener("resize", setVH);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="app-container"
      style={{
        width: "100vw",
        height: "calc(var(--vh) * 100)",
        backgroundImage: "url(/images/splash.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        position: "relative",
      }}
    ></div>
  );
};

export default Index;
