# Klaviyo Re-engagement — Findings Report

> Executed 2026-07-04 against the spec in `klaviyo-reengagement-plan.md`
> (branch `claude/klaviyo-contact-form-alert-m72bcz`). Per the spec's own
> gate — "Report to Becky BEFORE creating anything" — **nothing was created
> in Klaviyo**, because the audience sizing changes the plan materially.

## TL;DR

Both planned audiences are effectively empty:

- **"Completed the flow"** = **0 profiles.** Flow Emails #2 and #3 have
  been sitting in **draft** since the flow launched — nobody has ever
  received the final email, so nobody has "completed" the flow.
- **"Never got a flow email"** = **2 profiles, neither a real customer.**
  Just Becky's own address and an internal seed/test profile.

The real re-engagement opportunity is different: the **2 real customers**
both received Email #1 and then nothing, because the rest of the flow was
never turned on.

## Step 1 — Flow discovery

- Flow: **"Bought Prompt Pack"** — ID `YnTkbH`, status live.
  https://www.klaviyo.com/flow/YnTkbH/edit
- It is **not** triggered by the "Bought Prompt Pack" metric (`QZr3p9` has
  zero flow triggers). It triggers when a profile joins segment
  **"Bought Prompt Pack"** (`WPKXF4`), which is defined as profile property
  `bought_prompt_pack = true`.
- Emails in the flow:

  | # | Subject | Message ID | Status |
  |---|---------|------------|--------|
  | 1 | Get Paid for What You Know is here! | `Ub2wy8` | **live** |
  | 2 | The one prompt to run today | `XABLSi` | **draft** — never sent |
  | 3 | You've found the skill. Here's the business. | `VdrkSD` | **draft** — never sent |

  Final email message ID = `VdrkSD` (Email #3). Delivery count: **0**.

## Step 2 — Audience sizing

"Bought Prompt Pack" events: **4 unique profiles** (all June 2026).
Flow delivery: **Email #1 only, 2 recipients** (verified per profile via
Received Email events).

| Profile | Bought | `bought_prompt_pack` flag | Flow emails received |
|---|---|---|---|
| meriyenparra.gf@gmail.com (Meriyen) | Jun 24 | yes | Email #1 (Jun 24) |
| r.craddocktaylor@gmail.com | Jun 30 | yes | Email #1 (Jun 30) |
| beckydoong@gmail.com (Becky — test purchase) | Jun 23 | yes | none — bought 21:10, flow went live 21:24, so the segment join predates the flow |
| promptpack-seed@seedscale.agency (seed profile) | Jun 23 | **no** — never entered the trigger segment | none |

Resulting audiences per the spec:

- **Prompt Pack — Completed Flow**: 0 profiles → Campaign A would have no
  recipients.
- **Prompt Pack — Never Got Flow Emails**: 2 profiles (Becky + seed
  profile) → Campaign B would reach zero real customers, and Draft B's
  "my emails never reached you" apology doesn't fit either of them.

## Step 3 — Segments

Confirmed: the connector still has no segment-creation tool (as of
2026-07-04). If you still want the original segments, here are the
click-in definitions (Audience → Lists & Segments → Create Segment):

- **"Prompt Pack — Completed Flow"**: What someone has done → Received
  Email at least once → where message = *"You've found the skill. Here's
  the business."* (Email #3 of flow Bought Prompt Pack).
- **"Prompt Pack — Never Got Flow Emails"**: Bought Prompt Pack at least
  once over all time AND Received Email zero times where the message is in
  flow *Bought Prompt Pack*.

But given the numbers above, the segment that actually matches the intent:

- **"Prompt Pack — Got #1, Then Silence"** (recommended): Received Email
  at least once where message = *"Get Paid for What You Know is here!"*
  (Email #1) AND Received Email zero times where message is Email #2 or #3.
  Today = Meriyen + r.craddocktaylor (2 profiles). Optionally exclude
  becky/seed addresses.

## Recommended next actions (pick and confirm)

1. **Fix the root cause:** set flow Emails #2 (`XABLSi`) and #3 (`VdrkSD`)
   live in https://www.klaviyo.com/flow/YnTkbH/edit — new buyers currently
   only ever get Email #1. Decide whether Meriyen and r.craddocktaylor
   should be caught up via the flow's back-populate option or via the
   check-in campaign below (not both).
2. **Also fix the trigger gap:** the flow only fires for profiles with the
   `bought_prompt_pack` property. The seed purchase event never set the
   flag, so it never entered. Consider re-triggering the flow off the
   metric `QZr3p9` directly, or ensure the purchase webhook always sets
   `bought_prompt_pack = true`.
3. **One check-in campaign instead of two:** a single draft campaign to the
   "Got #1, Then Silence" segment (2 real customers), using a blend of the
   two drafts — honest framing: "you got my first email and then my
   follow-ups never went out; here's the check-in I owed you." Copy for
   both original drafts is preserved in the plan file and ready to use.
4. Campaign A ("completed flow") is moot until Emails #2/#3 have actually
   sent to someone.

Once you confirm a direction (and create whichever segment you want), the
campaign + template can be created in draft exactly as specced — subject
lines, copy, sender rebecca@seedscale.agency, and the UTM'd booking link
`https://seedscale.agency/book.html?utm_source=klaviyo&utm_medium=email&utm_campaign=prompt-pack-checkin`.

## Account references

- Klaviyo company ID: `TipqN2`
- Metric "Bought Prompt Pack": `QZr3p9` · Metric "Received Email": `R7qvAV`
- Flow "Bought Prompt Pack": `YnTkbH` · trigger segment: `WPKXF4`
- Flow messages: `Ub2wy8` (live) / `XABLSi` (draft) / `VdrkSD` (draft, final)
