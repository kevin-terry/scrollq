/**
 * ScrollQ
 * Lightweight scroll-triggered animations using Intersection Observer API
 *
 * @example Basic usage
 * <div data-q="fade-up">Content</div>
 *
 * @example Global configuration
 * initScrollQ({
 *   threshold: 0.5,
 *   reverse: false,
 *   duration: '0.6s',
 *   easing: 'ease-out',
 *   fromY: '7rem',
 *   fromX: '7rem'
 * });
 *
 * Available Animations:
 *   fade, fade-up, fade-down, fade-left, fade-right
 *   slide-up, slide-down, slide-left, slide-right
 *   scale
 *
 * Element Attributes:
 *   data-q-threshold="0.5"      Visibility % to trigger (0-1)
 *   data-q-reverse              Reverse on scroll up
 *   data-q-duration="0.6s"      Animation duration
 *   data-q-easing="ease-out"    Timing function
 *   data-q-delay="100"          Delay in milliseconds
 *   data-q-offset="-50%"        Trigger offset (%, px, vh, rem)
 *   data-q-from="5rem"          Animation distance
 *
 * @param {Object} config - Global configuration
 * @param {number} config.threshold - Default threshold (0-1)
 * @param {string} config.rootMargin - Default rootMargin
 * @param {boolean} config.reverse - Default reverse behavior
 * @param {string} config.selector - Element selector
 * @param {string} config.duration - Default animation duration (e.g., '0.6s')
 * @param {string} config.easing - Default timing function (e.g., 'ease-out')
 * @param {string} config.fromY - Default vertical distance (e.g., '7rem')
 * @param {string} config.fromX - Default horizontal distance (e.g., '7rem')
 * @returns {Function} Cleanup function
 */

// Global state
const observers = new Map();
let scrollDirection = "down";
let lastScrollY = window.scrollY;
let isScrollListenerAttached = false;

/**
 * Initialize scroll direction tracking (once per page)
 */
const initScrollTracking = () => {
  if (isScrollListenerAttached) return;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? "down" : "up";
      lastScrollY = currentScrollY;
    },
    { passive: true }
  );

  isScrollListenerAttached = true;
};

export const initScrollQ = (config = {}) => {
  const DEFAULT_THRESHOLD = config.threshold ?? 0.5;
  const DEFAULT_ROOT_MARGIN = config.rootMargin ?? "0px 0px -10% 0px";
  const DEFAULT_REVERSE = config.reverse ?? false;
  const SELECTOR = config.selector ?? "[data-q]";

  initScrollTracking();

  // Apply global CSS custom properties if provided
  if (config.duration) document.documentElement.style.setProperty("--q-duration", config.duration);
  if (config.easing) document.documentElement.style.setProperty("--q-easing", config.easing);
  if (config.fromY) document.documentElement.style.setProperty("--q-from-y", config.fromY);
  if (config.fromX) document.documentElement.style.setProperty("--q-from-x", config.fromX);

  // Enable transitions after initial state is set
  requestAnimationFrame(() => {
    document.body.classList.add("q-ready");
  });

  const observerCache = new Map();

  /**
   * Create or retrieve cached observer for given settings
   */
  const getOrCreateObserver = (threshold, rootMargin, reverse) => {
    const key = `${threshold}-${rootMargin}-${reverse}`;
    if (observerCache.has(key)) return observerCache.get(key);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          const isActive = element.classList.contains("q-active");
          const isIntersecting = entry.isIntersecting && entry.intersectionRatio >= threshold;

          // Check if this is the initial observation (element hasn't been processed yet)
          const isInitialCheck = !element.hasAttribute("data-q-observed");

          if (isIntersecting && !isActive) {
            // Activate on initial check OR when scrolling down
            if (isInitialCheck || !reverse || scrollDirection === "down") {
              element.classList.add("q-active");
              element.setAttribute("data-q-observed", "true");
              if (!reverse) observer.unobserve(element);
            }
          } else if (!isIntersecting && isActive && reverse && scrollDirection === "up") {
            // Deactivate: not intersecting, scrolling up, reverse enabled
            element.classList.remove("q-active");
          } else if (isInitialCheck) {
            // Element not intersecting on first check
            // If element is above viewport (already scrolled past), activate it
            const rect = entry.boundingClientRect;
            if (rect.bottom < 0) {
              element.classList.add("q-active");
            }
            // Mark as observed
            element.setAttribute("data-q-observed", "true");
          }
        });
      },
      { threshold, rootMargin }
    );

    observerCache.set(key, observer);
    observers.set(key, observer);
    return observer;
  };

  document.querySelectorAll(SELECTOR).forEach((el) => {
    const animType = el.getAttribute("data-q") || "";

    // Parse threshold
    const thresholdAttr = el.getAttribute("data-q-threshold");
    const threshold =
      thresholdAttr !== null && thresholdAttr !== ""
        ? Math.min(Math.max(parseFloat(thresholdAttr) || 0, 0), 1)
        : DEFAULT_THRESHOLD;

    // Parse reverse (boolean attribute or explicit "true"/"false")
    const reverseAttr = el.getAttribute("data-q-reverse");
    const reverse = el.hasAttribute("data-q-reverse") ? reverseAttr !== "false" : DEFAULT_REVERSE;

    // Parse rootMargin offset
    let rootMargin = DEFAULT_ROOT_MARGIN;
    const offsetAttr = el.getAttribute("data-q-offset");
    if (offsetAttr) {
      const value = offsetAttr.match(/[a-z%]+$/i) ? offsetAttr : `${offsetAttr}px`;
      rootMargin = `0px 0px ${value} 0px`;
    }

    // Apply custom animation distance
    const from = el.getAttribute("data-q-from");
    if (from) {
      if (animType.includes("up") || animType.includes("down")) {
        el.style.setProperty("--q-from-y", from);
      } else if (animType.includes("left") || animType.includes("right")) {
        el.style.setProperty("--q-from-x", from);
      }
    }

    // Apply custom timing properties
    const duration = el.getAttribute("data-q-duration");
    const easing = el.getAttribute("data-q-easing");
    const delay = el.getAttribute("data-q-delay");

    if (duration) el.style.setProperty("--q-duration", duration);
    if (easing) el.style.setProperty("--q-easing", easing);
    if (delay) el.style.setProperty("--q-delay", `${delay}ms`);

    // Observe element
    const observer = getOrCreateObserver(threshold, rootMargin, reverse);
    observer.observe(el);
  });

  return () => {
    observerCache.forEach((observer) => observer.disconnect());
    observerCache.clear();
  };
};

/**
 * Cleanup all observers (useful for SPAs)
 */
export const destroyScrollQ = () => {
  observers.forEach((observer) => observer.disconnect());
  observers.clear();
};
