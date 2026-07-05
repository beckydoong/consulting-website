# AI Starter Kit Reset Campaign — Segment + Copy (send July 5, 2026)

> Prepared 2026-07-04/05. Klaviyo connector was disconnected at prep time,
> so this is click-ready for the Klaviyo UI. Becky's decisions baked in:
> audience = all AI Starter Kit ("7 prompts") signups + the list the June
> correction email went to; **no exclusions**; inclusive language.

## Segment to create (Audience → Lists & Segments → Create Segment)

**Name:** `Starter Kit Reset — July 2026`

**Definition — OR between all condition groups:**

1. Is in list → *[the AI Starter Kit signup list — the list that triggers
   the "AI Starter Kit Welcome Series" flow (`WzPn4m`). Open that flow and
   check its trigger to get the exact list name.]*
2. Is in list → *[the list your June 24 campaign "The ChatGPT prompts you
   requested" was sent to (internal group ID `Scc69p`). Open that campaign
   → Recipients to see its name.]*
3. Is in segment → **7 Prompts — Correction cohort** (`WYvYAB`) — safety
   net so nobody from the broken-flow cohort slips through if they're not
   on either list anymore.

Klaviyo automatically drops suppressed/unsubscribed profiles, so the
correction-cohort condition won't resurrect anyone who opted out.

**Campaign settings:**
- From: rebecca@seedscale.agency (Rebecca at Seedscale)
- **Smart Sending: OFF** for this campaign — you said truly everyone, and
  Smart Sending would silently skip anyone who got a flow email in the
  last 16 hours (the new welcome series is actively sending daily).
- Template: simple text-style personal note, minimal design.

**Overlap note:** with no exclusions, the two prompt pack customers
(Meriyen, r.craddocktaylor) will get this email too. Hold the separate
prompt-pack check-in campaign until ~July 8–9 so they don't get two
"how's it going" notes in one morning.

**Timing:** July 5 is the Sunday of July 4th weekend (US). If you want
max opens, Tuesday July 7 ~10am beats Sunday. But a decent chunk of the
list looks international, and Sunday inboxes are quiet — sending as
planned is fine.

## Email copy

**Subject:** One link, one apology, one question

**Preview text:** Wherever you are with the AI Starter Kit, this catches you up in 60 seconds.

---

Hi {{ first_name|default:"there" }},

Quick reset, because I know people on this list are in very different
places with the AI Starter Kit (the "7 prompts"):

- Some of you just finished the new email series — thank you for reading.
- Some of you signed up a while back and got the **wrong download**. That
  was a wiring mixup on my end, and I'm sorry about it.
- And some of you signed up and then… heard almost nothing. Also on me.

Whichever one you are, here's the one link that makes it all right — the
current AI Starter Kit, all seven prompts, latest version:

**[Get the AI Starter Kit →](https://seedscale.agency/starter-kit.html?utm_source=klaviyo&utm_medium=email&utm_campaign=starter-kit-reset)**

Now the question I actually wrote this email to ask:

**Have you run any of the prompts yet?**

- If yes — what happened? What worked, what flopped?
- If no — what's in the way? ("It's sitting in a tab" is a perfectly
  acceptable answer. That tab is a busy place.)

**Just hit reply and tell me — even one line.** I read every response
myself, and it directly shapes what I build next.

And if you've worked through the kit and you're at the "okay, this works,
what's next" stage — that's exactly what my 1:1 sessions are for. We look
at what you're doing, find the highest-leverage next move, and you leave
with a plan.

**[Grab a time here →](https://seedscale.agency/book.html?utm_source=klaviyo&utm_medium=email&utm_campaign=starter-kit-reset)**

Good to be back in your inbox either way.

— Rebecca

---

## Why the copy is shaped this way

- "No exclusions" means one email must be honest for four sub-audiences at
  once (new-flow completers, mid-flow, wrong-download cohort, never-emailed
  cohort). The three-bullet opener names each group explicitly so nobody
  reads a false claim about themselves.
- No "you haven't heard from me" line — dozens of people got flow emails
  on July 3–4 and it would misfire for them.
- The download link goes to the **page**, not the raw PDF, so opens are
  trackable via UTM and the page always serves the current file
  (`/resources/ai-starter-kit-millennial-women.pdf`).
- Reply-CTA first, booking-CTA second — same structure as the prompt pack
  check-in drafts, so your voice stays consistent across both sends.

## Still pending (needs Klaviyo reconnected)

1. Re-authorize the Klaviyo connector, then I can: verify the two list
   names/IDs above, pull the segment count once it builds, and create the
   campaign + template in draft via the API.
2. Prompt pack check-in campaign (from `klaviyo-reengagement-findings.md`)
   — recommended send July 8–9 to the "got Email #1, then silence" pair.
