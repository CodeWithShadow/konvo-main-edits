// ============================================================
// LIQUID BACKGROUND - Three.js Liquid Effect
// ============================================================
'use strict';

(function() {
  // State
  let app = null;
  let isInitialized = false;
  let isEnabled = false;
  let initPromise = null;

  // DOM Elements
  const liquidBackground = document.getElementById('liquidBackground');
  const liquidCanvas = document.getElementById('liquidCanvas');

  /**
   * Initialize the liquid background
   * @returns {Promise<boolean>} - Whether initialization was successful
   */
  async function initLiquidBackground() {
    if (isInitialized) return true;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        // Dynamically import the liquid background module
        const { default: LiquidBackground } = await import(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.27/build/backgrounds/liquid1.min.js'
        );

        if (!liquidCanvas) {
          console.error('Liquid canvas not found');
          return false;
        }

        // Initialize the liquid background
        app = LiquidBackground(liquidCanvas);

        // Load the liquid texture
        await app.loadImage('https://assets.codepen.io/33787/liquid.webp');

        // Configure the liquid effect
        app.liquidPlane.material.metalness = 0.75;
        app.liquidPlane.material.roughness = 0.25;
        app.liquidPlane.uniforms.displacementScale.value = 5;
        app.setRain(false);

        isInitialized = true;
        console.log('Liquid background initialized');
        return true;

      } catch (error) {
        console.error('Failed to initialize liquid background:', error);
        return false;
      }
    })();

    return initPromise;
  }

  /**
   * Enable the liquid background
   */
  async function enableLiquid() {
    if (isEnabled) return;

    // Initialize if needed
    const success = await initLiquidBackground();
    if (!success) {
      console.error('Cannot enable liquid background - initialization failed');
      return;
    }

    if (liquidBackground) {
      liquidBackground.classList.remove('disabled');
    }

    // Resume rendering if the app has a resume method
    if (app && typeof app.resume === 'function') {
      app.resume();
    }

    // Add theme class to body
    document.body.classList.add('liquid-theme-enabled');

    isEnabled = true;
    console.log('Liquid background enabled');
  }

  /**
   * Disable the liquid background
   */
  function disableLiquid() {
    if (!isEnabled) return;

    if (liquidBackground) {
      liquidBackground.classList.add('disabled');
    }

    // Pause rendering if the app has a pause method
    if (app && typeof app.pause === 'function') {
      app.pause();
    }

    // Remove theme class from body
    document.body.classList.remove('liquid-theme-enabled');

    isEnabled = false;
    console.log('Liquid background disabled');
  }

  /**
   * Toggle the liquid background
   * @returns {boolean} - New enabled state
   */
  async function toggleLiquid() {
    if (isEnabled) {
      disableLiquid();
      return false;
    } else {
      await enableLiquid();
      return true;
    }
  }

  /**
   * Check if liquid background is enabled
   * @returns {boolean}
   */
  function isLiquidEnabled() {
    return isEnabled;
  }

  /**
   * Check if liquid background is initialized
   * @returns {boolean}
   */
  function isLiquidInitialized() {
    return isInitialized;
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (app && typeof app.resize === 'function') {
      app.resize();
    }
  }

  // Listen for resize events
  window.addEventListener('resize', handleResize);

  // Expose API globally
  window.LiquidBackgroundController = {
    init: initLiquidBackground,
    enable: enableLiquid,
    disable: disableLiquid,
    toggle: toggleLiquid,
    isEnabled: isLiquidEnabled,
    isInitialized: isLiquidInitialized
  };

})();