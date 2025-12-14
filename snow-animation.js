// ============================================================
// KONVO SNOW ANIMATION
// Version: 1.0
// ============================================================
'use strict';

function initKonvoSnowAnimation() {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, snow animation disabled');
    return;
  }

  const canvas = document.getElementById('snowCanvas');
  const title = document.getElementById('konvoTitle');
  
  if (!canvas || !title) {
    console.warn('Snow animation elements not found');
    return;
  }

  const ctx = canvas.getContext('2d');
  
  const updateCanvasSize = () => {
    const isMobile = window.innerWidth < 640;
    canvas.width = isMobile ? 120 : 200;
    canvas.height = isMobile ? 45 : 60;
  };
  
  updateCanvasSize();
  
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
  
  const drawTextMask = () => {
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fillStyle = '#ffffff';
    
    const isMobile = window.innerWidth < 640;
    const fontSize = isMobile ? 14 : 22;
    
    offscreenCtx.font = `bold ${fontSize}px Inter, sans-serif`;
    offscreenCtx.textAlign = 'center';
    offscreenCtx.textBaseline = 'middle';
    offscreenCtx.fillText('KONVO', offscreenCanvas.width / 2, offscreenCanvas.height / 2 + 2);
  };
  
  drawTextMask();
  
  const particles = [];
  const maxParticles = 150;
  const maxAccumulatedParticles = 500;
  
  function createParticle(index, fastForward = false) {
    const particle = {
      index: index,
      x: 0,
      y: 0,
      size: 0,
      drift: 0,
      speed: 0,
      opacity: 1,
      accumulated: false,
      timeline: null
    };
    
    particles.push(particle);
    
    particle.timeline = gsap.timeline({ 
      repeat: -1, 
      repeatRefresh: true,
      onRepeat: () => {
        particle.accumulated = false;
        particle.opacity = 1;
      }
    })
    .fromTo(
      particle,
      {
        x: () => Math.random() * canvas.width,
        y: -5,
        size: () => 0.5 + Math.random() * 2,
        drift: () => -30 + Math.random() * 60,
        speed: () => 0.3 + Math.random() * 0.7,
        opacity: 1
      },
      {
        y: canvas.height + 5,
        x: `+=${particle.drift}`,
        duration: 3,
        ease: 'none'
      }
    );
    
    if (fastForward) {
      particle.timeline.seek(Math.random() * 3);
    }
    
    particle.timeline.timeScale(particle.speed);
    
    return particle;
  }
  
  for (let i = 0; i < maxParticles; i++) {
    createParticle(i, true);
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle) => {
      if (!particle.timeline) return;
      
      if (particle.timeline.isActive() && !particle.accumulated) {
        const px = Math.floor(particle.x);
        const py = Math.floor(particle.y);
        
        if (px >= 0 && px < offscreenCanvas.width && py >= 0 && py < offscreenCanvas.height) {
          const imageData = offscreenCtx.getImageData(px, py, 1, 1);
          
          if (imageData.data[3] > 100 && Math.random() > 0.3) {
            particle.accumulated = true;
            particle.timeline.pause();
            
            gsap.to(particle, {
              opacity: 0,
              duration: 2 + Math.random() * 3,
              onComplete: () => {
                particle.timeline.resume();
                particle.opacity = 1;
                particle.accumulated = false;
              }
            });
            
            if (particles.length < maxAccumulatedParticles) {
              createParticle(particles.length, false);
            }
          }
        }
      }
      
      if (particle.opacity > 0) {
        ctx.beginPath();
        ctx.globalAlpha = particle.opacity * 0.8;
        ctx.fillStyle = '#ffffff';
        
        const sizeMultiplier = gsap.utils.interpolate(1, 0.3, particle.y / canvas.height);
        const drawSize = particle.size * sizeMultiplier;
        
        ctx.arc(particle.x, particle.y, drawSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }
  
  gsap.ticker.add(render);
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCanvasSize();
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      drawTextMask();
    }, 250);
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      gsap.ticker.remove(render);
    } else {
      gsap.ticker.add(render);
    }
  });
  
  console.log('Konvo snow animation initialized');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKonvoSnowAnimation);
} else {
  initKonvoSnowAnimation();
}