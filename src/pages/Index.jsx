import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
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

    // Step 1: Preload gambar splash (boleh lambat, tidak masalah)
    const splashImg = new Image();
    splashImg.src = "/images/splash.png";
    
    splashImg.onload = () => {
      console.log("Splash image loaded, waiting for full render...");
      
      // Tunggu lebih lama untuk memastikan splash benar-benar tampil sempurna di layar
      // Baru mulai loading home assets setelah splash 100% visible
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            console.log("Splash fully rendered, starting home assets loading...");
            setSplashRendered(true);
          }, 800); // Tunggu 800ms untuk memastikan image benar-benar penuh di layar
        });
      });
    };

    splashImg.onerror = () => {
      console.error("Splash image failed to load");
      setTimeout(() => setSplashRendered(true), 200);
    };

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  // Step 2: Preload SEMUA aset home HANYA setelah splash BENAR-BENAR tampil
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

      console.log(`✅ Splash fully visible! Starting home assets preload (${totalAssets} items)...`);

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
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
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
      {/* Splash Background - Tampil bertahap secara natural */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: "url(/images/splash.png)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#fff", // Background sementara saat loading
        }}
      />

      {/* Loading Top Bar - HANYA muncul setelah splash tampil penuh */}
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
            animation: "fadeIn 0.3s ease-in",
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

      {/* Progress percentage - Muncul bersamaan dengan loading bar */}
            </div>
    </>
  );
};

export default Index;