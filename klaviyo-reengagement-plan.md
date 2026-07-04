# Klaviyo Re-engagement — Execution Spec

> Handoff file for a Claude Code session with the Klaviyo connector attached.
> Written 2026-07-04. Owner: Becky (beckydoong@gmail.com).
> Delete this file from the branch once executed.

## Objective

Re-engage prompt pack contacts with a personal check-in email. Two audiences:

1. **Completed the flow** — went through the entire prompt pack email flow.
2. **Never got a flow email** — prompt pack contacts the flow never reached
   (fell through the cracks).

Everything is created **in draft**. Nothing sends without Becky's review.

## Known account facts (verified 2026-07-04 via connector)

- Klaviyo company ID: `TipqN2`
- Metric "Bought Prompt Pack": id `QZr3p9` (API integration)
- Metric "Submitted Intake Form": id `XZAJsT`
- Lists: `Y7Dexm` (lead magnets / blog), `TDhpPe` (contact forms)
- Sender: rebecca@seedscale.agency
- Booking page: https://seedscale.agency/book.html
- Note: no metric named "Submitted Contact Form" existed as of 2026-07-04.

## Steps for the executing session

1. **Discover the prompt pack flow.** `get_flows`, find the flow tied to the
   prompt pack (likely triggered by "Bought Prompt Pack" — check
   `get_flows_triggered_by_metric` with metric `QZr3p9`). Use
   `get_flow_action` / `get_flow_message` to count its email messages and
   identify the FINAL email's message ID.
2. **Size the audiences.** Report to Becky BEFORE creating anything:
   - Count of profiles who received the final flow email (= completed).
   - Count of profiles with "Bought Prompt Pack" event but zero received
     emails from that flow (= never reached).
3. **Segments.** The connector (as of 2026-07-04) has no segment-creation
   tool. If that is still true, give Becky these exact definitions to click
   into Klaviyo (Audience → Lists & Segments → Create Segment) and wait for
   her confirmation:
   - **"Prompt Pack — Completed Flow"**: Received Email at least once, where
     the message is the flow's final email.
   - **"Prompt Pack — Never Got Flow Emails"**: Bought Prompt Pack at least
     once AND Received Email zero times scoped to that flow.
4. **Create two draft campaigns** (`create_campaign`,
   `create_email_template`, `assign_template_to_campaign_message`):
   - Campaign A → segment "Prompt Pack — Completed Flow", subject
     "How's the prompt pack working for you?", body: Draft A below.
   - Campaign B → segment "Prompt Pack — Never Got Flow Emails", subject
     "I owe you a follow-up (better late than never?)", body: Draft B below.
   - From: rebecca@seedscale.agency. Simple text-style template (personal
     note, minimal design). LEAVE IN DRAFT.
5. **Report back** with campaign IDs/links and audience counts.

Booking link for both emails:
`https://seedscale.agency/book.html?utm_source=klaviyo&utm_medium=email&utm_campaign=prompt-pack-checkin`

## Draft A — completed the flow

Subject: **How's the prompt pack working for you?**

Hi {{ first_name|default:"there" }},

You went through the whole prompt pack series a little while back, and I
realized I never actually asked — how's it going?

A few things I'm genuinely curious about:

- Have you actually put the prompts to work, or are they sitting in a tab
  somewhere? (No judgment — that tab is a busy place.)
- What worked? What fell flat?
- Is there a spot where you got stuck?

**Just hit reply and tell me — even one line.** I read every response
myself, and it directly shapes what I build next.

And if you're at the "okay, this works, what's next" stage: that's usually
the moment a focused 1:1 makes sense. We look at what you're doing, find the
highest-leverage next move, and you leave with a plan. [Grab a time here](BOOKING_LINK)
if that's you.

Either way, I'd love to hear from you.

— Rebecca

## Draft B — never got the emails

Subject: **I owe you a follow-up (better late than never?)**

Hi {{ first_name|default:"there" }},

Confession: you grabbed my prompt pack a while back, and my follow-up emails
never reached you — a gap on my end, not yours. Sorry about that. Fixing it
now, starting with the question I should have asked weeks ago:

**How did it go?**

- Did you get a chance to try the prompts?
- Anything land really well — or totally miss?
- Stuck anywhere?

**Hit reply and let me know — even a one-liner helps.** I read and answer
every response personally.

And if you've worked through it and you're wondering "where do I go from
here" — that's exactly what my 1:1 sessions are for. [Book a time](BOOKING_LINK)
and we'll map your next step together.

Good to reconnect either way.

— Rebecca
