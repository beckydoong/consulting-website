// Seedscale form bridge
// 1. Subscribes every Web3Forms submission to the correct Klaviyo list
// 2. Lets the original Web3Forms POST continue (preserves email notification)
// 3. Replaces the form with an inline "thank you" message instead of redirecting
(function () {
  // Klaviyo public API key (account id) — safe to expose client-side
  var KLAVIYO_COMPANY_ID = 'TipqN2';

  // Maps Web3Forms access_key → Klaviyo list ID
  // (each list has a Live flow that auto-enrolls new subscribers)
  var ACCESS_KEY_TO_LIST = {
    '61c52105-cc39-4b02-a45f-8481b8d1f3b8': 'QZnsL7', // 7 Prompts → 7 Prompts Subscribers
    'fcd69f57-99cf-4b2f-88a9-688d2ef53a58': 'TjASvt', // Playbook  → Playbook Subscribers
    '7e064b64-247c-457d-8d17-0412ec87a48b': 'TDhpPe', // Contact   → Contact Form Inquiries
  };

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

  function subscribeToKlaviyo(form) {
    try {
      var formData = new FormData(form);
      var accessKey = formData.get('access_key') || '';
      var listId = ACCESS_KEY_TO_LIST[accessKey];
      if (!listId) return; // Unknown form — skip Klaviyo, let Web3Forms handle it

      var email = formData.get('email') || formData.get('Email') || '';
      if (!email) return;

      var firstName = formData.get('name') || formData.get('Name') || '';
      // Split on first space to get first name only (matches Resend behavior)
      var firstNameOnly = firstName.trim().split(/\s+/)[0] || '';

      var organization = formData.get('organization') || formData.get('Organization') || '';
      var message = formData.get('message') || formData.get('Message') || '';
      var interest = formData.get('interest') || '';

      // Note: Klaviyo's /client/subscriptions/ endpoint implies SUBSCRIBED consent
      // by virtue of being called; don't pass a 'subscriptions' field on the profile
      // (Klaviyo rejects it as invalid).
      var payload = {
        data: {
          type: 'subscription',
          attributes: {
            custom_source: 'Seedscale website form',
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  first_name: firstNameOnly,
                  properties: {
                    full_name: firstName,
                    organization: organization || null,
                    last_form_message: message || null,
                    last_form_interest: interest || null,
                    last_form_source: accessKey,
                  },
                },
              },
            },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      };

      // Fire-and-forget — don't block the user
      fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + encodeURIComponent(KLAVIYO_COMPANY_ID), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-10-15',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(function () { /* ignore — Web3Forms still captured it */ });
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
        subscribeToKlaviyo(form);
        submitToWeb3Forms(form)
          .then(function () { showInlineThankYou(form); })
          .catch(function () {
            // Even if web3forms request fails, Klaviyo still has the subscriber
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
