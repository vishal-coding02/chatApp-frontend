import { useEffect, useState } from "react";

interface SplashScreenProps {
  onDone?: () => void;
}

const SplashScreen = ({ onDone }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"enter" | "pulse" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("pulse"), 600);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(() => onDone?.(), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #e8e0ff 50%, #f5f0ff 100%)",
        transition:
          phase === "exit" ? "opacity 0.6s ease, transform 0.6s ease" : "none",
        opacity: phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.04)" : "scale(1)",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Ambient background blobs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            top: "10%",
            left: "20%",
            animation: "blobFloat1 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
            bottom: "15%",
            right: "15%",
            animation: "blobFloat2 7s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
            top: "40%",
            right: "30%",
            animation: "blobFloat1 5s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo Container with ripple rings */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Ripple rings */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 96 + i * 40,
                height: 96 + i * 40,
                borderRadius: "50%",
                border: `${2 - i * 0.5}px solid rgba(99,102,241,${0.35 - i * 0.1})`,
                animation: `ripple 2s ease-out ${i * 0.4}s infinite`,
                opacity: phase === "enter" ? 0 : 1,
                transition: "opacity 0.4s",
              }}
            />
          ))}

          {/* Logo box */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 20px 60px rgba(99,102,241,0.45), 0 4px 20px rgba(0,0,0,0.12)",
              animation:
                phase === "enter"
                  ? "logoEnter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                  : phase === "pulse"
                    ? "logoPulse 2s ease-in-out infinite"
                    : "none",
              transform:
                phase === "enter"
                  ? "scale(0) rotate(-15deg)"
                  : "scale(1) rotate(0deg)",
            }}
          >
            {/* Chat icon SVG — white bubble, purple dots */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.477 2 2 6.145 2 11.259c0 2.207.872 4.225 2.306 5.79L3 21l4.3-1.398C8.67 20.175 10.285 20.518 12 20.518c5.523 0 10-4.145 10-9.259C22 6.145 17.523 2 12 2z"
                fill="white"
              />
              <circle
                cx="8.5"
                cy="11.5"
                r="1.2"
                fill="#7c3aed"
                style={{ animation: "dotPop 0.4s 0.8s ease-out both" }}
              />
              <circle
                cx="12"
                cy="11.5"
                r="1.2"
                fill="#7c3aed"
                style={{ animation: "dotPop 0.4s 1.0s ease-out both" }}
              />
              <circle
                cx="15.5"
                cy="11.5"
                r="1.2"
                fill="#7c3aed"
                style={{ animation: "dotPop 0.4s 1.2s ease-out both" }}
              />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "textRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-1.5px",
                color: "#1e1b4b",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              Chat
            </span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: "-1.5px",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}
            >
              Hub
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6b7280",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 500,
              fontFamily: "system-ui, sans-serif",
              animation:
                "textRise 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both",
              opacity: 0,
            }}
          >
            Connect · Share · Chat
          </p>
        </div>

        {/* Loading bar */}
        <div
          style={{
            width: 160,
            height: 3,
            background: "rgba(99,102,241,0.15)",
            borderRadius: 99,
            overflow: "hidden",
            animation: "textRise 0.4s ease 0.8s both",
            opacity: 0,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 99,
              background: "linear-gradient(90deg, #6366f1, #a855f7)",
              animation:
                "loadBar 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards",
              width: "0%",
            }}
          />
        </div>
      </div>

      {/* CSS keyframes via style tag */}
      <style>{`
        @keyframes logoEnter {
          from { transform: scale(0) rotate(-15deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg);  opacity: 1; }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 20px 60px rgba(99,102,241,0.45); }
          50%       { transform: scale(1.05); box-shadow: 0 24px 70px rgba(99,102,241,0.6); }
        }
        @keyframes ripple {
          0%   { transform: scale(0.85); opacity: 0.8; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        @keyframes textRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPop {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        @keyframes loadBar {
          0%   { width: 0%; }
          60%  { width: 75%; }
          100% { width: 100%; }
        }
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(20px, -30px) scale(1.05); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-25px, 20px) scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
