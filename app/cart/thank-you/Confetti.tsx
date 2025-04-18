"use client";
import { useEffect, useRef } from "react";

import { useState } from "react";

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [visible, setVisible] = useState(true);
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
        w: randomRange(4, 12), // thinner for rectangles
        h: randomRange(12, 28), // longer for rectangles
        angle: randomRange(0, 2 * Math.PI),
        d: randomRange(1, 2),
        tilt: randomRange(-10, 10),
        tiltAngle: randomRange(0, Math.PI),
        tiltAngleIncremental: randomRange(0.05, 0.12),
        vx: randomRange(-2, 2),
        vy: randomRange(0.5, 2),
      });
    }

    let startTime = Date.now();
    let alpha = 1;
    let fadeStarted = false;

    function drawConfetti() {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();
      // Start fading after 1.5s
      if (now - startTime > 1500 && !fadeStarted) {
        fadeStarted = true;
      }
      if (fadeStarted) {
        alpha -= 0.05;
        if (alpha <= 0) {
          setVisible(false);
          return;
        }
        ctx.globalAlpha = Math.max(alpha, 0);
      } else {
        ctx.globalAlpha = 1;
      }
      confetti.forEach((c) => {
        c.tiltAngle += c.tiltAngleIncremental;
        c.x += c.vx;
        c.y += c.vy;
        c.vy = Math.min(c.vy + gravity * c.d, terminalVelocity);
        c.vx *= 1 - drag;
        c.tilt = Math.sin(c.tiltAngle) * 15;
        ctx.save();
        ctx.fillStyle = c.color;
        ctx.translate(c.x + c.tilt, c.y);
        ctx.rotate(c.angle);
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
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

  if (!visible) return null;
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
        transition: "opacity 0.5s"
      }}
      aria-hidden="true"
    />
  );
}
