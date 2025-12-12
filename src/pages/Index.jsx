import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopLoadingBar from "../components/TopLoadingBar";
import Home from "./Home"; // preload komponen Home

const Index = () => {
  const navigate = useNavigate();
  const [loadingDone, setLoadingDone] = useState(false);
  const [preloadReady, setPreloadReady] = useState(false);

  // Preload halaman home
  useEffect(() => {
    // simulate preload
    const preloadTimer = setTimeout(() => {
      setPreloadReady(true);
    }, 300); // preload komponen cepat

    return () => clearTimeout(preloadTimer);
  }, []);

  // Ketika loading bar selesai dan home siap → redirect
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
      {/* Loading bar tampil di atas layar */}
      <TopLoadingBar onDone={() => setLoadingDone(true)} />

      {/* Render home secara diam-diam agar sudah siap sebelum ditampilkan */}
      <div style={{ display: "none" }}>
        <Home />
      </div>
    </div>
  );
};

export default Index;
