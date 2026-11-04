// The intro's pre-paint switch (components/motion/IntroLoader.tsx). Kept out of
// the client component so the server layout can inline the script string.
export const INTRO_STORAGE_KEY = "sv-intro";

/**
 * Runs in <head> before first paint: decides whether the intro plays (home
 * page, first visit this session, no reduced motion, not a crawler) and
 * releases the page after 4s whatever happens.
 */
export const INTRO_SCRIPT = `(function(){try{var d=document.documentElement;if(location.pathname!=="/")return;if(sessionStorage.getItem("${INTRO_STORAGE_KEY}"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(/bot|crawl|spider|slurp|lighthouse|HeadlessChrome/i.test(navigator.userAgent))return;d.dataset.intro="run";setTimeout(function(){if(d.dataset.intro!=="done")d.dataset.intro="done"},4000)}catch(e){}})();`;
