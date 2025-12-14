// ============================================================
// THEME MANAGER - Unified Theme Control
// ============================================================
'use strict';

(function() {
  // Theme states
  const THEMES = Object.freeze({
    NONE: 'none',
    SNOW: 'snow',
    LIQUID: 'liquid'
  });

  // Current theme state
  let currentTheme = THEMES.NONE;

  // DOM Elements
  const themeToggleButton = document.getElementById('themeToggleButton');

  // Theme order for cycling
  const themeOrder = [THEMES.NONE, THEMES.SNOW, THEMES.LIQUID];

  /**
   * Create SVG icon for "Off" state (sun icon)
   * @returns {SVGElement}
   */
  function createOffIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "5");
    svg.appendChild(circle);

    const lines = [
      { x1: "12", y1: "1", x2: "12", y2: "3" },
      { x1: "12", y1: "21", x2: "12", y2: "23" },
      { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" },
      { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" },
      { x1: "1", y1: "12", x2: "3", y2: "12" },
      { x1: "21", y1: "12", x2: "23", y2: "12" },
      { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" },
      { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" }
    ];

    lines.forEach(attrs => {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      Object.entries(attrs).forEach(([key, value]) => line.setAttribute(key, value));
      svg.appendChild(line);
    });

    return svg;
  }

  /**
   * Create SVG icon for "Snow" state (snowflake icon)
   * @returns {SVGElement}
   */
  function createSnowIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const paths = [
      "M12 2v20",
      "M4.93 4.93l14.14 14.14",
      "M19.07 4.93L4.93 19.07",
      "M2 12h20",
      "M12 2l4 4-4 4",
      "M12 2l-4 4 4 4",
      "M12 22l4-4-4-4",
      "M12 22l-4-4 4-4"
    ];

    paths.forEach(d => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });

    return svg;
  }

  /**
   * Create SVG icon for "Liquid" state (water droplet icon)
   * @returns {SVGElement}
   */
  function createLiquidIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "18");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z");
    svg.appendChild(path);

    return svg;
  }

  /**
   * Update the theme toggle button appearance
   */
  function updateButtonAppearance() {
    if (!themeToggleButton) return;

    // Clear existing content
    themeToggleButton.innerHTML = '';

    // Remove all theme classes
    themeToggleButton.classList.remove('theme-off', 'theme-snow', 'theme-liquid');

    // Add appropriate icon and class based on current theme
    switch (currentTheme) {
      case THEMES.SNOW:
        themeToggleButton.appendChild(createSnowIcon());
        themeToggleButton.classList.add('theme-snow');
        themeToggleButton.title = 'Current: Snow Theme (Click for Liquid)';
        break;

      case THEMES.LIQUID:
        themeToggleButton.appendChild(createLiquidIcon());
        themeToggleButton.classList.add('theme-liquid');
        themeToggleButton.title = 'Current: Liquid Theme (Click for Off)';
        break;

      case THEMES.NONE:
      default:
        themeToggleButton.appendChild(createOffIcon());
        themeToggleButton.classList.add('theme-off');
        themeToggleButton.title = 'Current: No Theme (Click for Snow)';
        break;
    }
  }

  /**
   * Disable all themes
   */
  function disableAllThemes() {
    // Disable snow
    if (window.SnowController && typeof window.SnowController.disable === 'function') {
      window.SnowController.disable();
    }
    document.body.classList.remove('snow-theme-enabled');

    // Disable liquid
    if (window.LiquidBackgroundController && typeof window.LiquidBackgroundController.disable === 'function') {
      window.LiquidBackgroundController.disable();
    }
    document.body.classList.remove('liquid-theme-enabled');
  }

  /**
   * Apply a specific theme
   * @param {string} theme - Theme to apply
   */
  async function applyTheme(theme) {
    // First, disable all themes
    disableAllThemes();

    // Then enable the requested theme
    switch (theme) {
      case THEMES.SNOW:
        if (window.SnowController && typeof window.SnowController.enable === 'function') {
          window.SnowController.enable();
        }
        document.body.classList.add('snow-theme-enabled');
        break;

      case THEMES.LIQUID:
        if (window.LiquidBackgroundController) {
          await window.LiquidBackgroundController.enable();
        }
        document.body.classList.add('liquid-theme-enabled');
        break;

      case THEMES.NONE:
      default:
        // All themes already disabled
        break;
    }

    currentTheme = theme;
    updateButtonAppearance();
    saveThemePreference();
  }

  /**
   * Cycle to the next theme
   */
  async function cycleTheme() {
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    await applyTheme(nextTheme);
  }

  /**
   * Save theme preference to localStorage
   */
  function saveThemePreference() {
    try {
      localStorage.setItem('konvo-theme', currentTheme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  /**
   * Load theme preference from localStorage
   * @returns {string} - Saved theme or default
   */
  function loadThemePreference() {
    try {
      const saved = localStorage.getItem('konvo-theme');
      if (saved && Object.values(THEMES).includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not load theme preference:', e);
    }
    return THEMES.NONE;
  }

  /**
   * Initialize the theme manager
   */
  async function init() {
    // Load saved preference
    const savedTheme = loadThemePreference();

    // Apply the saved theme
    await applyTheme(savedTheme);

    // Setup button click handler
    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Add loading state
        themeToggleButton.disabled = true;
        themeToggleButton.classList.add('opacity-50');

        try {
          await cycleTheme();
        } catch (error) {
          console.error('Error cycling theme:', error);
        } finally {
          themeToggleButton.disabled = false;
          themeToggleButton.classList.remove('opacity-50');
        }
      });
    }

    console.log('Theme manager initialized with theme:', savedTheme);
  }

  // Check for reduced motion preference
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Skip theme initialization if user prefers reduced motion
      if (prefersReducedMotion()) {
        console.log('Reduced motion preferred, skipping animated themes');
        updateButtonAppearance();
        return;
      }
      init();
    });
  } else {
    if (prefersReducedMotion()) {
      console.log('Reduced motion preferred, skipping animated themes');
      updateButtonAppearance();
    } else {
      init();
    }
  }

  // Expose API globally
  window.ThemeManager = {
    THEMES,
    getCurrentTheme: () => currentTheme,
    setTheme: applyTheme,
    cycleTheme,
    disableAll: disableAllThemes
  };

})();