import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "../components/TopLoadingBar";
import Home from "./Home";

const Index = () => {
  const navigate = useNavigate();

  const [isSplashLoaded, setSplashLoaded] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [preloadReady, setPreloadReady] = useState(false);
  const [startLoading, setStartLoading] = useState(false);

  // Pastikan gambar splash sudah benar-benar dimuat
  useEffect(() => {
    const img = new Image();
    img.src = "/images/splash.png";

    img.onload = () => {
      setSplashLoaded(true); // halaman splash benar-benar sudah tampil penuh
    };
  }, []);

  // Setelah splash ter-render → mulai preload halaman HOME
  useEffect(() => {
    if (isSplashLoaded) {
      // Mulai loading bar secara async agar tidak dianggap synchronous update
      Promise.resolve().then(() => setStartLoading(true));

      const preloadTimer = setTimeout(() => {
        setPreloadReady(true);
      }, 500);

      return () => clearTimeout(preloadTimer);
    }
  }, [isSplashLoaded]);

  // Redirect ketika semuanya siap
  useEffect(() => {
    if (loadingDone && preloadReady) {
      navigate("/home");
    }
  }, [loadingDone, preloadReady, navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url(/images/splash.png)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Loading bar hanya muncul setelah splash sudah tampil FULL */}
      {startLoading && <TopLoadingBar onDone={() => setLoadingDone(true)} />}

      {/* Preload halaman home agar ketika redirect masuk secara instan */}
      <div style={{ display: "none" }}>
        <Home />
      </div>
    </div>
  );
};

export default Index;
