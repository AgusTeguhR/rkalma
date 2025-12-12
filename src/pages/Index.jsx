import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [splashLoaded, setSplashLoaded] = useState(false);
  const [splashRendered, setSplashRendered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [homeReady, setHomeReady] = useState(false);

  // Fix screen height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  // 1. Load gambar splash
  useEffect(() => {
    const splashImg = new Image();
    splashImg.src = "/images/splash.png";

    splashImg.onload = () => {
      setSplashLoaded(true);
      // Splash akan tampil di layar frame berikutnya
      requestAnimationFrame(() => setSplashRendered(true));
    };

    splashImg.onerror = () => {
      console.error("Splash failed to load");
      setSplashLoaded(true);
      requestAnimationFrame(() => setSplashRendered(true));
    };
  }, []);

  // 2. Baru mulai loading setelah splashRendered = true
  useEffect(() => {
    if (!splashRendered) return;

    const homeAssets = [
      "/images/backgroundmain.png",
      "/images/surah.png",
      "/images/wirid.png",
      "/images/doa.png",
      "/images/khutbah.png",
      "/images/dalail.png",
      "/images/tasbih.png",
      "/images/burdah.png",
      "/images/simt.png",
      "/images/ma.png",
    ];

    let loadedCount = 0;
    const totalAssets = homeAssets.length;

    homeAssets.forEach((src) => {
      const img = new Image();

      const handleDone = () => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalAssets) * 100));

        if (loadedCount === totalAssets) {
          setTimeout(() => setHomeReady(true), 400);
        }
      };

      img.onload = handleDone;
      img.onerror = handleDone;
      img.src = src;
    });
  }, [splashRendered]);

  // 3. Redirect ke home ketika siap
  useEffect(() => {
    if (!homeReady) return;

    const t = setTimeout(() => navigate("/home"), 200);
    return () => clearTimeout(t);
  }, [homeReady, navigate]);

  return (
    <div
      className="app-container"
      style={{
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      {/* Splash tampil langsung */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: "url(/images/splash.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          opacity: splashLoaded ? 1 : 0,
          transition: "opacity 0.25s ease-in",
        }}
      />

      {/* Loading bar mulai SETELAH splashRendered = true */}
      {splashRendered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor: "rgba(255,255,255,0.4)",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#4CAF50",
              transition: "width 0.3s ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
