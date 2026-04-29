// Seedscale CRM webhook bridge
// Listens for any Web3Forms form submission and forwards a copy to the CRM
// so contacts get auto-enrolled in welcome drip campaigns.
(function () {
  var CRM_WEBHOOK = 'https://seedscale-crm.beckydoong.workers.dev/api/webhooks/web3forms';

  function forwardToCRM(form) {
    try {
      var formData = new FormData(form);
      // Convert FormData to plain JSON object so the CRM can parse it as JSON
      var json = {};
      formData.forEach(function (value, key) {
        // Skip the webhook field itself if present
        if (key === 'webhook') return;
        json[key] = value;
      });

      // Fire-and-forget — don't block the user's form submission
      // Use keepalive so the request completes even if the page navigates
      fetch(CRM_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
        keepalive: true,
        mode: 'no-cors',
      }).catch(function (err) {
        console.warn('CRM webhook forward failed:', err);
      });
    } catch (e) {
      console.warn('CRM webhook bridge error:', e);
    }
  }

  function attach() {
    document.querySelectorAll('form').forEach(function (form) {
      var action = form.getAttribute('action') || '';
      if (!action.includes('web3forms.com')) return;
      if (form.dataset.crmBridgeAttached === 'true') return;
      form.dataset.crmBridgeAttached = 'true';

      form.addEventListener('submit', function () {
        forwardToCRM(form);
      });
    });
  }

  // Attach on load and on any DOM mutations (for dynamically inserted forms)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
