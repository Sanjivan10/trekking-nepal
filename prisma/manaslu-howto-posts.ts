/**
 * Two how-to posts targeting procedural search intent.
 *
 * Deliberately separated from the existing informational posts to avoid
 * keyword cannibalisation:
 *
 *   /blog/manaslu-circuit-trek-permits  -> WHAT the permits are and cost
 *   /blog/how-to-get-manaslu-trekking-permits -> HOW to actually obtain them
 *
 *   /blog/manaslu-circuit-trek-difficulty -> HOW HARD the trek is
 *   /blog/how-to-prepare-for-manaslu-trekking -> HOW to get ready for it
 *
 * Each pair cross-links so search engines read them as complementary rather
 * than competing.
 */
import type { ClusterPost } from "./manaslu-cluster-posts";

const BTL_PERMITS = "https://www.beyondthelimitstreks.com/blog/manaslu-trek-permits";
const BTL_HEIGHT_ROUTE_COST =
  "https://www.beyondthelimitstreks.com/blog/manaslu-circuit-trek-height-route-cost";
const BTL_HARDER_THAN_EBC =
  "https://www.beyondthelimitstreks.com/blog/manaslu-circuit-trek-harder-than-everest-base-camp";

export const howToPosts: ClusterPost[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "how-to-get-manaslu-trekking-permits",
    title: "How Do I Get Manaslu Trekking Permits? The Step-by-Step Process",
    metaTitle: "How to Get Manaslu Trekking Permits — Step-by-Step Guide 2026",
    metaDescription:
      "You cannot apply for Manaslu permits yourself. Here is exactly who applies, which documents you hand over, how long it takes, and where each permit gets checked.",
    excerpt:
      "The single thing most people get wrong: you can't walk into an office and buy these yourself. Here's how the process actually works, start to finish.",
    bannerImage:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=72",
    bannerAlt: "Trekking permit paperwork and passport being prepared in Kathmandu",
    primaryKeywords: "how to get manaslu trekking permits",
    secondaryKeywords:
      "how do i get manaslu trekking permits, manaslu permit application process, manaslu restricted area permit how to apply, manaslu trekking permit documents, where to get manaslu permits",
    entityTags: "Manaslu, Permits, Restricted Area, Process",
    regionSlug: "manaslu",
    keyTakeaway:
      "You cannot obtain Manaslu permits yourself — by law they are issued only to a government-registered trekking agency applying on your behalf, for a group of at least two trekkers with a licensed guide. You hand over your passport copies and photos, the agency files the application in Kathmandu, and the permits are typically ready within 1–2 working days.",
    takeaways: [
      "You cannot apply in person — only a registered agency can file for you",
      "Minimum two trekkers required on the application; solo applications are refused",
      "What you provide: passport scan, passport photos, travel insurance details, entry date",
      "Processing time: usually 1–2 working days in Kathmandu, longer around festivals",
      "Your guide carries all three permits; you never hold them yourself",
      "Checked in person at Jagat and again near Sama — enforcement here is real",
    ].join("\n"),
    content: `## First, the part that surprises everyone

You cannot get Manaslu permits yourself.

There is no counter you can walk up to, no online portal, no way to file as an individual. Manaslu is a **restricted area**, and the regulation says permits are issued only to a government-registered trekking agency applying on behalf of its clients. This catches out a lot of independent trekkers who assume it works like the Annapurna or Everest conservation permits, which you genuinely can buy over a counter.

If you have found a website offering to sell you a Manaslu Restricted Area Permit directly with no agency and no guide, something is wrong with that offer.

## Step 1 — Confirm you meet the two conditions

Before any paperwork happens, two things must be true:

1. **You are trekking with a licensed guide.** Mandatory, not a recommendation.
2. **There are at least two trekkers on the application.** A single-person application is refused outright.

If you are travelling alone, this is not a dead end. Agencies routinely pair solo trekkers with another solo booking on the same departure date to satisfy the minimum — we do this at no extra charge on our [Manaslu Circuit Trek](/trip/manaslu-circuit-trek) departures.

## Step 2 — Send your agency these documents

This is your entire share of the work:

- **A clear scan or photo of your passport** — the photo page, valid at least six months beyond your travel dates
- **Passport-sized photographs** — typically 2–4 per person; some agencies handle this digitally now
- **Your Nepal entry date** and intended trek start date
- **Travel insurance details**, including confirmation it covers high-altitude trekking and helicopter evacuation

Send these as early as you reasonably can. There is no advantage to filing at the last minute and a real risk in it.

## Step 3 — The agency files in Kathmandu

Your agency submits the application to the Department of Immigration for the Restricted Area Permit, and arranges the two conservation area permits alongside it. You do not need to be present. You do not need to visit an office. You will usually not even see the permits — your guide carries all three for the group.

**Typical processing: 1–2 working days.** Allow longer if your trek starts immediately after a major festival (Dashain and Tihar in particular) or over a weekend, when offices close.

## Step 4 — Know which three permits you are getting

| Permit | What it covers |
| --- | --- |
| Manaslu Restricted Area Permit (RAP) | Entry to the restricted zone itself |
| Manaslu Conservation Area Permit (MCAP) | The Manaslu Conservation Area |
| Annapurna Conservation Area Permit (ACAP) | The exit route through Annapurna territory at Dharapani |

The costs of each — and why the ACAP is needed on a Manaslu trek at all — are broken down in full in our [Manaslu permits and costs guide](/blog/manaslu-circuit-trek-permits). For a second walkthrough of the paperwork from our partner operator, see their [Manaslu trek permits guide](${BTL_PERMITS}).

## Step 5 — Checkpoints on the trail

Permits are verified in person at **Jagat** on the way in, and again near **Sama/Samagaun** higher up. Officials genuinely check. Your guide handles the presentation at both, so there is nothing for you to carry or produce yourself, but it is worth knowing the checks are real rather than a formality — trekking here without correct permits is not something that quietly goes unnoticed.

## Common mistakes worth avoiding

- **Leaving it to the last 48 hours.** Processing is quick, but not instant, and a festival closure can cost you your start date.
- **Assuming your Everest or Annapurna experience transfers.** Those permits you can buy yourself. This one you cannot.
- **Booking a "solo Manaslu trek".** If an operator offers this without mentioning the two-person minimum, they are either pairing you without telling you or they are not filing legally.
- **Sending a blurry passport photo.** It gets rejected, and you lose a day.

## What this looks like when you book with us

You send your passport scan and insurance details. We file everything, pair you if you are solo, and your guide carries all three permits from Kathmandu. That is the whole extent of your involvement — the full [day-by-day itinerary and pricing](/trip/manaslu-circuit-trek) covers what happens after that. If you are still weighing the trek up, our [route, cost and height overview](${BTL_HEIGHT_ROUTE_COST}) is a useful next read.`,
    faqs: [
      {
        question: "Can I get Manaslu trekking permits myself?",
        answer:
          "No. Manaslu is a restricted area, and permits are issued only to a government-registered trekking agency applying on behalf of its clients. There is no counter, portal or process that lets an individual apply directly — unlike the Annapurna and Everest conservation permits, which you genuinely can buy yourself.",
      },
      {
        question: "What documents do I need for Manaslu permits?",
        answer:
          "A clear scan of your passport photo page (valid at least six months beyond travel), 2–4 passport-sized photographs, your Nepal entry date and trek start date, and travel insurance details confirming high-altitude and helicopter evacuation cover. Your agency handles everything else.",
      },
      {
        question: "How long does it take to get Manaslu permits?",
        answer:
          "Usually 1–2 working days once your agency has your documents. Allow extra time if your trek begins right after a major festival such as Dashain or Tihar, or over a weekend when government offices are closed.",
      },
      {
        question: "Can I get a Manaslu permit as a solo trekker?",
        answer:
          "Not on your own — the application requires a minimum of two trekkers. Agencies solve this by pairing solo bookings on the same departure date, which is standard practice and should not cost you extra. An operator offering a genuinely solo Manaslu permit is not filing legally.",
      },
      {
        question: "Where are Manaslu permits checked on the trek?",
        answer:
          "In person at the Jagat checkpoint on the way in, and again near Sama/Samagaun higher up the valley. Your guide carries all three permits and presents them, so you do not need to hold or produce anything yourself.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "how-to-prepare-for-manaslu-trekking",
    title: "How to Prepare for Manaslu Region Trekking: A 12-Week Plan",
    metaTitle: "How to Prepare for Manaslu Trekking — Training, Gear & Timeline",
    metaDescription:
      "A practical 12-week preparation plan for the Manaslu Circuit: the training that actually matters, gear that earns its weight, and what to sort three months out.",
    excerpt:
      "Fitness matters less than most people think, and pacing matters far more. Here's what to actually do in the three months before you fly.",
    bannerImage:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=72",
    bannerAlt: "A trekker training on a steep hill trail with a loaded backpack",
    primaryKeywords: "how to prepare for manaslu region trekking",
    secondaryKeywords:
      "manaslu trek training, manaslu circuit preparation, manaslu trek fitness, how to train for manaslu circuit trek, manaslu trek packing preparation, getting ready for manaslu trek",
    entityTags: "Manaslu, Preparation, Training, Fitness, Altitude",
    regionSlug: "manaslu",
    keyTakeaway:
      "Give yourself 12 weeks. The training that matters most is walking uphill for hours with a loaded pack on consecutive days — not gym cardio or running speed. Break in your boots at least a month ahead, sort insurance with helicopter evacuation cover early, and accept that on the trail your pace matters more than your fitness.",
    takeaways: [
      "Start 12 weeks out — 8 is workable, 4 is tight but better than nothing",
      "Train the specific thing: uphill walking, loaded pack, back-to-back days",
      "Break boots in at least a month ahead — new boots on day one is the classic mistake",
      "Insurance must explicitly cover trekking to 5,200m and helicopter evacuation",
      "You cannot pre-acclimatise at home; the itinerary's rest days do that work",
      "The fittest trekkers often struggle most, because they walk too fast early on",
    ].join("\n"),
    content: `## Start twelve weeks out

Not because the Manaslu Circuit demands elite fitness — it does not — but because twelve weeks is roughly how long it takes to make long days on your feet feel normal rather than punishing. Eight weeks works. Four weeks is tight but genuinely better than nothing.

If you are still deciding whether the trek is within reach at all, read our [honest assessment of the difficulty](/blog/manaslu-circuit-trek-difficulty) first, and our partner's [comparison against Everest Base Camp](${BTL_HARDER_THAN_EBC}) if you have done EBC and want a reference point.

## Train the actual thing

The single most common preparation mistake is training the wrong quality. Manaslu does not test your running speed or your VO2 max. It tests whether you can walk uphill for six or seven hours, then get up the next morning and do it again, for two weeks.

**What actually transfers:**

- **Hill walking with a loaded daypack.** Start around 5kg, build to 8–10kg. Find the steepest sustained climb you have access to and repeat it.
- **Back-to-back days.** One long walk on Saturday teaches you far less than a moderate walk Saturday *and* Sunday. Consecutive days are the whole point.
- **Descending.** Larkya La drops about 1,500m in a single afternoon and it wrecks unprepared knees. Train downhill deliberately, not just uphill.
- **Stairs, if you have nothing else.** Unglamorous and genuinely effective.

**What transfers less than people expect:** flat running, cycling, and most gym machines. They build a useful base, but they do not prepare your feet, knees or shoulders for what this trek does to them.

## Weeks 12 to 8 — build the base

Two to three sessions a week. Walk for 60–90 minutes, some of it uphill, carrying a light pack. Add one longer walk at the weekend, working up towards three hours. Nothing dramatic; you are establishing a habit, not peaking.

## Weeks 8 to 4 — make it specific

Now add the load and the repetition. Two consecutive days each weekend, 3–5 hours each, pack loaded to 8–10kg, on the most uneven ground you can find. **Wear the exact boots and socks you will trek in.** This is the phase where blisters, hot spots and a badly-fitting pack reveal themselves — which is exactly what you want, at home, where fixing it costs nothing.

## Weeks 4 to 1 — taper and sort the admin

Keep walking, but stop building. The gains are already banked; what you want now is to arrive fresh rather than fatigued.

Use this window for the non-physical preparation:

- **Travel insurance** covering trekking to at least 5,200m *and* helicopter evacuation. Standard travel insurance almost never includes either. Read the policy wording, not the marketing page.
- **Documents to your agency** — passport scan, photos, insurance details. See [how the permit process works](/blog/how-to-get-manaslu-trekking-permits); you cannot file these yourself.
- **A medical conversation** if you have any cardiac, respiratory or blood-pressure history, or if you want to discuss acetazolamide (Diamox) for altitude.

## Gear that earns its weight

You do not need to buy everything new, and Kathmandu's Thamel district can outfit you cheaply for anything you have missed.

- **Boots** — broken in, above the ankle, waterproof. The single most important item.
- **Sleeping bag rated to around -10°C.** Teahouse blankets alone are not enough above 3,500m; see our [accommodation guide](/blog/manaslu-circuit-trek-accommodation-and-food) for what the lodges actually provide.
- **Layers, not bulk** — base layer, fleece or light down, waterproof shell.
- **Microspikes** if you are crossing Larkya La in shoulder season.
- **A water filter or purification tablets.** Saves money and a great deal of plastic.

## The part training cannot solve

You cannot pre-acclimatise at home. No amount of gym work changes how your body handles 4,500m — that work is done by the itinerary itself, through the rest days at Samagaun and Samdo that exist purely to let your body catch up.

Which leads to the thing worth internalising before you go: **the fittest trekkers often struggle most.** Not because fitness hurts, but because fit people can outwalk their own acclimatisation on days four and five, arrive at altitude ahead of their bodies, and pay for it at the pass. Slow is not a compromise on this trek. Slow is the technique.

## A realistic checklist for the week before

- Boots worn on at least six substantial walks ✅
- Insurance policy read, altitude and evacuation cover confirmed in writing ✅
- Passport scan and photos sent to your agency ✅
- Pack weighed, loaded, and carried for a full day ✅
- Any medication discussed with a doctor ✅

Then stop. Turn up rested. The [14-day itinerary](/trip/manaslu-circuit-trek) is built to bring you up gradually — your job is to arrive in good shape and let it do that.`,
    faqs: [
      {
        question: "How fit do I need to be for the Manaslu Circuit trek?",
        answer:
          "Fit enough to walk six to seven hours on consecutive days over uneven ground, carrying a light daypack. That is a real but achievable standard — around twelve weeks of regular hill walking gets most reasonably active people there. Raw fitness matters less than walking slowly and letting yourself acclimatise.",
      },
      {
        question: "How long should I train before trekking Manaslu?",
        answer:
          "Twelve weeks is ideal, eight is workable, and four is tight but far better than nothing. The aim is not peak fitness but making long days on your feet feel routine, and giving boots and gear time to reveal problems while you are still at home.",
      },
      {
        question: "What is the best training for the Manaslu Circuit?",
        answer:
          "Uphill walking with a loaded pack, on consecutive days. Also train descending deliberately — Larkya La drops roughly 1,500m in one afternoon, which is hard on unprepared knees. Flat running and gym machines build a base but transfer less well than hill walking does.",
      },
      {
        question: "Can I prepare for the altitude on the Manaslu Circuit before I arrive?",
        answer:
          "Not meaningfully. Altitude adaptation happens on the mountain, which is why the itinerary includes rest days at Samagaun and Samdo. What you can do beforehand is arrive well-rested, discuss acetazolamide with a doctor if you have a history of altitude issues, and commit to walking slowly in the first few days.",
      },
      {
        question: "What gear do I need to buy before coming to Nepal?",
        answer:
          "Really only your boots, properly broken in, and any personal medication. Everything else — sleeping bag, layers, microspikes, poles — can be bought or hired affordably in Kathmandu's Thamel district, which is often cheaper than buying at home.",
      },
    ],
  },
];
