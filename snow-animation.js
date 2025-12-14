// ============================================================
// KONVO SNOW ANIMATION (Logo)
// Version: 1.3 (Fixed negative radius)
// ============================================================
'use strict';

function initKonvoSnowAnimation() {
  console.log('Initializing KONVO logo snow...');
  
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  var canvas = document.getElementById('snowCanvas');
  var title = document.getElementById('konvoTitle');
  
  if (!canvas || !title) {
    console.warn('Logo elements not found');
    return;
  }

  var ctx = canvas.getContext('2d');
  
  function updateSize() {
    var isMobile = window.innerWidth < 640;
    canvas.width = isMobile ? 120 : 200;
    canvas.height = isMobile ? 45 : 60;
  }
  
  updateSize();
  
  // Offscreen canvas for text collision
  var offscreen = document.createElement('canvas');
  offscreen.width = canvas.width;
  offscreen.height = canvas.height;
  var offCtx = offscreen.getContext('2d', { willReadFrequently: true });
  
  function drawText() {
    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
    offCtx.fillStyle = '#fff';
    var fontSize = window.innerWidth < 640 ? 14 : 22;
    offCtx.font = 'bold ' + fontSize + 'px Inter, sans-serif';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText('KONVO', offscreen.width / 2, offscreen.height / 2 + 2);
  }
  
  drawText();
  
  // Particles
  var particles = [];
  var maxParticles = 80;
  
  function createParticle(randomY) {
    particles.push({
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : -5,
      size: 0.5 + Math.random() * 1.5,
      speedY: 0.2 + Math.random() * 0.5,
      speedX: -0.2 + Math.random() * 0.4,
      opacity: 0.5 + Math.random() * 0.5,
      stuck: false,
      fade: false
    });
  }
  
  // Create initial particles
  for (var i = 0; i < maxParticles; i++) {
    createParticle(true);
  }
  
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      
      // Skip dead particles
      if (p.opacity <= 0) {
        p.x = Math.random() * canvas.width;
        p.y = -5;
        p.opacity = 0.5 + Math.random() * 0.5;
        p.stuck = false;
        p.fade = false;
        continue;
      }
      
      // Move if not stuck
      if (!p.stuck) {
        p.y += p.speedY;
        p.x += p.speedX;
        
        // Check collision with text
        var px = Math.floor(p.x);
        var py = Math.floor(p.y);
        
        if (px >= 0 && px < offscreen.width && py >= 0 && py < offscreen.height) {
          try {
            var data = offCtx.getImageData(px, py, 1, 1);
            if (data.data[3] > 100 && Math.random() > 0.5) {
              p.stuck = true;
              p.fade = true;
            }
          } catch (e) {}
        }
        
        // Reset if out of bounds
        if (p.y > canvas.height + 5) {
          p.x = Math.random() * canvas.width;
          p.y = -5;
        }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
      }
      
      // Fade out stuck particles
      if (p.fade) {
        p.opacity -= 0.008;
        if (p.opacity <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = -5;
          p.opacity = 0.5 + Math.random() * 0.5;
          p.stuck = false;
          p.fade = false;
        }
      }
      
      // Draw - ALWAYS ensure positive radius
      var drawSize = Math.max(0.3, p.size);
      var drawOpacity = Math.max(0, Math.min(1, p.opacity));
      
      ctx.beginPath();
      ctx.globalAlpha = drawOpacity;
      ctx.fillStyle = '#ffffff';
      ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }
  
  // Use GSAP ticker
  gsap.ticker.add(render);
  
  // Handle resize
  window.addEventListener('resize', function() {
    updateSize();
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    drawText();
  });
  
  // Pause when hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      gsap.ticker.remove(render);
    } else {
      gsap.ticker.add(render);
    }
  });
  
  console.log('✅ KONVO logo snow initialized!');
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKonvoSnowAnimation);
} else {
  initKonvoSnowAnimation();
}