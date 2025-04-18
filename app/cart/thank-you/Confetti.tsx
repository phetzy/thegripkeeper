"use client";
import { useEffect, useRef } from "react";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const confettiCount = 120;
    const confettiColors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#7DFF00"];
    const gravity = 0.3;
    const drag = 0.005;
    const terminalVelocity = 5;
    const confetti: any[] = [];

    function randomRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        x: randomRange(0, width),
        y: randomRange(-20, -height),
        w: randomRange(8, 16),
        h: randomRange(8, 16),
        r: randomRange(0, 2 * Math.PI),
        d: randomRange(1, 2),
        tilt: randomRange(-10, 10),
        tiltAngle: randomRange(0, Math.PI),
        tiltAngleIncremental: randomRange(0.05, 0.12),
        vx: randomRange(-2, 2),
        vy: randomRange(0.5, 2),
      });
    }

    function drawConfetti() {
      ctx.clearRect(0, 0, width, height);
      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncremental;
        c.x += c.vx;
        c.y += c.vy;
        c.vy = Math.min(c.vy + gravity * c.d, terminalVelocity);
        c.vx *= 1 - drag;
        c.tilt = Math.sin(c.tiltAngle) * 15;

        ctx.save();
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.ellipse(c.x + c.tilt, c.y, c.w, c.h, c.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();

        // Reset confetti to top
        if (c.y > height + 20) {
          c.x = randomRange(0, width);
          c.y = randomRange(-20, -height);
          c.vy = randomRange(0.5, 2);
        }
      });
      animationId = requestAnimationFrame(drawConfetti);
    }
    drawConfetti();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 50,
      }}
      aria-hidden="true"
    />
  );
}
