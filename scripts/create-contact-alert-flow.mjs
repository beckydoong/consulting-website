#!/usr/bin/env node
// Creates the "Contact Form → Internal Alert" flow in Klaviyo.
//
// The flow: whenever someone fires the "Submitted Contact Form" event
// (homepage + connect page contact forms), Klaviyo emails an internal
// alert to NOTIFY_EMAIL. Re-entry is enabled so EVERY submission alerts,
// not just each person's first.
//
// Usage:
//   KLAVIYO_PRIVATE_API_KEY=pk_xxx node scripts/create-contact-alert-flow.mjs
//
// Optional env vars:
//   NOTIFY_EMAIL   who receives the alert   (default: beckydoong@gmail.com)
//   FROM_EMAIL     alert "from" address     (default: rebecca@seedscale.agency)
//   METRIC_NAME    triggering event name    (default: Submitted Contact Form)
//
// Requires a Klaviyo private API key (Account → Settings → API keys) with
// `metrics:read` and `flows:write` scopes. Node 18+.
//
// After it runs: the flow is created in DRAFT. In Klaviyo, open the flow,
// accept the internal-alert opt-in email Klaviyo sends you, review, and
// set the flow (and the alert action) to Live.

const API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'beckydoong@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'rebecca@seedscale.agency';
const METRIC_NAME = process.env.METRIC_NAME || 'Submitted Contact Form';
const REVISION = process.env.KLAVIYO_REVISION || '2026-04-15';

if (!API_KEY) {
  console.error('Missing KLAVIYO_PRIVATE_API_KEY environment variable.');
  console.error('Create a private key with metrics:read + flows:write scopes at:');
  console.error('  Klaviyo → Account → Settings → API keys');
  process.exit(1);
}

const HEADERS = {
  Authorization: `Klaviyo-API-Key ${API_KEY}`,
  accept: 'application/vnd.api+json',
  'content-type': 'application/vnd.api+json',
  revision: REVISION,
};

async function findMetricId(name) {
  let url = 'https://a.klaviyo.com/api/metrics/';
  while (url) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`GET /api/metrics failed (${res.status}): ${await res.text()}`);
    const body = await res.json();
    const match = (body.data || []).find((m) => m.attributes?.name === name);
    if (match) return match.id;
    url = body.links?.next || null;
  }
  return null;
}

async function createFlow(metricId) {
  const payload = {
    data: {
      type: 'flow',
      attributes: {
        name: 'Contact Form → Internal Alert',
        definition: {
          triggers: [{ type: 'metric', id: metricId }],
          entry_action_id: 'alert-1',
          // duration 0 + alltime = re-entry allowed → alert on every submission
          reentry_criteria: { duration: 0, unit: 'alltime' },
          actions: [
            {
              temporary_id: 'alert-1',
              type: 'send-internal-alert',
              links: { next: null },
              data: {
                status: 'draft',
                message: {
                  name: 'Notify Rebecca — new contact form message',
                  from_email: FROM_EMAIL,
                  from_label: 'Seedscale Website',
                  to_emails: [NOTIFY_EMAIL],
                  subject_line: '📬 New contact form message on seedscale.agency',
                  template_id: null,
                },
              },
            },
          ],
        },
      },
    },
  };

  const res = await fetch('https://a.klaviyo.com/api/flows', {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`POST /api/flows failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

const metricId = await findMetricId(METRIC_NAME);
if (!metricId) {
  console.error(`Metric "${METRIC_NAME}" not found in this Klaviyo account.`);
  console.error('It is created the first time the event is received — submit the');
  console.error('live contact form once (after deploying the Klaviyo form changes),');
  console.error('then re-run this script.');
  process.exit(1);
}
console.log(`Found metric "${METRIC_NAME}" (id: ${metricId})`);

const flow = await createFlow(metricId);
console.log(`Created flow "${flow.data.attributes.name}" (id: ${flow.data.id}, status: ${flow.data.attributes.status})`);
console.log('');
console.log('Final steps in Klaviyo:');
console.log(`  1. Check ${NOTIFY_EMAIL} for Klaviyo's internal-alert opt-in email and accept it.`);
console.log('  2. Open Flows → "Contact Form → Internal Alert", review the alert step.');
console.log('  3. Set the alert action and the flow to Live.');
