# AI Starter Kit Check-in Campaign — Segment + Copy

> Rev 3, 2026-07-05. Rev 2 → 3: copy no longer assumes everyone got the
> AI Starter Kit (the June-email list includes contacts from other lead
> magnets/forms); send scheduled for **Mon July 6, 9:00 a.m. PT**, test
> to Becky first. Rev 1 → 2: pure check-in copy + overlap analysis.
> Klaviyo connector still needs re-auth, so list names/counts below are
> from the 2026-07-04 data pull.

## Overlap: why one campaign can't double-send

Klaviyo deduplicates recipients **within a single campaign**. Whether the
audience is one segment built with OR conditions or several lists/segments
selected together on the campaign, each profile receives exactly one email
per campaign — overlap between the lists cannot cause a duplicate.

So the real double-send risk is **across campaigns**, and there is a
confirmed case: prompt pack buyer meriyenparra.gf@gmail.com also received
the AI Starter Kit welcome flow (emails on Jun 24–29), so she is in BOTH
this campaign's audience AND the planned prompt-pack check-in. Two
"how's it going" emails in the same week reads as spam.

**Recommendation:** exclude segment **Bought Prompt Pack** (`WPKXF4`,
3 profiles; the 4th buyer is a seed profile) from this campaign, and send
those folks their tailored prompt-pack check-in on July 8–9. Alternative:
skip the separate prompt-pack campaign entirely and let this check-in
cover them — then no exclusion needed.

**Unverifiable until Klaviyo reconnects:** whether the June-campaign list
(`Scc69p`) and the AI Starter Kit signup list are the same list or two
different ones. Either way the OR-segment handles it — if they're the
same, one condition is redundant but harmless.

## Segment to create (Audience → Lists & Segments → Create Segment)

**Name:** `Starter Kit Check-in — July 2026`

**Definition — OR between condition groups:**

1. Is in list → *[the AI Starter Kit signup list — open flow "AI Starter
   Kit Welcome Series" (`WzPn4m`) and check its trigger for the exact
   name]*
2. Is in list → *[the list the June 24 campaign "The ChatGPT prompts you
   requested" was sent to (`Scc69p`) — open that campaign → Recipients]*
3. Is in segment → **7 Prompts — Correction cohort** (`WYvYAB`)

**AND NOT** (recommended, see overlap note): Is in segment → **Bought
Prompt Pack** (`WPKXF4`)

Suppressed/unsubscribed profiles are dropped automatically.

**Campaign settings:**
- From: rebecca@seedscale.agency (Rebecca at Seedscale)
- **Smart Sending: OFF** — otherwise anyone who got a flow email in the
  last 16 hours is silently skipped, and the welcome series sends daily.
- Simple text-style template, minimal design.
- **Schedule: Monday July 6, 2026, 9:00 a.m. PT** — after test approval.
- **Test send to beckydoong@gmail.com before scheduling.** The connector
  has no test-send endpoint, so the test is the "Send test" button in the
  Klaviyo campaign editor once the draft is staged.

## Email copy (pure check-in)

**Subject:** Quick check-in — did you actually use it?

**Preview text:** Whatever you grabbed from me — one question, 30 seconds.

---

Hi {{ first_name|default:"there" }},

You're getting this because somewhere along the way you grabbed one of my
free AI resources — for most of you that's the AI Starter Kit (the seven
prompts), for others a playbook or guide. (And a few of you got the wrong
file entirely during an email mixup on my end — sorry again about that.)

Whichever it was, I realized I never actually asked:

**Did you put it to use?**

- If yes — what happened? What worked, what flopped?
- If no — what's in the way? ("It's sitting in a tab" is a perfectly
  acceptable answer. That tab is a busy place.)

**Hit reply and tell me — even one line.** I read every response myself,
and it directly shapes what I build next.

And if you've worked through it and you're at the "okay, this works —
what's next?" stage: that's usually the moment a focused 1:1 makes
sense. We look at what you're doing, find the highest-leverage next move,
and you leave with a plan.

**[Grab a time here →](https://seedscale.agency/book.html?utm_source=klaviyo&utm_medium=email&utm_campaign=starter-kit-checkin)**

Good to hear from you either way.

— Rebecca

P.S. Never got the AI Starter Kit — or suspect you were one of the folks
who got the wrong file back in the day? The current version is here:
**[The AI Starter Kit →](https://seedscale.agency/starter-kit.html?utm_source=klaviyo&utm_medium=email&utm_campaign=starter-kit-checkin)**
It's the seven prompts I'd start with.

---

## Copy rationale

- Check-in first: the majority already have the kit, so the download link
  lives in a P.S. that only matters to the minority who never got it or
  got the wrong file — without making the email about the mixup.
- No "you haven't heard from me" claim — people mid-flow got emails on
  July 3–4 and completers finished days ago; "I never actually asked" is
  true for everyone.
- Reply-CTA first, booking-CTA second — consistent with the prompt-pack
  check-in drafts.

## Still pending (needs Klaviyo re-authorized)

1. Verify the two list names/IDs, confirm whether they're the same list,
   and pull the built segment's count.
2. Create this campaign + template in draft via the API.
3. Prompt pack check-in campaign — July 8–9, to the "got Email #1, then
   silence" pair (or fold into this send; Becky's call).
