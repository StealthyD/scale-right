(function () {
  var KEY = 'sr-cookie-consent';
  var VERSION = 1;
  var GC_SRC = 'https://gc.zgo.at/count.js';
  var GC_ENDPOINT = 'https://scaleright.goatcounter.com/count';

  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data && data.version === VERSION && typeof data.analytics === 'boolean') return data;
    } catch (e) {}
    return null;
  }

  function writeConsent(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        version: VERSION,
        analytics: !!analytics,
        updated: new Date().toISOString()
      }));
    } catch (e) {}
  }

  function loadAnalytics() {
    if (document.getElementById('gc-script')) return;
    var s = document.createElement('script');
    s.id = 'gc-script';
    s.async = true;
    s.src = GC_SRC;
    s.setAttribute('data-goatcounter', GC_ENDPOINT);
    document.head.appendChild(s);
  }

  function unloadAnalytics() {
    var s = document.getElementById('gc-script');
    if (s) s.remove();
  }

  function applyConsent(analytics) {
    if (analytics) loadAnalytics();
    else unloadAnalytics();
  }

  function setBannerHeight() {
    var root = document.getElementById('sr-cookie');
    if (!root || root.hidden) {
      document.body.style.removeProperty('--sr-cookie-h');
      return;
    }
    document.body.style.setProperty('--sr-cookie-h', root.offsetHeight + 'px');
  }

  function showBanner(openPrefs) {
    var root = document.getElementById('sr-cookie');
    if (!root) return;
    root.hidden = false;
    document.body.classList.add('sr-cookie-open');
    var prefs = document.getElementById('sr-cookie-prefs');
    var toggle = root.querySelector('[data-action="prefs"]');
    var saved = readConsent();
    var box = document.getElementById('sr-cookie-analytics');
    if (box) box.checked = !!(saved && saved.analytics);
    if (prefs && toggle) {
      if (openPrefs) {
        prefs.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        prefs.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
    setBannerHeight();
  }

  function hideBanner() {
    var root = document.getElementById('sr-cookie');
    if (!root) return;
    root.hidden = true;
    document.body.classList.remove('sr-cookie-open');
    document.body.style.removeProperty('--sr-cookie-h');
  }

  function choose(analytics) {
    writeConsent(analytics);
    applyConsent(analytics);
    hideBanner();
  }

  function buildBanner() {
    if (document.getElementById('sr-cookie')) return;
    var root = document.createElement('div');
    root.id = 'sr-cookie';
    root.className = 'sr-cookie';
    root.hidden = true;
    root.innerHTML =
      '<div class="sr-cookie-inner" role="dialog" aria-modal="false" aria-labelledby="sr-cookie-title" aria-describedby="sr-cookie-desc">' +
        '<p class="sr-cookie-title" id="sr-cookie-title">Cookies and analytics</p>' +
        '<p class="sr-cookie-desc" id="sr-cookie-desc">We store your theme and cookie choices in your browser. If you accept, we also load GoatCounter, a privacy-friendly analytics tool that does not set cookies. You can change this later. Read our <a href="cookies.html">Cookie policy</a>.</p>' +
        '<div class="sr-cookie-actions">' +
          '<button type="button" class="sr-cookie-btn" data-action="accept">Accept all cookies</button>' +
          '<button type="button" class="sr-cookie-btn" data-action="reject">Reject non-essential cookies</button>' +
          '<button type="button" class="sr-cookie-link" data-action="prefs" aria-expanded="false" aria-controls="sr-cookie-prefs">Manage cookie settings</button>' +
        '</div>' +
        '<div class="sr-cookie-prefs" id="sr-cookie-prefs" hidden>' +
          '<fieldset>' +
            '<legend>Choose what we can use</legend>' +
            '<div class="sr-cookie-opt">' +
              '<label><input type="checkbox" checked disabled> Essential</label>' +
              '<p>Needed for the site to work. This includes your light or dark theme and this cookie choice. Always on.</p>' +
            '</div>' +
            '<div class="sr-cookie-opt">' +
              '<label><input type="checkbox" id="sr-cookie-analytics"> Analytics (GoatCounter)</label>' +
              '<p>Counts visits in aggregate (pages, referrers, browser, country). GoatCounter does not set cookies. Loaded only if you allow it.</p>' +
            '</div>' +
          '</fieldset>' +
          '<button type="button" class="sr-cookie-btn" data-action="save">Save my choices</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn || !root.contains(btn)) return;
      var action = btn.getAttribute('data-action');
      if (action === 'accept') choose(true);
      else if (action === 'reject') choose(false);
      else if (action === 'save') {
        var box = document.getElementById('sr-cookie-analytics');
        choose(!!(box && box.checked));
      } else if (action === 'prefs') {
        var prefs = document.getElementById('sr-cookie-prefs');
        var open = prefs.hidden;
        prefs.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          var box = document.getElementById('sr-cookie-analytics');
          if (box) box.focus();
        }
        setBannerHeight();
      }
    });

    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var prefs = document.getElementById('sr-cookie-prefs');
      var toggle = root.querySelector('[data-action="prefs"]');
      if (prefs && !prefs.hidden) {
        prefs.hidden = true;
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.focus();
        }
        setBannerHeight();
      }
    });

    window.addEventListener('resize', setBannerHeight);
  }

  function bindSettings() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('#sr-cookie-settings');
      if (!t) return;
      e.preventDefault();
      showBanner(true);
      var box = document.getElementById('sr-cookie-analytics');
      if (box) box.focus();
    });
  }

  function init() {
    buildBanner();
    bindSettings();
    var saved = readConsent();
    if (!saved) {
      showBanner(false);
      return;
    }
    applyConsent(saved.analytics);
    hideBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
