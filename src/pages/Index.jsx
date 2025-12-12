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
      setSplashLoaded(true);
      
      // Tunggu gambar benar-benar ter-render di browser
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            setSplashRendered(true);
          }, 400); // 300ms transition + 100ms buffer
        });
      });
    };

    splashImg.onerror = () => {
      console.error("Splash image failed to load");
      setSplashLoaded(true);
      setTimeout(() => setSplashRendered(true), 100);
    };

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  // Step 2: Preload SEMUA aset home setelah splash rendered
  useEffect(() => {
    if (!splashRendered) return;

    const preloadHomeAssets = () => {
      // SEMUA gambar yang ada di halaman Home
      const homeAssets = [
        // Background home
        "/images/backgroundmain.png",
        
        // 9 menu items
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
      // eslint-disable-next-line no-unused-vars
      let hasError = false;

      console.log(`Starting to preload ${totalAssets} assets...`);

      // Load setiap aset dan track progressnya secara REAL
      homeAssets.forEach((src) => {
        const img = new Image();
        
        const handleLoad = (success = true) => {
          loadedCount++;
          const currentProgress = Math.round((loadedCount / totalAssets) * 100);
          setProgress(currentProgress);

          if (success) {
            console.log(`✓ Loaded (${loadedCount}/${totalAssets}): ${src}`);
          } else {
            console.warn(`✗ Failed (${loadedCount}/${totalAssets}): ${src}`);
          }

          // Jika semua aset sudah diproses (loaded atau error)
          if (loadedCount === totalAssets) {
            console.log("All assets processed!");
            
            // Tunggu sebentar untuk memastikan browser sudah render semua
            setTimeout(() => {
              setHomeReady(true);
            }, 500);
          }
        };

        img.onload = () => handleLoad(true);
        img.onerror = () => {
          hasError = true;
          handleLoad(false);
        };

        img.src = src;
      });
    };

    preloadHomeAssets();
  }, [splashRendered]);

  // Step 3: Navigate ke home setelah SEMUA aset ready
  useEffect(() => {
    if (homeReady) {
      console.log("Navigating to home...");
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
        backgroundColor: "#fff",
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

      {/* Loading Top Bar */}
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
              transition: "width 0.3s ease-out",
              boxShadow: "0 0 10px rgba(76, 175, 80, 0.8)",
            }}
          />
        </div>
      )}

      {/* Progress percentage */}
      {splashRendered && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#333",
            fontSize: "0.9rem",
            fontWeight: "600",
            zIndex: 999,
            textShadow: "0 1px 3px rgba(255,255,255,0.8)",
          }}
        >
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default Index;