"use client";

import React, { useEffect, useRef } from "react";

/**
 * Interface representing a single canvas particle node.
 */
interface Particle {
  x: number;
  y: number;
  homeX?: number; // Target x coordinate where the particle returns when not influenced by cursor
  homeY?: number; // Target y coordinate where the particle returns when not influenced by cursor
  vx: number;     // Speed component on X axis
  vy: number;     // Speed component on Y axis
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  speedMultiplier: number;
  isRing?: boolean;   // True if the particle is an expanding hover ripple ring
  isSpark?: boolean;  // True if the particle is a temporary spark trailing from the cursor
  maxSize?: number;
}

/**
 * Interactive canvas background animation.
 * Renders floating fluid dots that:
 * 1. Drift slowly on their own.
 * 2. Push away fluidly when the user moves the mouse nearby.
 * 3. Emit expanding rings and sparks on cursor movement and clicks.
 * 4. Experience a parallax vertical shift during window scrolling.
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = 180;
    const colors = ["#54ACBF", "#A7EBF2", "#26658C"];

    // Helper helper to generate individual particles
    const createParticle = (x: number, y: number, isRipple = false): Particle => {
      const size = Math.random() * 2 + 1; // 1px to 3px diameter
      const color = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = Math.random() * 0.3 + 0.15; // 0.15 to 0.45 opacity
      const angle = Math.random() * Math.PI * 2;
      const speed = isRipple ? Math.random() * 2.0 + 0.8 : Math.random() * 0.9 + 0.5; // Sparks drift faster

      return {
        x,
        y,
        homeX: isRipple ? undefined : x,
        homeY: isRipple ? undefined : y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        color,
        alpha: baseAlpha,
        baseAlpha,
        speedMultiplier: Math.random() * 0.6 + 0.4,
        isSpark: isRipple,
      };
    };

    // Initialize seed particles scattered randomly across the viewport dimensions
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(
          createParticle(Math.random() * width, Math.random() * height)
        );
      }
    };

    initParticles();

    // Re-initialize particles on window resize to ensure full-screen coverage
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    let lastMouseX = -1000;
    let lastMouseY = -1000;

    // Track mouse position and inject ripple sparks when cursor moves
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      if (lastMouseX === -1000) {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }

      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Emit a cursor-movement ripple ring and sparks if cursor moved more than 15px
      if (dist > 15) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: 0,
          vy: 0,
          size: 2,
          maxSize: Math.random() * 20 + 15,
          isRing: true,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          baseAlpha: 0.8,
          speedMultiplier: 0
        });

        // Add 1-2 trailing spark particles floating away
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(createParticle(e.clientX, e.clientY, true));
        }

        // Cap maximum temporary particles in memory to prevent performance degradation
        if (particlesRef.current.length > 350) {
          particlesRef.current = particlesRef.current.slice(particlesRef.current.length - 350);
        }

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    // Emit click-burst ripple sparks
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      for (let i = 0; i < 20; i++) {
        particlesRef.current.push(createParticle(clickX, clickY, true));
      }
      if (particlesRef.current.length > 350) {
        particlesRef.current = particlesRef.current.slice(particlesRef.current.length - 350);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    let lastScrollY = window.scrollY;

    // Primary canvas draw/animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const mouse = mouseRef.current;

      // Draw in reverse order so we can splice dead elements safely without indexing skips
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // 1. Render expanding ripple rings
        if (p.isRing) {
          p.size += 0.9;      // Expand ring size
          p.alpha -= 0.018;   // Fade out ring

          if (p.alpha <= 0 || p.size >= (p.maxSize || 35)) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = p.size * 0.25;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.stroke();
          continue;
        }

        // 2. Render temporary cursor sparks
        if (p.isSpark) {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.97; // Apply friction
          p.vy *= 0.97;
          p.alpha -= 0.012; // Decay opacity

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          continue;
        }

        // 3. Render drifting calm background dots
        if (p.homeY !== undefined && p.homeX !== undefined) {
          // Slow continuous drift physics
          p.homeX += p.vx;
          p.homeY += p.vy;

          // Parallax effect: shift home positions opposite to scroll direction
          p.homeY += scrollDiff * 0.15 * p.speedMultiplier;

          // Wrap particles vertically
          if (p.homeY < -10) {
            p.homeY = height + 10;
            p.homeX = Math.random() * width;
            p.x = p.homeX;
            p.y = p.homeY;
          } else if (p.homeY > height + 10) {
            p.homeY = -10;
            p.homeX = Math.random() * width;
            p.x = p.homeX;
            p.y = p.homeY;
          }

          // Wrap particles horizontally
          if (p.homeX < -10) {
            p.homeX = width + 10;
            p.x = p.homeX;
          } else if (p.homeX > width + 10) {
            p.homeX = -10;
            p.x = p.homeX;
          }
        }

        // Calculate proximity of cursor to perform fluid repelling pushes
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushRadius = 150;

        if (dist < pushRadius) {
          const force = (pushRadius - dist) / pushRadius;
          const pushX = (dx / dist) * force * -4.5;
          const pushY = (dy / dist) * force * -4.5;
          p.x += pushX;
          p.y += pushY;
          p.alpha = Math.min(0.9, p.baseAlpha + force * 0.55); // Glow intensifies near cursor
        } else {
          // Spring back smoothly to calm home positions when cursor moves away
          if (p.homeX !== undefined && p.homeY !== undefined) {
            p.x += (p.homeX - p.x) * 0.08;
            p.y += (p.homeY - p.y) * 0.08;
          }
          p.alpha = p.alpha * 0.95 + p.baseAlpha * 0.05; // Decay back to base opacity
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1] bg-transparent"
    />
  );
}
