import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    // Redirect setelah halaman benar-benar selesai loading
    const handleLoad = () => {
      setTimeout(() => {
        navigate("/home");
      }, 800); // delay kecil agar splash terlihat utuh
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("load", handleLoad);
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
