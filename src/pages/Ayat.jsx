 
import React, { useRef, useEffect, useState } from "react";
import Header, { HEADER_HEIGHT } from "../components/Header";
import { useParams, useLocation } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { version as pdfjsVersion } from "pdfjs-dist/package.json";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Ayat = () => {
  const { folder, id } = useParams();

  const query = new URLSearchParams(useLocation().search);
  const nameQuery = query.get("name") || "";

  const containerRef = useRef(null);
  const zoomTargetRef = useRef(null);

  // State untuk error handling
  const [error, setError] = useState(null);

  // SCALE disimpan dalam ref (ANTI FLICKER)
  const baseScaleRef = useRef(1);
  const pointersRef = useRef(new Map());
  const initialPinchDistRef = useRef(null);
  const pinchMidClientRef = useRef(null);
  const pinchMidContentRef = useRef(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;
  const SCALE_STEP = 0.25;

  const getMidpoint = (p1, p2) => ({
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  });

  const getDistance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const clientPointToContent = (container, clientPoint, scale) => {
    const rect = container.getBoundingClientRect();
    return {
      x: (container.scrollLeft + (clientPoint.x - rect.left)) / scale,
      y: (container.scrollTop + (clientPoint.y - rect.top)) / scale,
    };
  };

  // -------------------- GESTURE / PINCH ZOOM --------------------
  useEffect(() => {
    const container = containerRef.current;
    const target = zoomTargetRef.current;
    if (!container || !target) return;

    container.style.touchAction = "none";

    const onPointerDown = (ev) => {
      try {
        container.setPointerCapture(ev.pointerId);
      } catch (e) {
        console.warn("setPointerCapture failed:", e);
      }

      pointersRef.current.set(ev.pointerId, {
        x: ev.clientX,
        y: ev.clientY,
        prevX: ev.clientX,
        prevY: ev.clientY,
      });

      if (pointersRef.current.size === 2) {
        const [p1, p2] = [...pointersRef.current.values()];
        initialPinchDistRef.current = getDistance(p1, p2);

        const mid = getMidpoint(p1, p2);
        pinchMidClientRef.current = mid;

        pinchMidContentRef.current = clientPointToContent(
          container,
          mid,
          baseScaleRef.current
        );
      }
    };

    const onPointerMove = (ev) => {
      if (!pointersRef.current.has(ev.pointerId)) return;

      const entry = pointersRef.current.get(ev.pointerId);
      entry.x = ev.clientX;
      entry.y = ev.clientY;

      const pointers = [...pointersRef.current.values()];

      // PAN
      if (pointers.length === 1) {
        const p = pointers[0];
        container.scrollLeft -= p.x - p.prevX;
        container.scrollTop -= p.y - p.prevY;

        p.prevX = p.x;
        p.prevY = p.y;
        return;
      }

      // PINCH ZOOM
      if (pointers.length === 2) {
        const [p1, p2] = pointers;
        const dist = getDistance(p1, p2);
        const startDist = initialPinchDistRef.current || dist;
        const ratio = dist / startDist;

        let newScale = clamp(
          baseScaleRef.current * ratio,
          MIN_SCALE,
          MAX_SCALE
        );

        // ★ DOM TRANSFORM (ANTI FLICKER)
        target.style.transform = `scale(${newScale})`;
        target.style.transformOrigin = "0 0";

        const midClient = pinchMidClientRef.current;
        if (midClient) {
          const rect = container.getBoundingClientRect();
          const clientOffsetX = midClient.x - rect.left;
          const clientOffsetY = midClient.y - rect.top;

          const contentCoord = pinchMidContentRef.current;
          if (contentCoord) {
            container.scrollLeft = contentCoord.x * newScale - clientOffsetX;
            container.scrollTop = contentCoord.y * newScale - clientOffsetY;
          }
        }
        return;
      }
    };

    const onPointerUp = (ev) => {
      pointersRef.current.delete(ev.pointerId);

      for (const p of pointersRef.current.values()) {
        p.prevX = p.x;
        p.prevY = p.y;
      }

      // Commit latest scale - hanya jika masih ada transform
      if (pointersRef.current.size === 0) {
        const transform = window.getComputedStyle(target).transform;
        if (transform !== "none") {
          const match = transform.match(/matrix\(([^,]+),/);
          if (match) {
            const appliedScale = parseFloat(match[1]);
            if (!Number.isNaN(appliedScale)) {
              baseScaleRef.current = appliedScale;
            }
          }
        }
      }

      // Reset pinch refs jika tidak ada pointer lagi
      if (pointersRef.current.size < 2) {
        initialPinchDistRef.current = null;
        pinchMidClientRef.current = null;
        pinchMidContentRef.current = null;
      }

      try {
        container.releasePointerCapture(ev.pointerId);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Silent fail - normal jika capture sudah dirilis
      }
    };

    const onWheel = (ev) => {
      if (!ev.ctrlKey) return;
      ev.preventDefault();

      const rect = container.getBoundingClientRect();
      const clientPoint = { x: ev.clientX, y: ev.clientY };

      const contentCoord = clientPointToContent(
        container,
        clientPoint,
        baseScaleRef.current
      );

      const delta = ev.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      const newScale = clamp(
        baseScaleRef.current + delta,
        MIN_SCALE,
        MAX_SCALE
      );

      target.style.transform = `scale(${newScale})`;
      target.style.transformOrigin = "0 0";

      const clientOffsetX = ev.clientX - rect.left;
      const clientOffsetY = ev.clientY - rect.top;

      container.scrollLeft = contentCoord.x * newScale - clientOffsetX;
      container.scrollTop = contentCoord.y * newScale - clientOffsetY;

      baseScaleRef.current = newScale;
    };

    // LISTENERS
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
    };
  }, [MIN_SCALE, MAX_SCALE, SCALE_STEP]);

  // -------------------- PDF PATH --------------------
  const safeFolder = encodeURIComponent(folder || "");
  const safeId = encodeURIComponent(id || "");
  const fileUrl = `/${safeFolder}/${safeId}.pdf`;


  return (
    <div
      className="pdf-zoom-target"
      style={{
        width: "100%",
        margin: "0 auto",
        height: "100vh",
        paddingTop: HEADER_HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <Header title={nameQuery} />

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: "auto",
          touchAction: "none",
          position: "relative",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 120px)",
        }}
      >
        <div
          ref={zoomTargetRef}
          style={{
            width: "100%",
            transform: "scale(1)",
            transformOrigin: "0 0",
          }}
        >
          {error ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#dc2626",
                fontSize: "16px",
              }}
            >
              <div style={{ marginBottom: "10px", fontSize: "48px" }}>⚠️</div>
              <div style={{ fontWeight: "600", marginBottom: "8px" }}>
                {error}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                Silakan periksa koneksi internet atau coba muat ulang halaman.
              </div>
            </div>
          ) : (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={fileUrl}
                defaultScale={SpecialZoomLevel.PageWidth}
                onDocumentLoadFail={(e) => {
                  console.error("PDF gagal dimuat:", e);
                  setError("PDF tidak dapat dimuat");
                }}
              />
            </Worker>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ayat;