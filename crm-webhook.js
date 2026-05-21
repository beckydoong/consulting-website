// Seedscale form bridge
// 1. Forwards every Web3Forms submission to the Seedscale CRM proxy
//    (which subscribes to the correct Klaviyo list server-side)
// 2. Lets the original Web3Forms POST continue (preserves email notification)
// 3. Replaces the form with an inline "thank you" message instead of redirecting
//
// Why we proxy through the CRM instead of calling Klaviyo directly from the browser:
//   Klaviyo's /client/subscriptions/ endpoint returns
//   access-control-allow-methods: OPTIONS only (no POST), so browser CORS blocks
//   direct calls. Server-to-server calls from the CRM Worker work fine.
(function () {
  var CRM_WEBHOOK = 'https://seedscale-crm.beckydoong.workers.dev/api/webhooks/web3forms';

  function showInlineThankYou(form) {
    var thankYou = document.createElement('div');
    thankYou.style.cssText = [
      'padding:1.5rem 1.25rem',
      'background:rgba(255,255,255,0.07)',
      'border:1px solid rgba(255,255,255,0.12)',
      'border-radius:12px',
      'text-align:center',
      'color:#fff',
      'font-family:inherit',
    ].join(';');
    thankYou.innerHTML =
      '<div style="width:48px;height:48px;border-radius:50%;background:#08A045;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
      '</div>' +
      '<h3 style="font-size:1.15rem;font-weight:700;margin:0 0 0.5rem;color:#fff;">Thank you!</h3>' +
      '<p style="font-size:0.95rem;color:rgba(255,255,255,0.85);margin:0;line-height:1.5;">' +
        'Check your inbox in a few seconds. ' +
        'Your guide is on the way from <strong>rebecca@seedscale.agency</strong>. ' +
        '<br/><span style="font-size:0.85rem;color:rgba(255,255,255,0.6);">If you don\'t see it, check your spam folder.</span>' +
      '</p>';
    form.parentNode.replaceChild(thankYou, form);
  }

  function forwardToCRM(form) {
    try {
      var formData = new FormData(form);
      var json = {};
      formData.forEach(function (value, key) {
        if (key === 'webhook' || key === 'redirect') return;
        json[key] = value;
      });
      // Fire-and-forget — don't block the user
      fetch(CRM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
        keepalive: true,
      }).catch(function () {});
    } catch (e) { /* ignore */ }
  }

  function submitToWeb3Forms(form) {
    var formData = new FormData(form);
    return fetch(form.action, {
      method: 'POST',
      body: formData,
    });
  }

  function attach() {
    document.querySelectorAll('form').forEach(function (form) {
      var action = form.getAttribute('action') || '';
      if (!action.includes('web3forms.com')) return;
      if (form.dataset.crmBridgeAttached === 'true') return;
      form.dataset.crmBridgeAttached = 'true';

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Disable the submit button while in flight
        var btn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (btn) {
          btn.disabled = true;
          if (btn.tagName === 'BUTTON') btn.textContent = 'Sending…';
        }

        // Fire both submissions in parallel
        forwardToCRM(form);
        submitToWeb3Forms(form)
          .then(function () { showInlineThankYou(form); })
          .catch(function () {
            // Even if web3forms request fails, CRM still has the contact
            showInlineThankYou(form);
          });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
