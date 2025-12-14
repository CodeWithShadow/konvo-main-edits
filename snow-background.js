// ============================================================
// KONVO FULL SCREEN SNOW BACKGROUND
// Version: 1.4 (Fixed)
// ============================================================

(function() {
  'use strict';
  
  console.log('Snow background script loaded');
  
  var canvas, ctx;
  var snowflakes = [];
  var isEnabled = true;
  var animationId = null;
  var SNOWFLAKE_COUNT = 150;
  
  function init() {
    console.log('Initializing snow background...');
    
    // Get or create elements
    var container = document.getElementById('snowBackground');
    canvas = document.getElementById('bgSnowCanvas');
    var toggleBtn = document.getElementById('themeToggleButton');
    
    // Create container if missing
    if (!container) {
      console.log('Creating snow container...');
      container = document.createElement('div');
      container.id = 'snowBackground';
      container.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:0;pointer-events:none;overflow:hidden;';
      document.body.insertBefore(container, document.body.firstChild);
    }
    
    // Create canvas if missing
    if (!canvas) {
      console.log('Creating canvas...');
      canvas = document.createElement('canvas');
      canvas.id = 'bgSnowCanvas';
      canvas.style.cssText = 'display:block;width:100%;height:100%;';
      container.appendChild(canvas);
    }
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Load saved preference
    var saved = localStorage.getItem('konvo-snow-theme');
    isEnabled = saved !== 'disabled';
    
    // Create snowflakes
    createSnowflakes();
    
    // Setup toggle button
    if (toggleBtn) {
      toggleBtn.onclick = function() {
        toggle();
      };
      updateButton(toggleBtn);
    }
    
    // Apply initial visibility
    updateVisibility();
    
    // Start animation if enabled
    if (isEnabled) {
      startAnimation();
    }
    
    // Pause when tab hidden
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        stopAnimation();
      } else if (isEnabled) {
        startAnimation();
      }
    });
    
    console.log('✅ Snow background initialized!');
  }
  
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createSnowflakes() {
    snowflakes = [];
    for (var i = 0; i < SNOWFLAKE_COUNT; i++) {
      snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 1 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
        wind: -0.5 + Math.random() * 1,
        opacity: 0.3 + Math.random() * 0.7
      });
    }
  }
  
  function animate() {
    if (!ctx || !canvas || !isEnabled) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (var i = 0; i < snowflakes.length; i++) {
      var s = snowflakes[i];
      
      // Move snowflake
      s.y += s.speed;
      s.x += s.wind;
      
      // Wrap around screen
      if (s.y > canvas.height + 10) {
        s.y = -10;
        s.x = Math.random() * canvas.width;
      }
      if (s.x > canvas.width + 10) s.x = -10;
      if (s.x < -10) s.x = canvas.width + 10;
      
      // Draw snowflake
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0.5, s.radius), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + s.opacity + ')';
      ctx.fill();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  function startAnimation() {
    if (animationId) return;
    isEnabled = true;
    animate();
  }
  
  function stopAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }
  
  function toggle() {
    isEnabled = !isEnabled;
    
    // Save preference
    localStorage.setItem('konvo-snow-theme', isEnabled ? 'enabled' : 'disabled');
    
    // Update UI
    updateVisibility();
    updateButton(document.getElementById('themeToggleButton'));
    
    if (isEnabled) {
      startAnimation();
    } else {
      stopAnimation();
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    console.log('Snow theme:', isEnabled ? 'ON' : 'OFF');
  }
  
  function updateVisibility() {
    var container = document.getElementById('snowBackground');
    
    if (isEnabled) {
      if (container) container.style.display = 'block';
      document.body.classList.add('snow-theme-enabled');
    } else {
      if (container) container.style.display = 'none';
      document.body.classList.remove('snow-theme-enabled');
    }
  }
  
  function updateButton(btn) {
    if (!btn) return;
    
    if (isEnabled) {
      btn.style.color = '#60a5fa';
      btn.classList.add('active');
      btn.title = 'Snow: ON (Click to disable)';
    } else {
      btn.style.color = '';
      btn.classList.remove('active');
      btn.title = 'Snow: OFF (Click to enable)';
    }
  }
  
  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Backup initialization
  window.addEventListener('load', function() {
    if (!canvas || !ctx) {
      init();
    }
  });
  
})();