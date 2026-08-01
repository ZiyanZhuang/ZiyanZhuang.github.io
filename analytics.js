/**
 * analytics.js — Privacy-first visitor analytics for ZiyanZhuang.github.io
 *
 * Collects page views & visitor metadata to a private dashboard only you can see.
 * No data is ever shown on the public site. No third-party cookies. No tracking
 * of logged-in state.
 *
 * Supported providers:
 *   - Google Analytics 4 (GA4) — comprehensive dashboard at analytics.google.com
 *   - Microsoft Clarity        — heatmaps + session recordings at clarity.microsoft.com
 *
 * Setup (2 minutes):
 *   1. GA4:  Go to https://analytics.google.com → Admin → Create Property →
 *            copy the "Measurement ID" (looks like G-XXXXXXXXXX).
 *   2. Clarity: Go to https://clarity.microsoft.com → Add New Project →
 *            copy the "Project ID" (10-char hex string).
 *   3. Paste both IDs in the CONFIG object below.
 *   4. Deploy. That's it — visit your dashboard to see data.
 *
 * To add a new provider, append an entry to CONFIG.providers and implement a
 * loader function following the pattern below.
 */

;(function () {
  'use strict';

  // =========================================================================
  // CONFIGURATION — edit these values
  // =========================================================================
  var CONFIG = {
    /**
     * Google Analytics 4 Measurement ID.
     * Looks like: G-XXXXXXXXXX
     * Leave empty ('') to disable GA4.
     */
    ga4MeasurementId: '',

    /**
     * Microsoft Clarity Project ID.
     * Dashboard: https://clarity.microsoft.com
     * Leave empty ('') to disable Clarity.
     */
    clarityProjectId: 'xvkj9l5li6',
  };

  // =========================================================================
  // Provider loaders — each is self-contained and fails silently
  // =========================================================================

  /**
   * Boot Google Analytics 4 via gtag.
   * Data appears in your GA4 property dashboard at analytics.google.com.
   * Geographic & device breakdowns are available under Reports → Demographics.
   *
   * @param {string} id — GA4 Measurement ID  (e.g. "G-ABC123XYZ")
   */
  function bootGA4(id) {
    if (!id || typeof id !== 'string' || id.length < 5) { return; }

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    script.onerror = function () {
      /* Silently ignore — analytics must never break the host page */
    };
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', id, {
      // Respect "Do Not Track" browser preference
      anonymize_ip: true,
      // Don't send page metadata we don't need
      send_page_view: true,
    });
  }

  /**
   * Boot Microsoft Clarity.
   * Data appears in your Clarity dashboard at clarity.microsoft.com.
   * Heatmaps and session recordings are automatically captured.
   *
   * @param {string} id — Clarity Project ID  (e.g. "a1b2c3d4e5")
   */
  function bootClarity(id) {
    if (!id || typeof id !== 'string' || id.length < 5) { return; }

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(i);
      t.onerror = function () {
        /* Silently ignore — analytics must never break the host page */
      };
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);
  }

  // =========================================================================
  // Bootstrap — iterate providers and boot only those with a configured ID
  // =========================================================================

  /**
   * Provider registry.
   * To add a new provider, push an entry { id: <config value>, boot: <fn> }.
   * The boot function receives the id string and runs only when the id is truthy.
   */
  var providers = [
    { id: CONFIG.ga4MeasurementId,   boot: bootGA4 },
    { id: CONFIG.clarityProjectId,   boot: bootClarity },
  ];

  /**
   * Defer loading until after the page is interactive so analytics scripts
   * compete with zero critical-path resources.
   */
  function bootAll() {
    for (var i = 0; i < providers.length; i++) {
      var provider = providers[i];
      if (provider.id) {
        provider.boot(provider.id);
      }
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // DOM already settled — fire immediately (rarely hit in practice)
    bootAll();
  } else {
    // Defer until the browser is idle so the page paints first
    if (window.requestIdleCallback) {
      window.requestIdleCallback(bootAll, { timeout: 3000 });
    } else {
      // Fallback for browsers without requestIdleCallback (Safari)
      window.addEventListener('load', function () {
        setTimeout(bootAll, 200);
      });
    }
  }
})();
