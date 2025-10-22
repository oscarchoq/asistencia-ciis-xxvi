"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function QRScannerPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const runningRef = useRef(false);

  const startCamera = async () => {
    if (stream) return;
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(s);
    } catch (err: any) {
      setError(err?.message || "No se pudo acceder a la cámara");
    }
  };

  const stopCamera = () => {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
    runningRef.current = false;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      if (ctx)
        ctx.clearRect(
          0,
          0,
          overlayRef.current.width,
          overlayRef.current.height
        );
    }
  };

  const resetScanner = () => {
    // Mostrar SweetAlert de éxito
    Swal.fire({
      title: "¡Éxito!",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    // Limpiar contenido
    setDecodedText(null);

    // Limpiar canvas
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext("2d");
      if (ctx)
        ctx.clearRect(
          0,
          0,
          overlayRef.current.width,
          overlayRef.current.height
        );
    }
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  useEffect(() => {
    if (!stream) return;
    const video = videoRef.current!;
    const overlay = overlayRef.current!;
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    const ovCtx = overlay.getContext("2d")!;
    let detector: any = null;
    let jsqrLoaded = false;
    let stopped = false;
    runningRef.current = true;

    const loadJsQR = () =>
      new Promise<void>((resolve, reject) => {
        if ((window as any).jsQR) return resolve();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
        s.async = true;
        s.onload = () => {
          jsqrLoaded = true;
          resolve();
        };
        s.onerror = () => reject(new Error("No se pudo cargar jsQR"));
        document.head.appendChild(s);
      });

    const resizeCanvases = () => {
      const w = video.videoWidth || video.clientWidth || 320;
      const h = video.videoHeight || video.clientHeight || 240;
      offscreen.width = overlay.width = w;
      offscreen.height = overlay.height = h;
    };

    const drawDetected = (
      raw: string,
      corners?: Array<{ x: number; y: number }>,
      bb?: any
    ) => {
      ovCtx.clearRect(0, 0, overlay.width, overlay.height);
      ovCtx.drawImage(video, 0, 0, overlay.width, overlay.height);
      ovCtx.lineWidth = 4;
      ovCtx.strokeStyle = "lime";
      ovCtx.fillStyle = "rgba(0,0,0,0.6)";
      if (corners?.length) {
        ovCtx.beginPath();
        corners.forEach((p, i) =>
          i === 0 ? ovCtx.moveTo(p.x, p.y) : ovCtx.lineTo(p.x, p.y)
        );
        ovCtx.closePath();
        ovCtx.stroke();
      } else if (bb) ovCtx.strokeRect(bb.x, bb.y, bb.width, bb.height);
      const padding = 6;
      ovCtx.font = "16px sans-serif";
      const metrics = ovCtx.measureText(raw);
      ovCtx.fillRect(
        10,
        overlay.height - 30 - 10,
        metrics.width + padding * 2,
        24 + padding
      );
      ovCtx.fillStyle = "lime";
      ovCtx.fillText(raw, 10 + padding, overlay.height - 10 - 6);
    };

    const tick = async () => {
      if (!runningRef.current || stopped) return;
      if (video.readyState < 2) {
        rafIdRef.current = requestAnimationFrame(tick);
        return;
      }
      resizeCanvases();
      try {
        offCtx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
      } catch {}

      let detected = false;

      if ((window as any).BarcodeDetector) {
        try {
          if (!detector)
            detector = new (window as any).BarcodeDetector({
              formats: ["qr_code"],
            });
          const results: Array<any> = await detector.detect(offscreen);
          if (results.length) {
            const r = results[0];
            const raw = r.rawValue ?? "";
            setDecodedText(raw);
            drawDetected(raw, r.cornerPoints, r.boundingBox);
            detected = true;
          }
        } catch {}
      } else {
        try {
          if (!jsqrLoaded) await loadJsQR();
          const imgData = offCtx.getImageData(
            0,
            0,
            offscreen.width,
            offscreen.height
          );
          const res = (window as any).jsQR?.(
            imgData.data,
            imgData.width,
            imgData.height
          );
          if (res) {
            setDecodedText(res.data ?? "");
            const loc = res.location;
            if (loc)
              drawDetected(res.data, [
                loc.topLeftCorner,
                loc.topRightCorner,
                loc.bottomRightCorner,
                loc.bottomLeftCorner,
              ]);
            else drawDetected(res.data);
            detected = true;
          }
        } catch (e: any) {
          setError(e?.message || "Error en detección fallback (jsQR).");
          runningRef.current = false;
          stopped = true;
        }
      }

      if (detected) stopCamera();
      else rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      runningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [stream]);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject)
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      runningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[360px] flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Detector QR</h1>

        <button
          onClick={() => (stream ? stopCamera() : startCamera())}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition w-full"
        >
          {stream ? "Apagar cámara" : "Encender cámara"}
        </button>

        <div className="w-full h-[240px] border rounded-lg overflow-hidden bg-black flex items-center justify-center relative">
          {stream ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />
              <canvas
                ref={overlayRef}
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
              />
            </>
          ) : (
            <p className="text-gray-400">Cámara apagada</p>
          )}
        </div>

        {decodedText && (
          <div className="flex flex-col items-center gap-3 w-full">
            <input
              type="text"
              value={decodedText}
              readOnly
              className="p-2 border rounded w-full text-center bg-gray-50 text-gray-800 shadow-sm"
            />
            <button
              onClick={resetScanner}
              className="flex items-center justify-center gap-2 px-6 py-4 min-h-[60px] bg-green-600 text-white rounded shadow hover:bg-green-700 transition w-full"
            >
              <span className="text-2xl font-bold font-sans">
                Habilitar Asistencia
              </span>
            </button>
          </div>
        )}

        {error && <div className="text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
}
