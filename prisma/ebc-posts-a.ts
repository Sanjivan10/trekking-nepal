/**
 * Everest Base Camp keyword cluster, part 1 of 2.
 *
 * The ~75 supplied keywords collapse into 14 distinct search intents — most
 * are the same question reworded ("how high", "what elevation", "how many
 * feet", "how tall" are one query). One post per intent; no two compete.
 *
 * Cost keywords are deliberately absent: /blog/everest-base-camp-trek-cost-breakdown
 * already targets them, and a second cost page would split its ranking.
 */
import type { ClusterPost } from "./manaslu-cluster-posts";

export const EBC_TREK = "https://www.beyondthelimitstreks.com/trip/everest-base-camp-trek";
export const EBC_COST = "https://www.beyondthelimitstreks.com/blog/everest-base-camp-trek-cost";
export const EBC_HELI =
  "https://www.beyondthelimitstreks.com/trip/everest-base-camp-helicopter-return-trek";
export const EBC_LUXURY = "https://www.beyondthelimitstreks.com/trip/everest-base-camp-luxury-trek";
export const GOKYO = "https://www.beyondthelimitstreks.com/trip/gokyo-ri-trekking";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=72`;

export const ebcPostsA: ClusterPost[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "how-high-is-everest-base-camp",
    title: "How High Is Everest Base Camp? Elevation in Feet and Metres",
    metaTitle: "How High Is Everest Base Camp? Elevation in Feet & Metres",
    metaDescription:
      "Everest Base Camp sits at 5,364 m (17,598 ft). Here is the elevation of every stop on the trek, how it compares to Kala Patthar, and what that altitude feels like.",
    excerpt:
      "5,364 metres. But the highest point you'll actually stand on is higher than that, and knowing the difference matters when you plan your days.",
    bannerImage: img("1522163182402-834f871fd851"),
    bannerAlt: "Everest Base Camp at 5,364 metres beneath the Khumbu icefall",
    primaryKeywords: "how high everest base camp, everest base camp elevation",
    secondaryKeywords:
      "what is everest base camp elevation, what is everest base camp altitude, what is everest base camp height, what height is everest base camp in feet, how many feet everest base camp, how many meters everest base camp, how much elevation is everest base camp, how tall everest base camp, whats everest base camp elevation",
    entityTags: "Everest, Elevation, Kala Patthar, Altitude, Khumbu",
    regionSlug: "everest",
    keyTakeaway:
      "Everest Base Camp sits at 5,364 metres (17,598 feet) above sea level. The highest point on the standard trek is actually Kala Patthar at 5,545 m (18,192 ft), climbed the morning after Base Camp because it is the viewpoint that shows Everest's summit.",
    takeaways: [
      "Everest Base Camp: 5,364 m / 17,598 ft",
      "Kala Patthar (highest point you stand on): 5,545 m / 18,192 ft",
      "Lukla, where the trek starts: 2,860 m / 9,383 ft",
      "Namche Bazaar: 3,440 m / 11,286 ft",
      "Total ascent from Lukla to Kala Patthar: roughly 2,685 m",
      "Oxygen at 5,364 m is around 50% of what is available at sea level",
    ].join("\n"),
    content: `## Quick answer

**Everest Base Camp sits at 5,364 metres — 17,598 feet — above sea level.** That is the South Base Camp in Nepal, the one trekkers visit. It is roughly the height of three and a half Ben Nevises stacked on top of each other, and about half of Everest's own summit height of 8,849 m.

## How high Everest Base Camp is compared with every other stop

The number people remember is 5,364 m, but you climb through a lot of altitude to reach it. Here is the full profile of the [classic Everest Base Camp Trek](${EBC_TREK}):

| Stop | Metres | Feet |
| --- | --- | --- |
| Lukla (trek start) | 2,860 m | 9,383 ft |
| Phakding | 2,610 m | 8,563 ft |
| Namche Bazaar | 3,440 m | 11,286 ft |
| Tengboche | 3,860 m | 12,664 ft |
| Dingboche | 4,410 m | 14,469 ft |
| Lobuche | 4,940 m | 16,207 ft |
| Gorak Shep | 5,164 m | 16,942 ft |
| **Everest Base Camp** | **5,364 m** | **17,598 ft** |
| **Kala Patthar** | **5,545 m** | **18,192 ft** |

### The bit most people get wrong

Base Camp is *not* the highest point of the trek. Kala Patthar is, at 5,545 m — 181 metres higher.

There is a good reason the itinerary goes there. From Base Camp itself you cannot see Everest's summit at all; Nuptse and Everest's own west shoulder block the view completely. Kala Patthar is the accessible ridge that opens the whole summit pyramid up. Any itinerary that skips it is giving you the altitude without the view.

## What 5,364 metres actually feels like

At Base Camp, each breath contains roughly **half the oxygen** of the same breath at sea level. That is the honest headline, and it explains most of what trekkers experience up there:

- **Walking pace halves.** A stretch you would stroll in 20 minutes at home takes 40, and that is normal rather than a sign of poor fitness.
- **Sleep gets broken.** Disturbed sleep and vivid dreams above 4,500 m are extremely common.
- **Appetite disappears** exactly when you need calories most. Eat anyway.
- **Simple tasks get slow.** Tying a boot at Gorak Shep genuinely takes longer than it should.

None of that is dangerous in itself. It is your body doing the adjustment work, which is precisely why the itinerary builds in acclimatisation days at Namche (3,440 m) and Dingboche (4,410 m) rather than pushing straight up.

## How the altitude is managed on a good itinerary

Above 3,000 m, the guideline that matters is **sleeping altitude gain of no more than 300–500 m per day**, with a rest day roughly every 1,000 m. A well-built 14-day route respects that. The compressed 10 and 11-day versions you will see advertised do not — they get shorter by removing the acclimatisation days, which is the one part you cannot safely cut.

If the altitude profile is your main concern, two options worth knowing:

- The [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) walks up on a normal acclimatisation schedule and flies out from Gorak Shep, which removes the long descent and several days on your feet.
- The [Gokyo Ri Trek](${GOKYO}) reaches a comparable altitude (5,357 m at Gokyo Ri) on a quieter trail, with arguably a better Everest panorama than Kala Patthar.

## Practical advice for the high sections

- **Drink 3–4 litres a day.** Dehydration mimics and worsens altitude symptoms.
- **Walk slower than feels natural**, especially on days 3 and 4. The fittest trekkers get into trouble most often because they can outpace their own acclimatisation.
- **Sleep low after climbing high.** That is the whole logic of the acclimatisation days — a hike up to 3,880 m or 4,700 m, then back down to sleep.
- **Tell your guide about headaches early.** A good guide will thank you; the ones who get into difficulty are usually the ones who stayed quiet.
- **Ask about a pulse oximeter.** Ours check blood-oxygen saturation each evening at altitude, which catches problems before they become emergencies.

## Ready to stand at 5,364 metres?

Everest Base Camp is a high place, but it is a walking route the whole way — no ropes, no climbing skill, no technical ground. What it asks for is a sensible schedule and the patience to go slowly.

We run the [classic Everest Base Camp Trek](${EBC_TREK}) with both acclimatisation days kept, guides trained in wilderness first aid, and a pulse oximeter carried on every departure. If you want the altitude without the full return walk, or a more comfortable version of the same route, talk to us and we will build the itinerary around you.`,
    faqs: [
      {
        question: "How high is Everest Base Camp in feet?",
        answer:
          "Everest Base Camp is 17,598 feet (5,364 metres) above sea level. The highest point on the standard trek is Kala Patthar at 18,192 feet (5,545 metres).",
      },
      {
        question: "Is Everest Base Camp the highest point of the trek?",
        answer:
          "No. Kala Patthar at 5,545 m is 181 metres higher, and it is where the itinerary takes you the morning after Base Camp — because Everest's summit is not visible from Base Camp itself.",
      },
      {
        question: "How much oxygen is there at Everest Base Camp?",
        answer:
          "Roughly 50% of what is available at sea level. That is why walking pace slows dramatically, sleep is broken and appetite drops — all normal responses that the acclimatisation days are designed to manage.",
      },
      {
        question: "What is the elevation gain on the Everest Base Camp trek?",
        answer:
          "About 2,685 m of net gain from Lukla (2,860 m) to Kala Patthar (5,545 m), though the cumulative up-and-down across the trek is considerably more than that.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "where-is-everest-base-camp",
    title: "Where Is Everest Base Camp? Nepal, Tibet and Both Base Camps Explained",
    metaTitle: "Where Is Everest Base Camp Located? Nepal vs Tibet Explained",
    metaDescription:
      "Everest has two base camps — South in Nepal (5,364 m) and North in Tibet (5,150 m). Here is exactly where each one is, and which one trekkers actually visit.",
    excerpt:
      "There are two Everest Base Camps in two different countries. Almost every trekking photo you have seen is of one of them — here's which.",
    bannerImage: img("1461301214746-1e109215d6d3"),
    bannerAlt: "The Khumbu valley in Nepal, location of Everest South Base Camp",
    primaryKeywords: "where is everest base camp located, what country is everest base camp in",
    secondaryKeywords:
      "mount everest base camp location, where is base camp on mount everest, which country is everest base camp, is everest base camp in nepal, where is everest base camp trek, where is everest base camp in tibet, where is north everest base camp, how many base camps does everest have",
    entityTags: "Everest, Location, Nepal, Tibet, Khumbu, Sagarmatha",
    regionSlug: "everest",
    keyTakeaway:
      "Everest has two base camps. South Base Camp is in Nepal at 5,364 m, in the Khumbu region of Sagarmatha National Park — this is the one trekkers visit. North Base Camp is in Tibet, China, at 5,150 m, reachable by road and used mainly by climbing expeditions.",
    takeaways: [
      "South Base Camp: Nepal, 5,364 m — the trekking destination",
      "North Base Camp: Tibet (China), 5,150 m — road-accessible, expedition-focused",
      "South BC sits in Sagarmatha National Park, Solukhumbu district, Nepal",
      "Nearest airstrip to South BC: Lukla (2,860 m), 35 minutes from Kathmandu",
      "Coordinates of South Base Camp: roughly 28.0026° N, 86.8528° E",
      "Everest itself straddles the Nepal–Tibet border; the summit is on the line",
    ].join("\n"),
    content: `## Quick answer

**Everest Base Camp — the one trekkers visit — is in Nepal**, at 5,364 m in the Khumbu region of Sagarmatha National Park, Solukhumbu district. There is a second base camp on the Tibetan side at 5,150 m. Everest itself sits on the border, so both countries have a legitimate claim to it.

## The two base camps, side by side

| | South Base Camp | North Base Camp |
| --- | --- | --- |
| Country | Nepal | Tibet (China) |
| Altitude | 5,364 m / 17,598 ft | 5,150 m / 16,900 ft |
| How you get there | 12–14 day trek from Lukla | Road, by vehicle |
| Who goes | Trekkers and climbers | Mostly climbers and coach tours |
| Permits | Sagarmatha National Park + Khumbu Rural Municipality | Chinese/Tibetan travel permits |

If you have seen photographs of trekkers holding a sign in front of prayer flags and the Khumbu icefall, that is **South Base Camp in Nepal**. It is what people mean by "the Everest Base Camp trek" in almost every context.

### Why the Tibetan side is different

North Base Camp is reachable by road, which changes the experience entirely. You can be driven to roughly 5,150 m without walking, which sounds appealing until you consider that arriving at that altitude in a vehicle gives your body no time to adapt at all. It is used mainly by expeditions climbing the north ridge and by organised tours from Lhasa.

The Nepali side, by contrast, is only reachable on foot. That walk *is* the acclimatisation.

## Where exactly in Nepal?

South Base Camp lies at approximately **28.0026° N, 86.8528° E**, in the upper Khumbu valley:

- **District:** Solukhumbu, Province No. 1, eastern Nepal
- **Protected area:** Sagarmatha National Park, a UNESCO World Heritage Site
- **Nearest settlement:** Gorak Shep (5,164 m), about two hours away on foot
- **Nearest airstrip:** Lukla (2,860 m), roughly 35 minutes' flight from Kathmandu

### Getting there from Kathmandu

The standard route flies to Lukla and walks north up the Dudh Kosi and Khumbu valleys through Phakding, Namche Bazaar, Tengboche, Dingboche and Lobuche. That is the [classic Everest Base Camp Trek](${EBC_TREK}), and it takes 12–14 days round trip.

There is no road to Base Camp on the Nepali side, and there never has been. Everything above Lukla arrives on foot, on a yak, or by helicopter.

## Practical notes on the location

- **Lukla flights are weather-dependent.** During peak season they sometimes operate from Ramechhap instead of Kathmandu, which adds a four-hour pre-dawn drive. Build in a buffer day.
- **You cannot see Everest from Base Camp.** The location is dramatic — right under the Khumbu icefall — but Nuptse and Everest's west shoulder hide the summit. Kala Patthar, 181 m higher, is where you get the view.
- **Base Camp moves.** The glacier beneath it shifts, so the exact spot changes slightly year to year, and the climbing season tent city only exists in spring.
- **If time is tight**, the [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) walks in and flies out, cutting several days without cutting the acclimatisation.

## Alternatives in the same region

If your reason for going is the Everest view rather than Base Camp specifically, the [Gokyo Lakes trekking route](${GOKYO}) sits in the same national park, reaches a similar altitude at Gokyo Ri (5,357 m), and many trekkers rate the panorama from there as the better one. It is also considerably quieter.

## Plan your trip to the Khumbu

Everest Base Camp is in Nepal, it takes about two weeks on foot, and the walk in is what makes the altitude survivable.

We are a Nepal-based operator running the [Everest Base Camp Trek](${EBC_TREK}) with licensed Sherpa guides who live in the Khumbu. Whether you want the classic route, a helicopter return, or a quieter alternative through Gokyo, get in touch and we will put together an itinerary that fits your dates.`,
    faqs: [
      {
        question: "What country is Everest Base Camp in?",
        answer:
          "The base camp trekkers visit is in Nepal, at 5,364 m in Sagarmatha National Park. There is a second base camp in Tibet (China) at 5,150 m, used mainly by climbing expeditions and reachable by road.",
      },
      {
        question: "How many base camps does Everest have?",
        answer:
          "Two — South Base Camp in Nepal (5,364 m) and North Base Camp in Tibet (5,150 m). Climbers attempting the summit then establish a series of higher camps above base camp, numbered Camp 1 through Camp 4.",
      },
      {
        question: "Is Everest Base Camp in Nepal or Tibet?",
        answer:
          "Both countries have one. The Everest Base Camp trek almost always refers to the Nepali side, reached on foot from Lukla. The Tibetan base camp is a road-accessible site on the northern approach.",
      },
      {
        question: "Can you drive to Everest Base Camp?",
        answer:
          "On the Tibetan side, yes — North Base Camp is road-accessible. On the Nepali side, no. There is no road above Lukla, so South Base Camp is reached only on foot or by helicopter.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "how-long-is-the-everest-base-camp-trek",
    title: "How Long Is the Everest Base Camp Trek? Days, Hours and Realistic Timings",
    metaTitle: "How Long Is the Everest Base Camp Trek? Days & Daily Hours",
    metaDescription:
      "The Everest Base Camp trek takes 12–14 days round trip from Lukla, walking 5–7 hours a day. Here is the full day-by-day timing and how to shorten it safely.",
    excerpt:
      "Twelve to fourteen days, five to seven hours of walking a day. Here's where that time actually goes — and the one way to cut it that doesn't compromise safety.",
    bannerImage: img("1516483638261-f4dbaf036963"),
    bannerAlt: "Trekkers on the trail to Everest Base Camp in the Khumbu valley",
    primaryKeywords: "how long everest base camp trek, how many days everest base camp",
    secondaryKeywords:
      "how long does everest base camp take, how long everest base camp, how long everest base camp hike, how long does everest base camp hike take, how long is everest base camp walk, how is everest base camp trek",
    entityTags: "Everest, Duration, Itinerary, Lukla, Kala Patthar",
    regionSlug: "everest",
    keyTakeaway:
      "The Everest Base Camp trek takes 12–14 days round trip from Lukla, with 5–7 hours of walking on a typical day. Add two days in Kathmandu at either end and most people book a 16-day trip. Shorter versions exist, but they get shorter by cutting acclimatisation days.",
    takeaways: [
      "Standard trek: 12–14 days Lukla to Lukla",
      "Full trip including Kathmandu: usually 15–16 days",
      "Daily walking: 5–7 hours, longer on Base Camp and Kala Patthar days",
      "Two acclimatisation days built in: Namche (3,440 m) and Dingboche (4,410 m)",
      "Ascent takes 8 days; descent takes 3",
      "Helicopter return cuts roughly 3 days without cutting acclimatisation",
    ].join("\n"),
    content: `## Quick answer

**The Everest Base Camp trek takes 12 to 14 days round trip from Lukla.** Eight days walking up, three coming back down, and two acclimatisation days that do not move you forward but keep you safe. Add a day either side in Kathmandu and most people budget 15–16 days door to door.

## Where the days actually go

| Days | Section | Notes |
| --- | --- | --- |
| 1 | Fly Kathmandu → Lukla, trek to Phakding | Short, downhill, deliberately easy |
| 2 | Phakding → Namche Bazaar | The Namche hill: 600 m of switchbacks |
| 3 | **Acclimatisation at Namche** | Hike high to 3,880 m, sleep low |
| 4–5 | Namche → Tengboche → Dingboche | Treeline ends |
| 6 | **Acclimatisation at Dingboche** | Climb to ~4,700 m, return to sleep |
| 7 | Dingboche → Lobuche | Past the climbers' memorials |
| 8 | Lobuche → Gorak Shep → **Base Camp** | The long one: 7–8 hours |
| 9 | **Kala Patthar** at dawn → Pheriche | 4am start, then a big descent |
| 10–11 | Pheriche → Namche → Lukla | Fast on the way down |
| 12 | Fly Lukla → Kathmandu | Buffer day recommended |

## How long you walk each day

Five to seven hours is typical. Two days break that pattern:

- **Base Camp day** — 7–8 hours, because you walk to Gorak Shep, continue to Base Camp, and come back to sleep.
- **Kala Patthar day** — a 4am start in the dark for the 5,545 m viewpoint, then a long descent to Pheriche. Often 7–8 hours total.

Descending days cover far more ground in the same time. You will walk from Pheriche to Namche in a day, having taken two and a half days to cover the same distance going up.

## Why 12 days is the honest minimum

You will see the [Everest Base Camp Trek](${EBC_TREK}) advertised at 10 or 11 days. The distance does not change and nobody walks faster — those itineraries get shorter by deleting one or both acclimatisation days.

Those days are the single most effective thing protecting you from altitude sickness. Skipping the Namche rest day in particular sharply raises the odds of trouble higher up. If an operator quotes you 10 days, ask directly which rest day they removed.

### The one way to shorten it safely

Cut the descent, not the ascent. The [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) walks up on the full acclimatisation schedule and flies out from Gorak Shep, saving roughly three days and sparing your knees the 5,545 m to 2,860 m descent. Your body still gets every acclimatisation day it needs on the way up — you just do not walk the same trail twice.

## Practical timing advice

- **Add a buffer day.** Lukla flights are cancelled for weather regularly. One spare day in Kathmandu at the end is the difference between an inconvenience and a missed international flight.
- **Do not plan tight connections.** Fly home at least 24 hours after your scheduled Lukla return.
- **Start early each day.** Khumbu weather is clearest in the morning; cloud builds through the afternoon.
- **Expect to be slower than at home** — a 6 km stage at 4,900 m takes far longer than 6 km at sea level, and that is normal.
- **Budget rest properly.** If you want the same trek with more comfortable overnight stops and a gentler daily rhythm, the [Everest Base Camp Luxury Trek](${EBC_LUXURY}) covers the same route with better lodges.

## Book the trek with the days it actually needs

A fortnight is the honest answer, and the itineraries that promise less are usually selling you a shorter trip by removing the parts that keep you well.

We run the [classic 14-day EBC route](${EBC_TREK}) with both acclimatisation days intact and a buffer day built in. If your dates are tight, talk to us about the helicopter return rather than a compressed walking itinerary — it is the safer way to save time.`,
    faqs: [
      {
        question: "How many days does the Everest Base Camp trek take?",
        answer:
          "12–14 days round trip from Lukla, or 15–16 days including your arrival and departure days in Kathmandu. That includes two acclimatisation days that are essential rather than optional.",
      },
      {
        question: "How many hours a day do you walk on the EBC trek?",
        answer:
          "Typically 5–7 hours. Two days are longer: the Base Camp day (7–8 hours) and the Kala Patthar morning, which starts around 4am and finishes with a long descent to Pheriche.",
      },
      {
        question: "Can you do Everest Base Camp in 10 days?",
        answer:
          "It is advertised, but those itineraries shorten the trip by removing acclimatisation days rather than by walking faster. A safer way to save time is walking up on the full schedule and returning by helicopter, which cuts about three days off the descent.",
      },
      {
        question: "How long is the descent from Everest Base Camp?",
        answer:
          "About three days on foot, from Gorak Shep back to Lukla via Pheriche and Namche. Descending covers far more ground per day than climbing, or you can fly out from Gorak Shep by helicopter in around 20 minutes.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "how-many-miles-is-the-everest-base-camp-trek",
    title: "How Many Miles Is the Everest Base Camp Trek? Distance in Miles and Km",
    metaTitle: "How Many Miles Is the Everest Base Camp Trek? Full Distance",
    metaDescription:
      "The Everest Base Camp trek covers roughly 80 miles (130 km) round trip from Lukla. Here is the distance for every stage, and why the mileage is the easy part.",
    excerpt:
      "About 80 miles round trip — which sounds modest until you realise where those miles are and how thin the air gets over the last twenty.",
    bannerImage: img("1519681393784-d120267933ba"),
    bannerAlt: "The winding trail through the Khumbu valley toward Everest Base Camp",
    primaryKeywords: "how many miles is everest base camp trek, how far everest base camp",
    secondaryKeywords:
      "how many km everest base camp, how many miles everest base camp, everest base camp trek distance, how far is everest base camp from lukla",
    entityTags: "Everest, Distance, Lukla, Khumbu, Itinerary",
    regionSlug: "everest",
    keyTakeaway:
      "The Everest Base Camp trek covers roughly 130 km (80 miles) round trip from Lukla — about 65 km each way. Daily stages run 8–15 km, which is modest by hiking standards; the difficulty comes from altitude and terrain rather than raw distance.",
    takeaways: [
      "Round trip from Lukla: roughly 130 km / 80 miles",
      "One way, Lukla to Base Camp: roughly 65 km / 40 miles",
      "Typical daily stage: 8–15 km / 5–9 miles",
      "Longest single day: Lobuche → Gorak Shep → Base Camp, around 13 km",
      "Total elevation gain from Lukla to Kala Patthar: about 2,685 m",
      "Distance is rarely the limiting factor — altitude and terrain are",
    ].join("\n"),
    content: `## Quick answer

**The Everest Base Camp trek is roughly 130 kilometres — about 80 miles — round trip from Lukla.** That is around 65 km in each direction. Split across 12 days of walking, it averages a very manageable 10–11 km a day.

## Distance by stage

| Stage | Km | Miles |
| --- | --- | --- |
| Lukla → Phakding | 8 km | 5 mi |
| Phakding → Namche Bazaar | 11 km | 7 mi |
| Namche acclimatisation hike | 5 km | 3 mi |
| Namche → Tengboche | 10 km | 6 mi |
| Tengboche → Dingboche | 9 km | 5.5 mi |
| Dingboche acclimatisation hike | 4 km | 2.5 mi |
| Dingboche → Lobuche | 8 km | 5 mi |
| Lobuche → Gorak Shep → **Base Camp** | 13 km | 8 mi |
| Kala Patthar → Pheriche | 16 km | 10 mi |
| Pheriche → Namche | 15 km | 9 mi |
| Namche → Lukla | 19 km | 12 mi |

Figures vary a little between operators depending on exactly where stages start and finish, so treat any single decimal-precision number you see quoted with some scepticism.

## Why 80 miles is harder than 80 miles sounds

Eighty miles over twelve days is not, on paper, a demanding walk. Plenty of people cover that in three days on a long-distance path at home. Three things make the Khumbu different:

**1. The air thins as you go.** The last 20 km are above 4,900 m, where there is roughly half the oxygen of sea level. Distance stops being the constraint and breathing becomes it.

**2. The terrain is relentlessly uneven.** Stone staircases, glacial moraine, suspension bridges, boulder fields. Very little of this trek is flat, smooth ground.

**3. The vertical dominates.** You gain about 2,685 m from Lukla to Kala Patthar, and the cumulative up-and-down is considerably more, because the trail repeatedly drops to river crossings before climbing again.

### The stage that surprises people

The final day, **Namche to Lukla at 19 km**, is the longest single stretch of the trek. It comes at the end when you are tired, and although it is mostly downhill, that is exactly what punishes tired knees. Trekking poles earn their weight here more than anywhere else.

## Practical advice on covering the distance

- **Pace, not speed.** A steady slow rhythm you can hold for six hours beats fast bursts with long recoveries, particularly above 4,000 m.
- **Poles for the descent.** The knee load coming down from Kala Patthar to Pheriche is the single biggest cause of joint complaints we see.
- **Broken-in boots.** Eighty miles will find any flaw in your footwear. New boots on day one is the classic error.
- **Train on consecutive days.** Walking 15 km once at the weekend prepares you far less than 10 km on Saturday *and* Sunday.
- **Consider halving the mileage.** The [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) walks the 65 km up and flies out, which removes the entire return leg — worth considering if descending is where you struggle.

## Distances on the alternatives

If you would rather spread similar mileage across quieter trails, the [Gokyo Ri Trek](${GOKYO}) covers comparable ground on the western side of the Khumbu, reaching 5,357 m with a fraction of the foot traffic. Some trekkers combine both over the Cho La pass, which pushes the total nearer 160 km.

## Walk it with people who know every kilometre

Eighty miles is very achievable. It is the altitude, the terrain and the pacing that decide how it goes — and those are exactly what a good guide manages for you.

Our [Everest Base Camp Trek](${EBC_TREK}) is run by Sherpa guides from the Khumbu who have walked these stages hundreds of times. Get in touch and we will match the daily distances to your fitness rather than the other way round.`,
    faqs: [
      {
        question: "How many miles is the Everest Base Camp trek?",
        answer:
          "Roughly 80 miles (130 km) round trip from Lukla — about 40 miles each way. Daily stages typically run 5–9 miles.",
      },
      {
        question: "How far is Everest Base Camp from Lukla?",
        answer:
          "About 65 km (40 miles) one way, covered over 8 days of walking including two acclimatisation days. The return takes only 3 days because you descend far faster.",
      },
      {
        question: "What is the longest day on the Everest Base Camp trek?",
        answer:
          "By distance, Namche to Lukla at around 19 km on the final day. By effort, the Base Camp day (Lobuche → Gorak Shep → Base Camp, about 13 km at over 5,000 m) or the Kala Patthar morning.",
      },
      {
        question: "Is the Everest Base Camp trek distance difficult?",
        answer:
          "The mileage itself is modest — around 10 km a day. What makes it demanding is that the final third sits above 4,900 m on rough glacial terrain, where the same distance takes roughly twice as long and far more effort.",
      },
    ],
  },
];
