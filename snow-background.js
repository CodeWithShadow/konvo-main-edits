// ============================================================
// SNOW BACKGROUND - Canvas Snowfall Effect
// ============================================================
'use strict';

(function() {
  // State
  let isEnabled = false;
  let animationId = null;
  let snowflakes = [];

  // DOM Elements
  const snowBackground = document.getElementById('snowBackground');
  const canvas = document.getElementById('bgSnowCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  // Configuration
  const CONFIG = {
    snowflakeCount: 150,
    minSize: 1,
    maxSize: 4,
    minSpeed: 0.5,
    maxSpeed: 2,
    wind: 0.5
  };

  /**
   * Initialize canvas size
   */
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  /**
   * Create a snowflake
   * @returns {Object} Snowflake object
   */
  function createSnowflake() {
    return {
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight) - (canvas?.height || window.innerHeight),
      size: Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize,
      speed: Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed,
      opacity: Math.random() * 0.5 + 0.5,
      wobble: Math.random() * Math.PI * 2
    };
  }

  /**
   * Initialize snowflakes
   */
  function initSnowflakes() {
    snowflakes = [];
    for (let i = 0; i < CONFIG.snowflakeCount; i++) {
      const flake = createSnowflake();
      flake.y = Math.random() * (canvas?.height || window.innerHeight);
      snowflakes.push(flake);
    }
  }

  /**
   * Update snowflake positions
   */
  function updateSnowflakes() {
    const width = canvas?.width || window.innerWidth;
    const height = canvas?.height || window.innerHeight;

    snowflakes.forEach(flake => {
      flake.y += flake.speed;
      flake.x += Math.sin(flake.wobble) * CONFIG.wind;
      flake.wobble += 0.01;

      // Reset snowflake if it goes off screen
      if (flake.y > height) {
        flake.y = -flake.size;
        flake.x = Math.random() * width;
      }
      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;
    });
  }

  /**
   * Draw snowflakes on canvas
   */
  function drawSnowflakes() {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(flake => {
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      ctx.fill();
    });
  }

  /**
   * Animation loop
   */
  function animate() {
    if (!isEnabled) return;

    updateSnowflakes();
    drawSnowflakes();
    animationId = requestAnimationFrame(animate);
  }

  /**
   * Enable snow effect
   */
  function enableSnow() {
    if (isEnabled) return;

    isEnabled = true;

    if (snowBackground) {
      snowBackground.classList.remove('disabled');
    }

    resizeCanvas();
    initSnowflakes();
    animate();

    document.body.classList.add('snow-theme-enabled');
    console.log('Snow background enabled');
  }

  /**
   * Disable snow effect
   */
  function disableSnow() {
    if (!isEnabled) return;

    isEnabled = false;

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (snowBackground) {
      snowBackground.classList.add('disabled');
    }

    document.body.classList.remove('snow-theme-enabled');
    console.log('Snow background disabled');
  }

  /**
   * Toggle snow effect
   * @returns {boolean} New enabled state
   */
  function toggleSnow() {
    if (isEnabled) {
      disableSnow();
      return false;
    } else {
      enableSnow();
      return true;
    }
  }

  /**
   * Check if snow is enabled
   * @returns {boolean}
   */
  function isSnowEnabled() {
    return isEnabled;
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    if (isEnabled) {
      resizeCanvas();
    }
  });

  // Start with snow disabled
  if (snowBackground) {
    snowBackground.classList.add('disabled');
  }

  // Expose API globally
  window.SnowController = {
    enable: enableSnow,
    disable: disableSnow,
    toggle: toggleSnow,
    isEnabled: isSnowEnabled
  };

})();