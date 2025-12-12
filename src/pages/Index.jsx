import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingBar from "../components/LoadingBar";

const Index = () => {
  const navigate = useNavigate();
  const [splashLoaded, setSplashLoaded] = useState(false);
  const [splashRendered, setSplashRendered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [homeReady, setHomeReady] = useState(false);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    const splashImg = new Image();
    splashImg.src = "/images/splash.png";

    splashImg.onload = () => {
      setSplashLoaded(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            setSplashRendered(true);
          }, 400);
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

  useEffect(() => {
    if (!splashRendered) return;

    const preloadHomeAssets = () => {
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

        const handleLoad = () => {
          loadedCount++;
          const currentProgress = Math.round(
            (loadedCount / totalAssets) * 100
          );
          setProgress(currentProgress);

          if (loadedCount === totalAssets) {
            setTimeout(() => {
              setHomeReady(true);
            }, 500);
          }
        };

        img.onload = handleLoad;
        img.onerror = handleLoad;
        img.src = src;
      });
    };

    preloadHomeAssets();
  }, [splashRendered]);

  useEffect(() => {
    if (homeReady) {
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
      {/* Background Splash */}
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

      {/* Loading Bar */}
      {splashRendered && <LoadingBar progress={progress} />}
    </div>
  );
};

export default Index;
