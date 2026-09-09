/** Everest Base Camp keyword cluster, part 2 of 2. */
import type { ClusterPost } from "./manaslu-cluster-posts";
import { EBC_TREK, EBC_COST, EBC_HELI, EBC_LUXURY, GOKYO } from "./ebc-posts-a";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=72`;

export const ebcPostsB: ClusterPost[] = [
  {
    slug: "is-everest-base-camp-hard",
    title: "Is Everest Base Camp Hard? An Honest Assessment of the Difficulty",
    metaTitle: "Is Everest Base Camp Hard? Honest Difficulty Guide",
    metaDescription:
      "Everest Base Camp is moderately difficult — no climbing skill needed, but 5–7 hours of walking daily at altitude. Here is what actually makes it hard.",
    excerpt:
      "No ropes, no climbing, no technical ground. The difficulty is altitude and repetition — and the fittest trekkers often struggle most.",
    bannerImage: img("1483728642387-6c3bdd6c93e5"),
    bannerAlt: "A trekker climbing a steep section of trail in the Everest region",
    primaryKeywords: "is everest base camp hard, everest base camp difficulty",
    secondaryKeywords:
      "is everest base camp hike hard, how hard everest base camp, how difficult everest base camp, mount everest base camp difficulty, is the everest base camp trek difficult",
    entityTags: "Everest, Difficulty, Altitude, Fitness, Kala Patthar",
    regionSlug: "everest",
    keyTakeaway:
      "Everest Base Camp is moderately difficult. There is no technical climbing, no ropes and no glacier travel — it is a walking trail throughout. The difficulty comes from walking 5–7 hours a day for twelve days, with the final stretch above 5,000 m where oxygen is roughly half sea-level.",
    takeaways: [
      "Grade: moderate — non-technical, no climbing equipment or skill required",
      "Daily walking: 5–7 hours on uneven stone trail",
      "Hardest days: Base Camp day (7–8 hrs) and the 4am Kala Patthar climb",
      "Altitude, not fitness, is the main limiting factor",
      "Fitness benchmark: comfortable walking 6 hours on consecutive days",
      "Success rate is far more about pacing than athleticism",
    ].join("\n"),
    content: `## Quick answer

**Everest Base Camp is moderately difficult, not technically hard.** There is no climbing, no ropes, no crampons and no glacier travel — you walk a stone trail the whole way. What makes it demanding is doing 5–7 hours a day, twelve days running, with the last stretch above 5,000 m where each breath holds about half the oxygen it would at sea level.

## What actually makes it hard

**Altitude.** This is the real challenge, and it is not something fitness protects you from. Above 4,000 m most trekkers get headaches, broken sleep and no appetite. Above 5,000 m simple tasks take noticeably longer.

**Repetition.** One 6-hour day is fine. Twelve of them, back to back, with fewer calories going in than you are burning, is a different proposition.

**Terrain.** Stone staircases, glacial moraine, suspension bridges. Very little flat ground.

**Cold and basic conditions.** Nights at Gorak Shep can drop below −15°C, in unheated rooms.

### The days that test people

- **The Namche hill (day 2)** — 600 m of switchbacks, everyone's least favourite afternoon.
- **Base Camp day (day 8)** — 7–8 hours, and you sleep at 5,164 m afterwards.
- **Kala Patthar (day 9)** — a 4am start in the dark to 5,545 m, then a long descent.

## Why the fittest trekkers often struggle most

This surprises people, but we see it every season. Strong, fit trekkers can walk fast enough on days 3 and 4 to outrun their own acclimatisation — arriving at altitude before their bodies have adjusted, then paying for it higher up.

Slow is not a compromise on this trek. Slow is the technique. The trekkers who reach Base Camp comfortably are usually the ones who were patient early.

## How fit do you need to be?

The honest benchmark: **can you walk for six hours, on uneven ground, on consecutive days?** If yes, you can do this trek. If two flights of stairs leave you gasping, give yourself three months of regular hill walking with a loaded daypack first.

You do not need to run, lift, or train at altitude. You need endurance on your feet and the patience to go slowly.

## Making it easier

- **Keep both acclimatisation days.** Compressed 10-day itineraries remove exactly the safeguard that makes this manageable.
- **Trekking poles**, especially for the descent from Kala Patthar.
- **Hire a porter** — carrying 5 kg instead of 15 kg changes the trek completely.
- **Consider a helicopter return.** The [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) removes the entire descent, which is where tired knees suffer.
- **Or trek more comfortably.** The [Everest Base Camp Luxury Trek](${EBC_LUXURY}) covers the same route with heated, better-equipped lodges — the walking is identical but you recover far better overnight.

## Ready to find out you can do it?

Most people who ask whether Everest Base Camp is too hard for them are more capable than they think. It is a long walk at altitude, not a mountaineering expedition.

Our [classic Everest Base Camp Trek](${EBC_TREK}) keeps both acclimatisation days, moves at a pace set by the slowest person in the group, and carries a pulse oximeter on every departure. Talk to us about your fitness honestly and we will tell you straight whether it is realistic.`,
    faqs: [
      { question: "Is the Everest Base Camp trek hard for beginners?", answer: "It is achievable for a first Himalayan trek, provided you can walk six hours on consecutive days and choose an itinerary that keeps both acclimatisation days. No technical skills are needed. Three months of regular hill walking is the best preparation." },
      { question: "Do you need climbing experience for Everest Base Camp?", answer: "None at all. There is no rope work, no crampons and no glacier travel on the trek. It is a walking trail from Lukla to Base Camp and back." },
      { question: "What is the hardest part of the Everest Base Camp trek?", answer: "Most trekkers name either the Namche hill on day 2 (600 m of switchbacks) or the Kala Patthar morning — a 4am start to 5,545 m in the cold and dark, followed by a long descent." },
      { question: "How fit do I need to be for Everest Base Camp?", answer: "Fit enough to walk 5–7 hours a day on uneven ground, several days running, carrying a light daypack. Raw fitness matters less than walking slowly enough to let your body acclimatise." },
    ],
  },

  {
    slug: "is-everest-base-camp-dangerous",
    title: "Is Everest Base Camp Dangerous? The Real Risks, Honestly Assessed",
    metaTitle: "Is Everest Base Camp Dangerous? Real Risks & Safety Guide",
    metaDescription:
      "The Everest Base Camp trek is not technically dangerous, but altitude sickness is a genuine risk. Here are the real hazards and how they are managed.",
    excerpt:
      "The honest answer: the trek itself is safe walking. The risks are altitude, the Lukla flight, and cutting corners on the itinerary.",
    bannerImage: img("1490730141103-6cac27aaab94"),
    bannerAlt: "Memorial stones at Thukla Pass on the Everest Base Camp trail",
    primaryKeywords: "is everest base camp dangerous",
    secondaryKeywords:
      "everest base camp safety, everest base camp trek risks, is everest base camp trek safe, everest base camp death rate",
    entityTags: "Everest, Safety, Altitude Sickness, Lukla, Risk",
    regionSlug: "everest",
    keyTakeaway:
      "The Everest Base Camp trek is not technically dangerous — it involves no climbing and never enters the Khumbu Icefall where climbing fatalities occur. The genuine risks are altitude sickness, which is manageable with proper acclimatisation, and the Lukla flight, which is weather-dependent.",
    takeaways: [
      "No technical climbing — you never enter the Khumbu Icefall",
      "Main risk: altitude sickness, almost entirely preventable by pacing",
      "Serious altitude illness (HACE/HAPE) is uncommon on well-paced itineraries",
      "Everest's famous fatality statistics apply to summit climbers, not trekkers",
      "Insurance with helicopter evacuation cover to 6,000 m is essential",
      "Compressed itineraries are the single biggest avoidable risk factor",
    ].join("\n"),
    content: `## Quick answer

**No, the Everest Base Camp trek is not dangerous in the way people fear.** It involves no climbing, no ropes and no glacier travel, and it never enters the Khumbu Icefall — the section responsible for most Everest fatalities. The genuine risk is altitude sickness, and that is largely preventable.

## The confusion worth clearing up first

When people read about deaths on Everest, they are almost always reading about **summit expeditions** — climbers going above 8,000 m with oxygen, fixed ropes and weeks on the mountain. The Khumbu Icefall, avalanches, the death zone: none of that is on the trekking route.

The trek stops at 5,364 m and turns around. Its highest point, Kala Patthar at 5,545 m, is a walk up a ridge. Those are completely different activities that happen to share a mountain.

## The risks that are real

**1. Altitude sickness.** Mild symptoms — headache, poor sleep, low appetite — affect most trekkers above 4,000 m and are normal. Serious forms (HACE, affecting the brain; HAPE, the lungs) are uncommon on a properly paced trip but are genuine emergencies. Both improve rapidly on descent.

**2. The Lukla flight.** Short runway, mountain weather, frequent cancellations. Cancellations are the common outcome, not accidents — but build in a buffer day.

**3. Cold and exposure.** Nights at Gorak Shep can fall below −15°C in unheated rooms.

**4. Falls on uneven ground.** Twisted ankles and knee injuries on the descent are the most common injuries by a wide margin.

**5. Stomach upsets.** Unpleasant rather than dangerous, but dehydration at altitude compounds other problems.

### Warning signs that mean descend now

- Confusion or altered behaviour
- Loss of coordination — unable to walk a straight line heel-to-toe
- Breathlessness while resting
- A cough producing pink or frothy sputum

Any of those means going down immediately, at night if necessary. Descent is the treatment.

## How the risk is actually managed

- **Both acclimatisation days kept** — Namche and Dingboche. This is the single most protective factor.
- **Sleeping altitude gain capped** at 300–500 m per day above Namche.
- **Daily pulse oximeter checks** to catch falling oxygen saturation early.
- **A guide trained in wilderness first aid**, carrying a satellite communicator.
- **Helicopter evacuation available** across most of the Khumbu — one of the best-covered trekking regions anywhere.

## The thing that makes it dangerous

Compressed itineraries. A 10-day Everest Base Camp trek gets shorter by deleting acclimatisation days — the exact safeguard that keeps altitude sickness from becoming serious. That is the one avoidable risk factor entirely within your control at the booking stage.

**Insurance is non-negotiable.** You need a policy explicitly covering trekking to 6,000 m and helicopter evacuation. Standard travel insurance almost never does, and a helicopter from Gorak Shep costs USD 5,000–8,000. See our [cost breakdown](${EBC_COST}) for what to budget.

## Trek it safely

Everest Base Camp is one of the safest high-altitude treks in the world when it is run properly — good infrastructure, excellent rescue coverage, a well-understood route.

We run the [classic Everest Base Camp Trek](${EBC_TREK}) with both acclimatisation days, wilderness-first-aid-trained guides, and oximeter checks every evening at altitude. If you would rather minimise time at altitude altogether, ask us about the [helicopter return option](${EBC_HELI}).`,
    faqs: [
      { question: "How many people die trekking to Everest Base Camp?", answer: "Trekking fatalities are rare and are usually attributed to pre-existing cardiac conditions or severe altitude illness on compressed itineraries, not to the trail itself. Everest's widely quoted death statistics refer to summit climbers above 8,000 m, which is an entirely different activity." },
      { question: "Is altitude sickness common on the Everest Base Camp trek?", answer: "Mild symptoms — headache, disturbed sleep, reduced appetite — are very common above 4,000 m and are a normal part of adapting. Serious altitude illness is uncommon on itineraries that keep both acclimatisation days and limit sleeping-altitude gain." },
      { question: "Do you need insurance for the Everest Base Camp trek?", answer: "Yes, and it must explicitly cover trekking to 6,000 m plus helicopter evacuation. Standard travel policies rarely include either. Evacuation from the upper Khumbu costs USD 5,000–8,000 without cover." },
      { question: "Is the Lukla flight dangerous?", answer: "Lukla has a short, sloped runway and is flown daily by experienced pilots. The far more common issue is cancellation due to weather rather than any accident — which is why a buffer day at the end of your trek is strongly recommended." },
    ],
  },

  {
    slug: "is-everest-base-camp-worth-it",
    title: "Is Everest Base Camp Worth It? What You Actually Get for Two Weeks",
    metaTitle: "Is Everest Base Camp Worth It? An Honest Verdict",
    metaDescription:
      "Is the Everest Base Camp trek worth doing? What the trail actually delivers, what Base Camp really looks like, and who might prefer a quieter alternative.",
    excerpt:
      "You cannot see Everest from Base Camp. Knowing that in advance is the difference between disappointment and one of the best fortnights of your life.",
    bannerImage: img("1469474968028-56623f02e42e"),
    bannerAlt: "Everest, Lhotse and Nuptse seen from the Khumbu valley",
    primaryKeywords: "is everest base camp worth it, why go to everest base camp",
    secondaryKeywords:
      "why everest base camp, why hike to everest base camp, what does everest base camp look like, is the everest base camp trek worth doing",
    entityTags: "Everest, Kala Patthar, Gokyo, Namche Bazaar, Tengboche",
    regionSlug: "everest",
    keyTakeaway:
      "For most trekkers, yes. You walk beneath four of the world's six highest peaks through Sherpa villages, and stand at the foot of Everest. The caveat worth knowing: Base Camp itself is a rocky glacial moraine with no view of Everest's summit — the view comes from Kala Patthar the next morning.",
    takeaways: [
      "Base Camp is a rocky moraine at 5,364 m — atmospheric, not scenic",
      "You cannot see Everest's summit from Base Camp; Kala Patthar is the viewpoint",
      "Trail highlights: Namche Bazaar, Tengboche Monastery, Ama Dablam",
      "It is Nepal's busiest trekking route in peak season",
      "Quieter alternative with arguably better views: Gokyo Ri",
      "Best for: first-time Himalayan trekkers wanting the iconic destination",
    ].join("\n"),
    content: `## Quick answer

**For most people, yes — but manage one expectation first.** Base Camp itself is a rocky expanse of glacial moraine, and you cannot see Everest's summit from it. The reward is the fortnight of walking to get there, and the sunrise from Kala Patthar the following morning.

## What Everest Base Camp actually looks like

Honest description: a wide field of rock and ice debris at the foot of the Khumbu Icefall, marked by prayer flags and a boulder people photograph. In spring there is a tent city of climbing expeditions; the rest of the year it is largely empty.

It is genuinely atmospheric — you are standing where every Everest summit attempt begins, beneath a groaning, shifting icefall. But it is not a viewpoint, and trekkers who arrive expecting a postcard panorama are the ones who leave underwhelmed.

**The view comes the next morning.** Kala Patthar, 181 m higher, is where Everest's full summit pyramid appears. That sunrise is what most people remember.

## What actually makes the trek worth it

- **Namche Bazaar** — a Sherpa trading town built into a natural amphitheatre at 3,440 m.
- **Tengboche Monastery** at 3,867 m, with Ama Dablam directly behind it.
- **Ama Dablam itself** — most trekkers agree it is the most beautiful mountain on the route, and it is not Everest.
- **Four of the world's six highest peaks** visible in a single week: Everest, Lhotse, Cho Oyu and Makalu.
- **The Khumbu Glacier**, walked alongside for the final days.
- **Sherpa culture** — monasteries, mani walls and villages that have hosted trekkers for fifty years.

## Who it is worth it for

**Go if:** you want the iconic destination, this is your first Himalayan trek, you value good infrastructure and reliable rescue coverage, and you can walk six hours a day for two weeks.

**Reconsider if:** solitude is your priority. In October the trail between Namche and Tengboche is genuinely busy, and lodges fill by mid-afternoon.

### The alternative worth knowing about

If your reason for going is the Everest view rather than Base Camp specifically, the [Gokyo Lakes trekking route](${GOKYO}) reaches 5,357 m at Gokyo Ri, in the same national park, with a fraction of the traffic. Many trekkers who have done both rate the Gokyo panorama higher — it shows Everest, Lhotse, Makalu and Cho Oyu together above a chain of turquoise lakes.

Some combine the two over the Cho La pass, which is the most complete way to see the Khumbu.

## Practical advice for getting the most from it

- **Do Kala Patthar.** Any itinerary skipping it gives you the altitude without the payoff.
- **Go in the shoulder weeks.** Early March or late November are quieter with good conditions.
- **Look up at Ama Dablam.** People fixate on Everest and walk past the better mountain.
- **Spend the Namche rest day properly** — Khumjung, Khunde and the Everest View Hotel are worth it.
- **Budget for comfort if it matters.** The [Everest Base Camp Luxury Trek](${EBC_LUXURY}) uses heated lodges, which genuinely changes how much you enjoy the evenings.

## Make the fortnight count

Everest Base Camp is worth it when you go in knowing what it is — a long, beautiful walk through the most storied valley in mountaineering, ending at a place that matters more for what it represents than how it looks.

We run the [classic Everest Base Camp Trek](${EBC_TREK}) with Kala Patthar included and Sherpa guides who grew up in these villages. Prefer somewhere quieter? Ask us about Gokyo, or a combined route over the Cho La.`,
    faqs: [
      { question: "Can you see Mount Everest from Everest Base Camp?", answer: "No. Nuptse and Everest's own west shoulder block the summit from view at Base Camp. This is why itineraries include a pre-dawn climb of Kala Patthar (5,545 m) the following morning — it is the accessible viewpoint that shows the full summit pyramid." },
      { question: "What does Everest Base Camp actually look like?", answer: "A wide expanse of rocky glacial moraine at the foot of the Khumbu Icefall, marked with prayer flags and a boulder trekkers photograph. During the spring climbing season it hosts a tent city of expeditions; at other times it is largely bare." },
      { question: "Is Gokyo better than Everest Base Camp?", answer: "For mountain views, many trekkers think so — Gokyo Ri (5,357 m) shows Everest, Lhotse, Makalu and Cho Oyu above turquoise lakes, with far fewer people. Base Camp wins on iconic significance. The two can be combined over the Cho La pass." },
      { question: "Is Everest Base Camp crowded?", answer: "In peak season (October–November, and April–May) yes — the trail between Namche and Tengboche is busy and lodges fill by mid-afternoon. Shoulder weeks in early March or late November are noticeably quieter." },
    ],
  },

  {
    slug: "can-anyone-trek-to-everest-base-camp",
    title: "Can Anyone Trek to Everest Base Camp? Who Can Do It and How to Prepare",
    metaTitle: "Can Anyone Hike to Everest Base Camp? Requirements & Training",
    metaDescription:
      "You do not need climbing experience to reach Everest Base Camp. Here is who can realistically do it, the fitness needed, and how much training it takes.",
    excerpt:
      "No climbing skill, no permit lottery, no minimum experience. Here's what you genuinely need — and how long to train for it.",
    bannerImage: img("1553913861-c0fddf2619ee"),
    bannerAlt: "A group of trekkers of mixed ages walking the Everest Base Camp trail",
    primaryKeywords: "can anyone hike everest base camp, can you visit everest base camp",
    secondaryKeywords:
      "can you hike everest base camp, how much training for everest base camp, do you need experience for everest base camp, everest base camp age limit, everest base camp training plan",
    entityTags: "Everest, Training, Fitness, Preparation, Permits",
    regionSlug: "everest",
    keyTakeaway:
      "Yes — anyone reasonably fit and healthy can trek to Everest Base Camp. No climbing experience or technical skill is required. The practical requirements are the ability to walk 5–7 hours a day for twelve days, roughly three months of training, and a licensed guide, which Nepal has required in national parks since 2023.",
    takeaways: [
      "No climbing or mountaineering experience needed",
      "Fitness benchmark: 6 hours walking on consecutive days",
      "Recommended training: about 12 weeks of hill walking with a loaded pack",
      "A licensed guide is legally required in Sagarmatha National Park",
      "Trekkers from teenagers to people in their 70s complete it every season",
      "Consult a doctor first if you have cardiac, respiratory or blood-pressure history",
    ].join("\n"),
    content: `## Quick answer

**Yes. Anyone reasonably fit and in good health can trek to Everest Base Camp.** It requires no climbing experience, no technical skill and no special equipment beyond good boots and warm layers. What it does require is the endurance to walk 5–7 hours a day for around twelve days, and the patience to go slowly at altitude.

## Who actually completes this trek

Every season we guide teenagers, people in their sixties and seventies, complete first-time trekkers, and people who had never seen a mountain before booking. It is not an elite undertaking.

What it is not suitable for, without medical advice first: anyone with significant heart or lung conditions, uncontrolled high blood pressure, or a history of severe altitude illness. Talk to a doctor before booking if any of those apply.

## What you genuinely need

| Requirement | Detail |
| --- | --- |
| Fitness | Walk 6 hrs on consecutive days |
| Experience | None required |
| Technical skill | None — no ropes or crampons |
| Guide | Legally required in the national park |
| Permits | Sagarmatha NP + Khumbu Rural Municipality (no TIMS) |
| Insurance | Must cover 6,000 m + helicopter evacuation |
| Time | 14 days trekking, ~16 total |

### The guide requirement

Since April 2023 Nepal has required trekkers in national park areas to be accompanied by a licensed guide, and the Khumbu is inside Sagarmatha National Park. Beyond the legal point, a guide books lodges before they fill in peak season, manages the permits, and monitors you for altitude symptoms — which is the part that matters most.

## How much training you actually need

**Give yourself twelve weeks.** Eight works. Four is tight but far better than nothing.

**Weeks 12–8: build the base.** Two or three walks a week, 60–90 minutes, some uphill, light daypack.

**Weeks 8–4: make it specific.** Two consecutive days each weekend, 3–5 hours each, pack loaded to 8–10 kg, on the most uneven ground you can find. **Wear the exact boots you will trek in** — this is when blisters reveal themselves, at home where fixing it is free.

**Weeks 4–1: taper and sort admin.** Stop building. Sort insurance, get documents to your operator, and see a doctor if you want to discuss acetazolamide.

### What training does not transfer

Flat running, cycling and gym machines build a useful base but prepare your feet, knees and shoulders far less well than hill walking with a pack. And nothing at home prepares you for altitude — that work is done on the mountain, which is exactly what the acclimatisation days are for.

## Options that make it more accessible

- **Hire a porter.** Carrying 5 kg instead of 15 kg transforms the trek, and it is the single best money you can spend.
- **Take the helicopter return.** The [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) removes the entire descent — worth considering if knees are your weak point.
- **Trek more comfortably.** The [Everest Base Camp Luxury Trek](${EBC_LUXURY}) uses heated, better-equipped lodges, so you recover properly overnight. The walking is identical; the recovery is not.

## Find out whether it is right for you

Most people asking whether they can do this trek are more capable than they think. It is a long walk, not a climb.

Tell us honestly about your fitness and any health history, and we will give you a straight answer rather than a sales pitch — then build a [classic Everest Base Camp Trek](${EBC_TREK}) itinerary around what you can realistically manage.`,
    faqs: [
      { question: "Do you need experience to trek to Everest Base Camp?", answer: "No previous trekking or climbing experience is required. The route is a walking trail with no technical sections. What matters is general endurance — being able to walk five to seven hours a day for around twelve days." },
      { question: "How long should I train for Everest Base Camp?", answer: "Around twelve weeks is ideal, with eight workable and four tight but better than nothing. Focus on hill walking with a loaded daypack on consecutive days, rather than gym cardio or flat running." },
      { question: "Is there an age limit for the Everest Base Camp trek?", answer: "There is no formal upper age limit, and people in their sixties and seventies complete it every season. Most operators set a practical minimum around 10–12 years old. Anyone with cardiac, respiratory or blood-pressure history should get medical clearance first." },
      { question: "Can you trek to Everest Base Camp without a guide?", answer: "No. Since April 2023 Nepal requires a licensed guide for trekking in national park areas, which includes Sagarmatha National Park where the route lies." },
    ],
  },

  {
    slug: "when-to-trek-to-everest-base-camp",
    title: "When to Trek to Everest Base Camp: Best Months and Seasons Compared",
    metaTitle: "Best Time to Trek Everest Base Camp — Season by Season",
    metaDescription:
      "The best time to trek Everest Base Camp is October–November or March–May. Here is what each season delivers, and which months to avoid entirely.",
    excerpt:
      "Two good seasons, two you should avoid, and a couple of shoulder weeks that quietly offer the best of both.",
    bannerImage: img("1533130061792-64b345e4a833"),
    bannerAlt: "Clear autumn skies over the Everest range in Nepal",
    primaryKeywords: "when to hike everest base camp, best time everest base camp",
    secondaryKeywords:
      "when to do everest base camp, when is everest base camp season, when everest base camp, best month for everest base camp trek",
    entityTags: "Everest, Season, Weather, Monsoon, Lukla",
    regionSlug: "everest",
    keyTakeaway:
      "The two best windows are late September to November and March to May. Autumn has the clearest skies and most stable weather; spring is warmer with rhododendron in bloom and the climbing season at Base Camp. Avoid the June–August monsoon and the deep cold of January–February.",
    takeaways: [
      "Best overall: October and November — clearest views, stable weather",
      "Second best: March–May — warmer, rhododendrons, expedition tents at Base Camp",
      "Avoid: June–August monsoon — cloud, rain, frequent flight cancellations",
      "Hard: December–February — trekkable but very cold, some lodges shut",
      "Quietest good weeks: early March and late November",
      "Book 2–3 months ahead for October and November departures",
    ].join("\n"),
    content: `## Quick answer

**October and November are the best months to trek to Everest Base Camp**, with March to May a close second. Autumn delivers the clearest mountain views and the most reliable flights; spring is warmer and puts the Base Camp expedition tent city on display. Avoid the monsoon from June to August.

## Season by season

| Season | Months | Conditions |
| --- | --- | --- |
| **Autumn** | Late Sep–Nov | Clear skies, stable, busy |
| **Spring** | Mar–May | Warmer, hazier, climbing season |
| **Winter** | Dec–Feb | Cold, quiet, some lodges closed |
| **Monsoon** | Jun–Aug | Cloud, rain, cancellations |

### Autumn — the reliable choice

Post-monsoon air is scrubbed clean, which is why the sharpest Everest photographs are taken in October and November. Temperatures are cold but manageable, trails have dried out, and Lukla flights run more reliably than at any other time.

The trade-off is company. October is the busiest month on the trail, lodges fill by mid-afternoon, and you will share Kala Patthar at dawn.

### Spring — warmer, and Base Camp comes alive

March to May is genuinely the second-best window, not a distant runner-up. It is noticeably warmer, rhododendron forest blooms below Tengboche, and — uniquely — this is the Everest climbing season, so Base Camp holds the full expedition tent city.

The trade-off is haze. Pre-monsoon dust softens the long views compared with autumn's clarity.

### Winter — cold, empty, doable

The trail stays open and the views are often superb, but nights at Gorak Shep can hit −20°C and some high lodges close. For experienced cold-weather trekkers who want solitude, it is a real option.

### Monsoon — avoid

Persistent cloud hides the mountains, trails are wet, leeches appear lower down, and Lukla flights are cancelled constantly. There is little upside.

## The weeks most people miss

**Early March** and **late November** sit at the edges of the good seasons: conditions are still solid, but the crowds have not arrived or have already left. If you can be flexible, these are the best value weeks on the calendar.

## Practical booking advice

- **Book October–November two to three months out.** Lodges and flights genuinely fill.
- **Build in a buffer day** whatever the season — Lukla weather does not read the calendar.
- **Peak season may fly from Ramechhap** rather than Kathmandu, adding a four-hour pre-dawn drive.
- **Winter needs warmer kit** than the standard packing list assumes — a −20°C bag, not −10°C.
- **Check the cost implications**, as peak-season pricing differs; our [cost breakdown](${EBC_COST}) covers what changes.

## Pick your window and go

The trek runs well in two long seasons, and the difference between them is preference rather than quality — clarity and crowds in autumn, warmth and colour in spring.

Tell us when you can travel and we will tell you honestly what the conditions will be like. We run [Everest Base Camp Trek](${EBC_TREK}) departures throughout both seasons, and the [helicopter return option](${EBC_HELI}) is particularly useful in peak weeks when the descent trail is busiest.`,
    faqs: [
      { question: "What is the best month to trek to Everest Base Camp?", answer: "October and November offer the clearest views and most stable weather, with the most reliable Lukla flights. April is the strongest spring month — warmer, with the Base Camp climbing season underway." },
      { question: "Can you trek to Everest Base Camp in winter?", answer: "Yes, and the views are often excellent, but nights at Gorak Shep can reach −20°C and some high-altitude lodges close for the season. It suits experienced cold-weather trekkers who value solitude." },
      { question: "Why should you avoid the monsoon for Everest Base Camp?", answer: "From June to August, persistent cloud obscures the mountains, trails are wet, leeches appear at lower elevations, and Lukla flights are cancelled frequently. There is little to gain from trekking then." },
      { question: "When is Everest Base Camp least crowded?", answer: "Early March and late November — the shoulder weeks either side of peak season, when conditions are still good but the trail is markedly quieter. Winter is quieter still, at the cost of severe cold." },
    ],
  },

  {
    slug: "how-cold-is-everest-base-camp",
    title: "How Cold Is Everest Base Camp? Temperatures by Month and Altitude",
    metaTitle: "How Cold Is Everest Base Camp? Temperatures by Month",
    metaDescription:
      "Everest Base Camp ranges from about −6°C at night in spring to below −20°C in winter. Full temperature guide by month, altitude and time of day.",
    excerpt:
      "Daytime in the sun can feel pleasant. The moment it drops behind a ridge, the temperature falls off a cliff — and that gap catches people out.",
    bannerImage: img("1519904981063-b0cf448d479e"),
    bannerAlt: "Frozen high-altitude terrain near Gorak Shep in the Everest region",
    primaryKeywords: "how cold is everest base camp, everest base camp temperature",
    secondaryKeywords:
      "what temperature is everest base camp, everest base camp temperature by month, how cold everest base camp at night, gorak shep temperature",
    entityTags: "Everest, Temperature, Weather, Gorak Shep, Season",
    regionSlug: "everest",
    keyTakeaway:
      "Everest Base Camp typically ranges from around 4°C in the day to −6°C at night in peak trekking season, dropping below −20°C at night in winter. The daily swing is extreme — sunny afternoons can feel mild, then temperatures plummet the moment the sun goes behind a ridge.",
    takeaways: [
      "Peak season (Oct–Nov, Mar–May): roughly 4°C day, −6°C to −14°C night",
      "Winter (Dec–Feb): often below −20°C at night at Gorak Shep",
      "The daily swing can exceed 20°C between afternoon and night",
      "Lodges are unheated except the shared dining room",
      "Sleeping bag rated −10°C minimum, −20°C for winter",
      "Wind chill on Kala Patthar at dawn is the coldest moment of the trek",
    ].join("\n"),
    content: `## Quick answer

**In peak trekking season, Everest Base Camp sits around 4°C during the day and −6°C to −14°C at night.** In winter, night temperatures at nearby Gorak Shep regularly fall below −20°C. The daily swing is severe: a sunny afternoon can feel genuinely mild, then drop more than 20°C once the sun goes behind a ridge.

## Temperatures by altitude

| Location | Altitude | Day | Night (peak season) |
| --- | --- | --- | --- |
| Lukla | 2,860 m | 10–17°C | 2–6°C |
| Namche Bazaar | 3,440 m | 7–14°C | −3 to 4°C |
| Dingboche | 4,410 m | 5–12°C | −8 to 0°C |
| Lobuche | 4,940 m | 2–9°C | −12 to −4°C |
| Gorak Shep | 5,164 m | 0–7°C | −16 to −6°C |
| **Base Camp** | 5,364 m | −2 to 5°C | −18 to −6°C |

Winter subtracts roughly another 8–10°C from the night figures.

## The thing that catches people out

It is not the absolute cold — it is the **swing**. Walking uphill in direct sun at 4,500 m, you may be in a base layer and comfortable. Twenty minutes later the sun drops behind a ridge and it is below freezing.

This is why layering matters more than one heavy jacket. You will add and remove layers repeatedly every single day.

### The coldest moment of the trek

The 4am start for Kala Patthar. You are at 5,545 m, before sunrise, usually with wind, and you have been standing still taking photographs. Add wind chill and it can feel like −25°C or worse. Every experienced trekker overdresses for that specific hour.

## What this means for lodges

Teahouse rooms are **unheated**. The shared dining room usually has a yak-dung stove lit in the evening, and that is the only warm space in the building. Rooms at Gorak Shep will be below freezing overnight.

This is why your sleeping bag rating matters more than almost any other piece of kit:

- **Peak season:** rated to at least −10°C
- **Winter:** rated to −20°C
- A silk or fleece liner adds several degrees cheaply

If cold nights are your main concern, the [Everest Base Camp Luxury Trek](${EBC_LUXURY}) uses lodges with heated rooms at the higher stops, which makes a substantial difference to how well you sleep and recover.

## Practical advice for the cold

- **Layer, do not bulk.** Base layer, fleece or light down, windproof shell.
- **A down jacket for evenings**, even in peak season — you will live in it after 4pm.
- **Sleep with tomorrow's clothes in your bag**, so you are not dressing in frozen layers.
- **A hot water bottle** — most lodges fill one for a small fee. Transformative at Gorak Shep.
- **Keep batteries warm.** Phone and camera batteries drain rapidly in the cold; sleep with them.
- **Insulated gloves and a warm hat for Kala Patthar.** Thin liner gloves are not enough at dawn.

## Trek prepared for the temperatures

The cold on this trek is entirely manageable with the right kit — and genuinely unpleasant without it. Most of what people suffer from is avoidable with a warmer sleeping bag and a proper down jacket.

We send every booking a season-specific kit list before departure, and our guides check gear in Kathmandu before you fly. Book the [classic Everest Base Camp Trek](${EBC_TREK}) and we will make sure you are not the person shivering at Gorak Shep.`,
    faqs: [
      { question: "How cold does Everest Base Camp get at night?", answer: "In peak trekking season, roughly −6°C to −14°C at night, and colder at nearby Gorak Shep where you actually sleep. In winter, night temperatures regularly drop below −20°C." },
      { question: "What sleeping bag do I need for Everest Base Camp?", answer: "A bag rated to at least −10°C for peak season, and −20°C for winter treks. Lodge rooms are unheated, so blankets alone are not sufficient above about 4,000 m. A liner adds a few degrees cheaply." },
      { question: "Is Everest Base Camp cold during the day?", answer: "In direct sun it can feel mild — often 0–5°C at Base Camp and warm enough for a base layer while walking uphill. The temperature drops sharply the moment the sun goes behind a ridge, which is why layering matters." },
      { question: "What is the coldest part of the Everest Base Camp trek?", answer: "The pre-dawn climb of Kala Patthar (5,545 m), typically starting around 4am. With wind chill and standing still for photographs, it can feel close to −25°C." },
    ],
  },

  {
    slug: "what-boots-for-everest-base-camp",
    title: "What Boots and Shoes for Everest Base Camp? A Practical Footwear Guide",
    metaTitle: "What Boots for Everest Base Camp? Footwear Guide & Advice",
    metaDescription:
      "You need broken-in, waterproof, above-the-ankle trekking boots for Everest Base Camp. Here is what to look for, what to avoid, and what else to pack.",
    excerpt:
      "The single most important item you'll carry, and the one people most often get wrong. New boots on day one is how treks get ruined.",
    bannerImage: img("1454391304352-2bf4678b1a7a"),
    bannerAlt: "Trekking boots on a rocky trail in the Everest region",
    primaryKeywords: "what boots for everest base camp, what shoes for everest base camp",
    secondaryKeywords:
      "best boots for everest base camp trek, everest base camp footwear, do i need mountaineering boots for everest base camp, everest base camp packing boots",
    entityTags: "Everest, Gear, Boots, Footwear, Packing",
    regionSlug: "everest",
    keyTakeaway:
      "You need waterproof trekking boots with ankle support, broken in over at least six substantial walks before you fly. Mountaineering boots and crampons are not required — the route is a walking trail. Pack camp shoes for the evenings and bring more socks than you think you need.",
    takeaways: [
      "Boot type: waterproof, above-the-ankle trekking boots with a stiff-ish sole",
      "Mountaineering boots and crampons are NOT needed",
      "Break them in over at least 6 substantial walks beforehand",
      "Half a size up to allow for foot swelling and thicker socks",
      "Bring camp shoes or trainers for evenings in the lodge",
      "Blister care kit is genuinely essential, not optional",
    ].join("\n"),
    content: `## Quick answer

**Waterproof trekking boots with above-the-ankle support, thoroughly broken in.** You do not need mountaineering boots, crampons or anything technical — Everest Base Camp is a walking trail. The single biggest mistake is arriving in new boots.

## What to look for

**Above the ankle.** The trail is uneven stone, glacial moraine and loose rock. Ankle support prevents the most common injury on this trek.

**Waterproof.** Gore-Tex or equivalent. You will cross streams, walk through snow patches higher up, and hit unexpected weather.

**A moderately stiff sole.** Soft trail-runner soles get punishing on sharp moraine after several hours. You want some rigidity underfoot without a full mountaineering shank.

**Half a size up.** Feet swell at altitude and over consecutive long days, and you will wear thicker socks than usual. Boots that fit perfectly in the shop can feel a size too small by day eight.

### What you do not need

- **Mountaineering boots** — overkill, heavy, and unnecessary for a trekking route
- **Crampons** — the standard route does not require them
- **Brand-new anything** — see below

## Breaking them in — the part people skip

**Wear your boots on at least six substantial walks before you fly.** Not around the house — proper walks, several hours, on uneven ground, with the socks you will actually trek in.

This is where hot spots, pressure points and a poor fit reveal themselves. Finding that out at home costs you nothing. Finding it out on day two above Phakding, with ten days still to walk, can genuinely end your trek.

Every season we meet someone whose boots were bought the week before. It is the most avoidable problem on the mountain.

## Socks matter more than people expect

- **Merino wool or synthetic**, never cotton — cotton holds moisture and causes blisters
- **Bring 4–5 pairs.** Washing and drying at altitude is slow and unreliable
- **Consider a thin liner sock** under a thicker trekking sock to reduce friction
- **Change them mid-day** on long stages; dry socks prevent more blisters than anything else

## The rest of your footwear kit

| Item | Why |
| --- | --- |
| Camp shoes / trainers | Lodge evenings — your feet need out of boots |
| Gaiters | Optional; useful in snow above Lobuche |
| Blister kit | Compeed, tape, scissors — genuinely essential |
| Microspikes | Only if trekking in winter or heavy snow conditions |

## Practical footwear advice on the trail

- **Lace tighter for descents.** Toes slamming into the boot front on the drop from Kala Patthar is what costs people toenails.
- **Dry boots overnight** near the dining-room stove — never directly against it, which cracks leather.
- **Treat hot spots immediately.** Tape the moment you feel one; a five-minute stop prevents a five-day problem.
- **Trekking poles reduce foot load** significantly on descents.
- **You can buy or hire gear in Kathmandu** if you have missed something — Thamel is well stocked and inexpensive.

## Get your kit checked before you fly

We send every booking a full season-specific kit list, and our guides run a gear check in Kathmandu before departure — including boots. If something is not right, there is time to sort it in Thamel rather than discovering the problem at 4,500 m.

Book the [classic Everest Base Camp Trek](${EBC_TREK}) with us, or if you would rather trek with lighter luggage and better lodge comfort, ask about the [Everest Base Camp Luxury Trek](${EBC_LUXURY}).`,
    faqs: [
      { question: "Do I need mountaineering boots for Everest Base Camp?", answer: "No. Everest Base Camp is a trekking route with no technical climbing, so waterproof above-the-ankle trekking boots are correct. Mountaineering boots are heavier, stiffer and unnecessary." },
      { question: "Can I wear trail runners for the Everest Base Camp trek?", answer: "Some experienced trekkers do, but we would not recommend it for most people. The terrain is sharp glacial moraine and uneven stone, where ankle support and a stiffer sole reduce both injury risk and foot fatigue considerably." },
      { question: "How long do I need to break in boots for Everest Base Camp?", answer: "At least six substantial walks of several hours each, on uneven ground, wearing your trekking socks. Starting a month before departure is sensible. New boots on day one is the most common avoidable mistake on this trek." },
      { question: "How many pairs of socks should I bring to Everest Base Camp?", answer: "Four or five pairs of merino wool or synthetic socks — never cotton. Drying laundry at altitude is slow and unreliable, and changing into dry socks mid-day is one of the most effective ways to prevent blisters." },
    ],
  },

  {
    slug: "which-airport-for-everest-base-camp",
    title: "Which Airport for Everest Base Camp? Lukla, Kathmandu and Ramechhap Explained",
    metaTitle: "Which Airport for Everest Base Camp? Lukla & Kathmandu Guide",
    metaDescription:
      "Fly into Kathmandu (KTM), then take a mountain flight to Lukla to start the Everest Base Camp trek. Here is how the connection works and why Ramechhap matters.",
    excerpt:
      "Two airports, sometimes three — and the one nobody tells you about until you're being collected from your hotel at 1am.",
    bannerImage: img("1571401835393-8c5f35328320"),
    bannerAlt: "Small aircraft at Lukla's Tenzing-Hillary Airport in Nepal",
    primaryKeywords: "which airport for everest base camp, what airport for everest base camp",
    secondaryKeywords:
      "lukla airport everest base camp, how to get to everest base camp from kathmandu, ramechhap airport lukla flights, nearest airport to everest base camp",
    entityTags: "Everest, Lukla, Kathmandu, Ramechhap, Logistics",
    regionSlug: "everest",
    keyTakeaway:
      "Fly internationally into Kathmandu (KTM), then take a 35-minute mountain flight to Lukla (LUA), the trailhead at 2,860 m. In peak season those Lukla flights often depart from Ramechhap instead, a four-hour drive from Kathmandu — plan for it.",
    takeaways: [
      "International arrival: Tribhuvan International, Kathmandu (KTM)",
      "Trailhead airport: Tenzing-Hillary Airport, Lukla (LUA), 2,860 m",
      "Flight time Kathmandu → Lukla: about 35 minutes",
      "Peak season flights often shift to Ramechhap (Manthali), 4 hrs by road",
      "Baggage limit on Lukla flights: usually 15 kg total",
      "Weather cancellations are common — build in a buffer day",
    ].join("\n"),
    content: `## Quick answer

**Fly into Kathmandu (KTM) internationally, then take a short mountain flight to Lukla (LUA)** — Tenzing-Hillary Airport at 2,860 m, where the trek begins. The flight takes about 35 minutes. In peak season, Lukla flights frequently operate from Ramechhap instead, which adds a four-hour road transfer.

## The three airports involved

| Airport | Code | Role |
| --- | --- | --- |
| Tribhuvan International, Kathmandu | KTM | Your international arrival |
| Tenzing-Hillary, Lukla | LUA | The trailhead, 2,860 m |
| Ramechhap (Manthali) | RHP | Peak-season departure point for Lukla |

### Kathmandu (KTM)

Nepal's only international airport and where every trek begins. Most itineraries include a night here before flying onward, which is sensible — it gives your operator time for a gear check and permit paperwork.

### Lukla (LUA)

Famous, and slightly notorious. The runway is short and built on a slope, ending against a mountainside. It is also flown daily by pilots with hundreds of landings there. The far more relevant issue is not safety but **weather cancellations**, which are routine.

### Ramechhap — the one nobody mentions

During the busiest weeks of spring and autumn, Kathmandu's airspace is too congested for Lukla flights, so they shift to **Ramechhap (Manthali)**, about four hours east of Kathmandu by road.

In practice this means a **1am hotel pickup**, a long pre-dawn drive, then the flight. It is entirely normal and well-organised, but it surprises trekkers who have not been told. Ask your operator directly which airport your flight departs from.

## Baggage limits

Lukla flights are strict: **usually 15 kg total** — around 10 kg checked plus 5 kg hand luggage. This is not negotiable on small aircraft at altitude.

Most operators, including us, store your extra luggage free of charge at your Kathmandu hotel while you trek. Pack for the mountain, leave the rest behind.

## Why you need a buffer day

Lukla flights are cancelled for weather regularly — sometimes for consecutive days. This is the single most common disruption on the whole trip.

Build **at least one buffer day** into your schedule at the end, and do not book an international flight home for the day after your scheduled Lukla return. An extra night in Kathmandu is inexpensive; rebooking a long-haul ticket is not.

### The alternative to flying out

If a cancelled return flight would be genuinely costly for you, the [Everest Base Camp Helicopter Return Trek](${EBC_HELI}) flies you directly from Gorak Shep. Helicopters operate in a wider weather window than fixed-wing aircraft, so it removes much of the uncertainty at the end of the trek — along with three days of walking.

## Practical airport advice

- **Confirm your departure airport 48 hours ahead** — Kathmandu or Ramechhap.
- **Fly in the morning.** Khumbu weather deteriorates through the day; almost all Lukla flights are early.
- **Keep essentials in hand luggage** — medication, documents, a warm layer.
- **Allow 2 nights in Kathmandu on arrival** if your international flight is tight, in case of baggage delays.
- **Budget for the possibility of a helicopter transfer** if flights are backed up; costs are covered in our [EBC cost guide](${EBC_COST}).

## Let us handle the logistics

Lukla flights, Ramechhap transfers, baggage limits and weather contingencies are exactly the kind of thing that is stressful to manage alone and routine for an operator who does it weekly.

Book the [classic Everest Base Camp Trek](${EBC_TREK}) and we handle every connection from your Kathmandu arrival to the moment you fly home.`,
    faqs: [
      { question: "What is the nearest airport to Everest Base Camp?", answer: "Tenzing-Hillary Airport in Lukla (LUA), at 2,860 m — the trailhead where the trek begins. It is roughly a 35-minute flight from Kathmandu, and there is no road connection beyond it." },
      { question: "Why do Everest flights sometimes leave from Ramechhap?", answer: "During peak trekking season, Kathmandu's airspace becomes too congested, so Lukla flights are moved to Ramechhap (Manthali) about four hours east by road. It usually means a very early morning hotel pickup — normal, but worth knowing in advance." },
      { question: "What is the baggage limit for the flight to Lukla?", answer: "Usually 15 kg in total — around 10 kg checked and 5 kg hand luggage. Most operators store your remaining luggage at your Kathmandu hotel free of charge while you trek." },
      { question: "What happens if my Lukla flight is cancelled?", answer: "Cancellations are common and weather-driven. Your operator rebooks you on the next available flight, which is why a buffer day at the end of your itinerary matters. Helicopter transfers are sometimes arranged when fixed-wing flights are backed up." },
    ],
  },

  {
    slug: "how-far-is-everest-base-camp-from-the-summit",
    title: "How Far Is Everest Base Camp from the Summit? Distance, Height and Time",
    metaTitle: "How Far Is Everest Base Camp from the Summit? Distance & Time",
    metaDescription:
      "Everest Base Camp sits 3,485 m below the summit, and climbers take 6–9 weeks to cover it. Here is the distance, the camps between, and why trekkers stop.",
    excerpt:
      "About 3.5 vertical kilometres, four high camps, and roughly two months. Base Camp is where the mountain starts, not where it ends.",
    bannerImage: img("1486911278844-a81c5267e227"),
    bannerAlt: "Everest's summit pyramid seen above the Khumbu valley",
    primaryKeywords: "how far from everest base camp to summit",
    secondaryKeywords:
      "how long everest base camp to summit, how many miles everest base camp to summit, how long from everest base camp to peak, is everest base camp the top, everest camps 1 2 3 4",
    entityTags: "Everest, Summit, Camps, Khumbu Icefall, Climbing",
    regionSlug: "everest",
    keyTakeaway:
      "Everest Base Camp (5,364 m) sits 3,485 vertical metres below the 8,849 m summit — roughly 19 km of climbing route through four high camps. Climbers typically take 6–9 weeks from arriving at Base Camp to summiting, most of it acclimatising.",
    takeaways: [
      "Base Camp: 5,364 m — Summit: 8,849 m",
      "Vertical difference: 3,485 m",
      "Route distance: roughly 19 km of technical climbing",
      "Four high camps: C1 6,065 m, C2 6,400 m, C3 7,200 m, C4 7,950 m",
      "Time from Base Camp to summit: 6–9 weeks including acclimatisation rotations",
      "Trekkers stop at Base Camp — above it is technical mountaineering",
    ].join("\n"),
    content: `## Quick answer

**Everest Base Camp sits 3,485 vertical metres below the summit** — 5,364 m against 8,849 m. The climbing route between them covers roughly 19 km through four high camps, and climbers typically need **6 to 9 weeks** from arriving at Base Camp to standing on top, most of it spent acclimatising rather than climbing.

## Base Camp is not the top

Worth stating plainly, because it is a genuine misconception: **Everest Base Camp is not the summit, and not close to it.** It is where the mountaineering begins. Trekkers reach Base Camp and turn around; everything above is technical climbing requiring ropes, oxygen and years of experience.

## The camps above Base Camp

| Camp | Altitude | Notes |
| --- | --- | --- |
| Base Camp | 5,364 m | Where trekkers stop |
| Camp 1 | 6,065 m | Above the Khumbu Icefall |
| Camp 2 | 6,400 m | Western Cwm — advanced base |
| Camp 3 | 7,200 m | Lhotse Face, fixed ropes |
| Camp 4 | 7,950 m | South Col — the "death zone" |
| **Summit** | **8,849 m** | |

Camp 4 at 7,950 m sits inside what climbers call the death zone, where the body cannot acclimatise and deteriorates continuously. Summit day usually begins there around 10pm, taking 8–12 hours up and a similar time back.

### Why it takes weeks, not days

Climbers do not walk from Base Camp to the summit in one go. They make repeated **acclimatisation rotations** — up to Camp 2, back to Base Camp, up to Camp 3, back down — allowing the body to adapt. Then they wait, sometimes for weeks, for a weather window.

The actual summit push from Base Camp takes about 4–5 days. Everything before it is preparation.

## The Khumbu Icefall

Immediately above Base Camp lies the most dangerous section of the entire route: a collapsing, shifting river of ice blocks that must be crossed on ladders and ropes. It is responsible for a large share of Everest fatalities.

**Trekkers never enter it.** Base Camp sits at its foot, and the trekking route goes no further. This is exactly why Everest's climbing danger statistics do not apply to the [classic Everest Base Camp Trek](${EBC_TREK}) — different terrain, different activity, different risk entirely.

## What trekkers see instead

From Base Camp you look up at the icefall and, if the season is right, the tents of expeditions preparing to enter it. What you cannot see is the summit — Nuptse and Everest's west shoulder block it.

That view comes from **Kala Patthar** at 5,545 m the following morning, which reveals the full summit pyramid, 3,304 m above you.

For an even wider perspective on the whole massif, the [Gokyo Ri Trek](${GOKYO}) reaches 5,357 m on the other side of the Khumbu and shows Everest, Lhotse, Makalu and Cho Oyu together in one panorama.

## Practical perspective for trekkers

- **Base Camp is the achievement**, not a consolation prize — reaching 5,364 m on foot is significant.
- **Do not skip Kala Patthar.** It is the only place on the trek where you see the summit.
- **Visit in spring** (April–May) if you want to see the expedition tent city at its fullest.
- **Ask your guide about the icefall.** Sherpa guides have often worked on the mountain and the stories are extraordinary.

## Stand where the climb begins

You do not need to be a mountaineer to reach the foot of the world's highest mountain — just fit enough to walk for a fortnight.

We run the [Everest Base Camp Trek](${EBC_TREK}) with Kala Patthar included, guided by Sherpas from the Khumbu, many with expedition experience on the mountain itself. Get in touch and we will build the itinerary around your dates.`,
    faqs: [
      { question: "How far is Everest Base Camp from the summit?", answer: "About 3,485 vertical metres — Base Camp is at 5,364 m and the summit at 8,849 m. The climbing route covers roughly 19 km through four high camps." },
      { question: "How long does it take to climb from Everest Base Camp to the summit?", answer: "Typically 6–9 weeks from arriving at Base Camp, most of it spent on acclimatisation rotations and waiting for a weather window. The final summit push itself takes about 4–5 days." },
      { question: "Is Everest Base Camp the top of Everest?", answer: "No. Base Camp is at 5,364 m, roughly 3.5 vertical kilometres below the 8,849 m summit. It is where climbing expeditions begin, and where the trekking route ends." },
      { question: "How many camps are there on Everest above Base Camp?", answer: "Four — Camp 1 at 6,065 m, Camp 2 at 6,400 m, Camp 3 at 7,200 m and Camp 4 at 7,950 m on the South Col, which sits inside the death zone." },
    ],
  },

  {
    slug: "what-is-everest-base-camp",
    title: "What Is Everest Base Camp? What It Is, Who Stays There and Why It Exists",
    metaTitle: "What Is Everest Base Camp? Purpose, People & What's There",
    metaDescription:
      "Everest Base Camp is the staging point for summit expeditions at 5,364 m. Here is what is actually there, who stays, and why trekkers visit.",
    excerpt:
      "A rocky glacial moraine that becomes a small town for two months a year, then empties completely. Here's what it actually is.",
    bannerImage: img("1544735716-392fe2489ffa"),
    bannerAlt: "Expedition tents at Everest Base Camp during the climbing season",
    primaryKeywords: "what is everest base camp",
    secondaryKeywords:
      "whats everest base camp, does anyone live at everest base camp, how many people everest base camp, everest base camp explained, what happens at everest base camp",
    entityTags: "Everest, Base Camp, Khumbu Glacier, Expeditions, Sherpa",
    regionSlug: "everest",
    keyTakeaway:
      "Everest Base Camp is the staging point for summit expeditions, at 5,364 m on the Khumbu Glacier in Nepal. Nobody lives there permanently — it becomes a temporary tent city of around 1,000 climbers and staff during the spring climbing season, then is dismantled completely.",
    takeaways: [
      "A temporary camp at 5,364 m on the Khumbu Glacier, not a permanent settlement",
      "Population in spring season: roughly 1,000 climbers, guides and support staff",
      "Empty for most of the year — everything is dismantled and removed",
      "Sits directly at the foot of the Khumbu Icefall",
      "Trekkers visit for a few hours; nobody sleeps there without an expedition",
      "Nearest overnight lodging: Gorak Shep, 5,164 m, about 2 hours away",
    ].join("\n"),
    content: `## Quick answer

**Everest Base Camp is the staging point for expeditions climbing Everest**, sitting at 5,364 m on the Khumbu Glacier in Nepal. It is not a village or a permanent settlement — it is a temporary tent city that appears for the spring climbing season, houses around a thousand people, and is then dismantled entirely.

## What is actually there

For most of the year: **nothing**. A wide expanse of rock, ice and glacial debris marked by prayer flags and a boulder that trekkers photograph.

During the spring climbing season (roughly April–May) it transforms into a working settlement:

- **Sleeping tents** for climbers and Sherpa staff
- **Dining and communication tents** for each expedition
- **Medical facilities** — several expeditions run doctors, and Everest ER operates seasonally
- **Solar power and satellite internet**
- **Helicopter landing areas** for supply runs and evacuations

Everything sits directly on a moving glacier, which means the camp shifts and has to be re-levelled as the ice beneath it flows.

## Does anyone live at Everest Base Camp?

**No — not permanently.** The altitude makes it impossible to live there long-term; the human body deteriorates continuously above roughly 5,500 m and cannot fully acclimatise.

During the season, climbers and Sherpa staff stay for **6–9 weeks**, using it as a base between acclimatisation rotations higher on the mountain. Outside the season it is completely empty. The nearest permanent settlement with lodging is **Gorak Shep** at 5,164 m, about two hours' walk away, where trekkers actually sleep.

## Why it exists where it does

Base Camp sits at the foot of the **Khumbu Icefall**, the first and most dangerous obstacle on the south route. Its position is a compromise: high enough that climbers begin acclimatised, low enough that recovery is possible, and directly beneath the route's entry point.

Everything above — Camps 1 through 4, and the summit at 8,849 m — is technical mountaineering. Base Camp is where trekking ends and climbing begins.

## Why trekkers go

You are not going for the scenery — Base Camp is rocky moraine, and Everest's summit is not even visible from it. You go for what it represents: the foot of the world's highest mountain, and the point from which every summit attempt has started since 1953.

Trekkers spend an hour or two there, take photographs, then walk back to Gorak Shep to sleep. The [classic Everest Base Camp Trek](${EBC_TREK}) then climbs Kala Patthar (5,545 m) the following dawn, which is where the actual view of the summit is.

If sweeping mountain views are your priority more than the destination itself, the [Gokyo Lakes trekking route](${GOKYO}) delivers a more spectacular panorama with far fewer people.

## Practical notes for visiting

- **You cannot stay overnight** unless you are with a climbing expedition. Trekkers sleep at Gorak Shep.
- **Visit in spring** to see the full tent city; in autumn it is largely empty.
- **Respect the expeditions.** These are working camps, not exhibits — do not enter tents or areas uninvited.
- **The Base Camp "sign"** is an informally maintained rock, not an official marker, and it moves.
- **Allow 3–4 hours** round trip from Gorak Shep over rough moraine.

## See it for yourself

Everest Base Camp is a strange, temporary, remarkable place — a town that exists for two months a year at an altitude where nobody can permanently live.

We run the [Everest Base Camp Trek](${EBC_TREK}) with Sherpa guides from the Khumbu, many of whom have worked on the mountain itself. If you would rather fly out afterwards than walk the whole way back, ask about the [helicopter return option](${EBC_HELI}).`,
    faqs: [
      { question: "Does anyone live at Everest Base Camp?", answer: "Not permanently. The altitude makes long-term habitation impossible. During the spring climbing season it houses around 1,000 climbers and support staff for 6–9 weeks, and is then dismantled completely." },
      { question: "How many people are at Everest Base Camp?", answer: "Roughly 1,000 during the peak spring climbing season, including climbers, Sherpa staff, cooks, doctors and liaison officers. Outside the season it is essentially empty." },
      { question: "Can you sleep at Everest Base Camp?", answer: "Not as a trekker. There is no lodging there — accommodation is expedition tents only. Trekkers sleep at Gorak Shep (5,164 m), about two hours away, and visit Base Camp as a day trip." },
      { question: "What is the purpose of Everest Base Camp?", answer: "It is the staging point for summit expeditions — where climbers acclimatise, store equipment and wait for weather windows before moving up through Camps 1 to 4. It sits directly at the foot of the Khumbu Icefall, the route's first major obstacle." },
    ],
  },
];
