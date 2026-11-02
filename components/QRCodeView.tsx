"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export function QRCodeView({
  value,
  size = 120,
  className = "",
  darkColor = "#07090E",
  lightColor = "#FFFFFF",
}: QRCodeViewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      value,
      {
        width: size * 2, // 2x for retina sharpness
        margin: 1,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: "M",
      },
      (err, url) => {
        if (!err && url && isMounted) {
          setDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`animate-pulse bg-white/10 rounded-xl flex items-center justify-center text-[9px] font-mono text-neutral-400 ${className}`}
      >
        QR...
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-xl overflow-hidden shadow-inner flex items-center justify-center bg-white p-1.5 ${className}`}
    >
      <img
        src={dataUrl}
        alt={`QR Code for ${value}`}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
  );
}

