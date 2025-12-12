import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [splashLoaded, setSplashLoaded] = useState(false);
  const [splashRendered, setSplashRendered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [homeReady, setHomeReady] = useState(false);

  useEffect(() => {
    // Perbaikan tinggi layar (untuk mobile)
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    // Step 1: Preload gambar splash
    const splashImg = new Image();
    splashImg.src = "/images/splash.png";
    
    splashImg.onload = () => {
      // Gambar splash sudah loaded di memory
      setSplashLoaded(true);
      
      // Step 2: Tunggu gambar benar-benar ter-render di browser
      // Gunakan requestAnimationFrame untuk memastikan render selesai
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Tunggu transisi opacity selesai (300ms) + buffer
          setTimeout(() => {
            setSplashRendered(true);
          }, 400); // 300ms transition + 100ms buffer
        });
      });
    };

    splashImg.onerror = () => {
      // Jika gambar gagal load, tetap lanjut
      console.error("Splash image failed to load");
      setSplashLoaded(true);
      // Langsung set rendered jika error
      setTimeout(() => setSplashRendered(true), 100);
    };

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  // Step 3: Mulai loading HANYA setelah splash ter-render penuh
  useEffect(() => {
    if (!splashRendered) return;

    const startHomePreloading = () => {
      // Simulasi preloading dengan progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 2;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          
          // Tunggu sebentar untuk smooth transition
          setTimeout(() => {
            setHomeReady(true);
          }, 300);
        }
      }, 30); // Total waktu: 30ms * 50 steps = 1.5 detik

      // Preload aset-aset untuk halaman home
      preloadHomeAssets();
    };

    const preloadHomeAssets = () => {
      // Tambahkan semua gambar/aset yang ada di halaman home
      const homeAssets = [
        "/images/home-bg.png",
        "/images/logo.png",
        // Tambahkan semua aset lain yang ada di halaman home
      ];

      homeAssets.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Panggil fungsi preloading
    startHomePreloading();
  }, [splashRendered]);

  // Navigate ke home setelah semua siap
  useEffect(() => {
    if (homeReady) {
      // Tambah delay kecil untuk memastikan transisi smooth
      const timer = setTimeout(() => {
        navigate("/home");
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [homeReady, navigate]);

  return (
    <div
      className="app-container"
      style={{
        width: "100vw",
        height: "calc(var(--vh, 1vh) * 100)",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff", // Fallback background
      }}
    >
      {/* Splash Background */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: splashLoaded ? "url(/images/splash.png)" : "none",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          opacity: splashLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in",
        }}
      />

      {/* Loading Top Bar - hanya muncul setelah splash ter-render PENUH */}
      {splashRendered && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#4CAF50",
              transition: "width 0.1s ease-out",
              boxShadow: "0 0 10px rgba(76, 175, 80, 0.8)",
            }}
          />
        </div>
      )}

      {/* Progress percentage (opsional) */}
      {splashRendered && (
        <div style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#333",
          fontSize: "0.9rem",
          fontWeight: "500",
          zIndex: 999
        }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default Index;