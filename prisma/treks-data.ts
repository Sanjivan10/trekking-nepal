/**
 * Priority treks — specs, pricing and itineraries are exact carbon copies of
 * beyondthelimitstreks.com. Do not "tidy" any number in here.
 *
 * priority: 1 = EBC, 2 = Manaslu, 3 = Annapurna Circuit. Everything else is
 * demoted to 50+ so it sits below the fold.
 */

export type Tier = { label: string; price: number; note?: string };
export type DaySpec = {
  title: string;
  description: string;
  altitude?: string;
  distance?: string;
  duration?: string;
  accommodation?: string;
};

export const priorityTreks = [
  /* ------------------------------------------------------------------ */
  /* 1 — EVEREST BASE CAMP TREK                                          */
  /* ------------------------------------------------------------------ */
  {
    priority: 1,
    slug: "everest-base-camp-trek",
    regionSlug: "everest",
    title: "Everest Base Camp Trek",
    metaTitle: "Everest Base Camp Trek — 14 Days, US$1,199 | Real Prices",
    metaDescription:
      "14-day Everest Base Camp Trek from US$1,199. Exact group pricing, the full day-by-day itinerary, Kala Patthar at 5,545m, and honest advice about the Lukla flight.",
    keywords:
      "everest base camp trek, ebc trek 14 days, everest base camp cost, kala patthar, lukla flight, everest base camp itinerary",
    entityTags: "Everest, Khumbu, Kala Patthar, Namche Bazaar, Lukla, Tengboche, Permits",
    durationDays: 14,
    durationNights: 13,
    difficulty: "Moderate-Strenuous",
    maxAltitude: "5,545 m (Kala Patthar)",
    groupSize: "1-12 Pax",
    startPoint: "Kathmandu",
    endPoint: "Kathmandu",
    bestSeason: "March–May, September–November",
    accommodation: "Teahouse / lodge",
    transportation: "Round-trip mountain flight Kathmandu–Lukla",
    priceFrom: 1199,
    priceRegular: 1650,
    currency: "USD",
    tiers: [
      { label: "1 pax", price: 1499, note: "US$1,599 single package option" },
      { label: "2 - 5 pax", price: 1299 },
      { label: "6 - 9 pax", price: 1250 },
      { label: "10 - 12 pax", price: 1199 },
    ] as Tier[],
    heroImage:
      "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=2400&q=72",
    bannerImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=72",
    bannerAlt: "Trekkers below the Khumbu icefall at Everest Base Camp",
    gallery: [
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=70",
    ].join("\n"),
    keyTakeaway:
      "14 days, 5,545m at the top of Kala Patthar, and US$1,199 per person if you bring a group of 10-12. No technical climbing, no ropes — just a lot of walking uphill while the air gets thinner. If you can handle six hours of walking on back-to-back days, you can handle this.",
    takeaways: [
      "Duration: 14 days, Kathmandu to Kathmandu",
      "Max altitude: 5,545m at Kala Patthar — Base Camp itself is 5,364m",
      "Trip grade: Moderate-Strenuous",
      "Price: from US$1,199 per person (regular US$1,650)",
      "Group size: 1-12 pax",
      "Best months: March–May and September–November",
      "Permits: Sagarmatha National Park + Khumbu Pasang Lhamu. No TIMS card here",
    ].join("\n"),
    overview: `## The one everybody wants, and for good reason

Everest Base Camp is the trek people picture when they say "I want to go to Nepal." Fourteen days, a flight that will rearrange your face, and a walk up the Khumbu valley to stand at 5,364m under the icefall.

Here is the part most websites bury: **you cannot actually see Everest from Base Camp.** Nuptse and Everest's own west shoulder block it. That is why Day 10 starts at 4am and drags you up Kala Patthar (5,545m) instead — that's the spot with the full, unobstructed summit view. Anyone selling you EBC without Kala Patthar is selling you half a trek.

## About that Lukla flight

Yes, landing at Lukla will make you question every life decision for about 30 seconds. The runway is short, tilted, and ends in a mountain. It is also flown daily by pilots who have done it a thousand times. Consider it the local initiation.

What actually matters: **Lukla flights get cancelled.** Weather, not drama. Our Day 14 sits in Kathmandu as a buffer for exactly this reason. If your flight home is non-negotiable, add another day. Losing a day here is annoying; missing an international connection is expensive.

## The two days that decide whether you make it

Day 4 in Namche (3,440m) and Day 7 in Dingboche (4,410m) are acclimatisation days. They are not padding, and they are not us stretching the trip to charge you more. Skip either one and your odds of altitude sickness roughly triple.

Both days follow the same rule: **climb high, sleep low.** You walk up a few hundred metres, look at the view, then come back down to sleep. Boring on paper. It is the single reason our groups reach Base Camp.

## Do you need to be an athlete?

No. You need to be able to walk five to seven hours a day, several days running, on uneven ground.

You don't need to be an Olympic athlete, but if walking up two flights of stairs makes you see light, maybe hit the treadmill for a couple of weeks before flying in.

Honestly? The trekkers who struggle most are usually the fit ones who charge ahead on days three and four and outrun their own acclimatisation. Slow is the whole strategy.

## What you'll eat

Dal Bhat Power 24 Hour is not a meme up here; it's actual rocket fuel. Free refills in most teahouses, which matters more than you'd think when you're burning 4,000 calories a day. Order it. Every day. Your legs will thank you.`,
    highlights: [
      "Reach Everest Base Camp (5,364m), the base of the world's highest peak",
      "Sunrise hike to Kala Patthar (5,545m) for the best panoramic Everest views",
      "Scenic and thrilling mountain flight to and from Lukla Airport",
      "Explore Namche Bazaar, the vibrant Sherpa capital of the Khumbu region",
      "Walk alongside the dramatic Khumbu Glacier and icefall",
      "Visit the oldest and biggest monastery, Tengboche Monastery",
      "Stunning views of Everest, Lhotse, Nuptse and Ama Dablam throughout the trek",
      "Stay in traditional teahouses offering a unique mountain lifestyle experience",
    ].join("\n"),
    includes: [
      "Round-trip mountain flight Kathmandu–Lukla with airport transfers",
      "Sagarmatha National Park and Khumbu Pasang Lhamu permits",
      "Licensed English-speaking Sherpa guide, wilderness first-aid trained",
      "Porter for every two trekkers (20 kg limit per porter)",
      "All teahouse accommodation on the trek, twin-share",
      "Three meals a day on the trail — yes, unlimited Dal Bhat counts",
      "Guide and porter insurance, wages, meals and equipment",
      "Pulse oximeter and satellite communicator carried by your guide",
      "Hotel in Kathmandu on arrival and the buffer night",
    ].join("\n"),
    excludes: [
      "International flights and Nepal visa on arrival",
      "Travel insurance covering helicopter evacuation to 6,000m — non-negotiable",
      "Hot showers, wi-fi, device charging and bottled drinks in teahouses",
      "Personal trekking gear",
      "Tips for your guide and porters",
      "Extra Kathmandu nights if Lukla weather has other plans",
    ].join("\n"),
    days: [
      { title: "Arrival in Kathmandu (1,300m) & Transfer to Hotel", altitude: "1,300 m", description: "Land at Tribhuvan International, get picked up, get to your hotel. Evening briefing where your guide checks your gear and quietly judges your boots. If they say your boots are too new, believe them." },
      { title: "Fly to Lukla (2,860m) & Trek to Phakding (2,610m)", altitude: "2,860 m", distance: "8 km", duration: "3–4 hours", accommodation: "Teahouse in Phakding", description: "Early flight to Lukla — the famous one. Then a short, mostly downhill walk to Phakding along the Dudh Kosi. Deliberately easy: you lose altitude on day one, which is exactly what you want." },
      { title: "Trek from Phakding to Namche Bazaar (3,440m)", altitude: "3,440 m", distance: "11 km", duration: "6–7 hours", accommodation: "Lodge in Namche Bazaar", description: "Five suspension bridges, the national park checkpoint at Monjo, then the Namche hill. It is 600m of switchbacks and it is everyone's least favourite afternoon. Partway up, if the clouds cooperate, you get your first look at Everest. Worth it." },
      { title: "Acclimatization Day in Namche Bazaar (Hike to Everest View Hotel 3,880m)", altitude: "3,880 m", distance: "5 km", duration: "3–4 hours", accommodation: "Lodge in Namche Bazaar", description: "Climb high, sleep low. Morning hike to the Everest View Hotel and the Sherpa villages of Khumjung and Khunde, then back down to Namche for the night. Do not skip this day. People who skip this day go home early." },
      { title: "Trek from Namche Bazaar to Tengboche (3,860m)", altitude: "3,860 m", distance: "10 km", duration: "5–6 hours", accommodation: "Teahouse in Tengboche", description: "A flat traverse with Everest, Lhotse and Ama Dablam in view the whole way, then a drop to the river and a 600m climb to Tengboche. Time it right and you catch the afternoon prayer ceremony at the monastery." },
      { title: "Trek from Tengboche to Dingboche (4,410m)", altitude: "4,410 m", distance: "9 km", duration: "5–6 hours", accommodation: "Teahouse in Dingboche", description: "Through rhododendron forest, past Pangboche and its old monastery. The trees give up around here and the landscape turns to open high-altitude scrub. You'll notice the air." },
      { title: "Acclimatization Day in Dingboche (Hike to Nagarjun Hill 5,100m)", altitude: "5,100 m", distance: "4 km", duration: "3–4 hours", accommodation: "Teahouse in Dingboche", description: "Second acclimatisation day. Up Nagarjun Hill to around 5,100m for views of Makalu, Lhotse and Island Peak, then straight back down to sleep at 4,410m. Slow legs, strong lungs later." },
      { title: "Trek from Dingboche to Lobuche (4,940m)", altitude: "4,940 m", distance: "8 km", duration: "5 hours", accommodation: "Teahouse in Lobuche", description: "Gentle to Thukla, then the steep pull to Thukla Pass and the memorial stones for climbers who did not come back from Everest. It is a quiet stretch. Most groups stop talking for a while." },
      { title: "Trek from Lobuche to Gorakshep (5,164m) & Hike to Everest Base Camp (5,364m)", altitude: "5,364 m", distance: "13 km", duration: "7–8 hours", accommodation: "Teahouse in Gorakshep", description: "The big one. Glacier moraine to Gorakshep, drop your bag, then out across the rocks to Everest Base Camp at 5,364m. You stand under the Khumbu icefall, take the photo, and walk back to Gorakshep to sleep. Long day. Worth every hour." },
      { title: "Early Morning Hike to Kala Patthar (5,545m) & Trek down to Pheriche (4,371m)", altitude: "5,545 m", distance: "16 km", duration: "7–8 hours", accommodation: "Teahouse in Pheriche", description: "4am start, headtorch on, up to 5,545m for sunrise on Everest's summit pyramid. This is the view you came for. Then a long descent to Pheriche, where the thicker air hits you like a good night's sleep." },
      { title: "Trek from Pheriche to Namche Bazaar (3,440m)", altitude: "3,440 m", distance: "15 km", duration: "6–7 hours", accommodation: "Lodge in Namche Bazaar", description: "Back down through Pangboche and Tengboche. Trees return, oxygen returns, appetite returns. Someone in the group will order two dinners." },
      { title: "Trek from Namche Bazaar to Lukla (2,860m)", altitude: "2,860 m", distance: "19 km", duration: "6–7 hours", accommodation: "Teahouse in Lukla", description: "Down the Namche hill, back over the bridges, into Lukla. Last night on the trail — usually ends with a celebration dinner and your porters out-dancing everyone." },
      { title: "Flight from Lukla to Kathmandu", altitude: "1,300 m", duration: "35 minutes", accommodation: "Hotel in Kathmandu", description: "Morning flight back to Kathmandu. Shower, real coffee, a bed that isn't plywood. Afternoon free in Thamel to buy the souvenirs you swore you wouldn't." },
      { title: "Final Departure / Airport Transfer", altitude: "1,300 m", description: "Transfer to the airport for your flight home. If the Lukla flight was delayed, this is the buffer day that saves your trip." },
    ] as DaySpec[],
    faqs: [
      { question: "How much does the Everest Base Camp Trek cost?", answer: "US$1,199 per person is the starting price (regular price US$1,650). It scales with group size: **1 pax US$1,499** (or US$1,599 for the single package option), **2-5 pax US$1,299 each**, **6-9 pax US$1,250 each**, and **10-12 pax US$1,199 each**. That covers your Lukla flights, both permits, guide, shared porter, teahouses and all meals on the trail. Budget extra for insurance, tips and teahouse wi-fi." },
      { question: "How hard is the Everest Base Camp Trek?", answer: "Trip grade is **Moderate-Strenuous**. No ropes, no climbing skill, no glacier travel — it is a walking trail the whole way. The difficulty is altitude plus repetition: five to seven hours a day, fourteen days, with the last stretch above 5,000m where there is roughly half the oxygen you get at sea level. If you can walk six hours on consecutive days, you can do this. Going slowly matters far more than being fit." },
      { question: "Can you see Mount Everest from Everest Base Camp?", answer: "No, and this catches people out. Base Camp sits at 5,364m inside the Khumbu glacier moraine, and Nuptse plus Everest's own west shoulder hide the summit completely. That is exactly why Day 10 has you up at 4am climbing Kala Patthar (5,545m) — it is the accessible spot with a clean, full view of the summit pyramid." },
      { question: "What happens if my Lukla flight is cancelled?", answer: "It happens, and it is weather, not incompetence. Lukla sits in a valley that clouds over fast. Our 14-day itinerary keeps the final day in Kathmandu as a buffer for exactly this. If your international flight home is fixed and expensive, add a second buffer day — an extra night in Kathmandu costs far less than rebooking a long-haul ticket." },
      { question: "Do I need a guide for the Everest Base Camp Trek?", answer: "Yes. Since April 2023 Nepal requires a licensed guide in national park areas, and the Khumbu sits inside Sagarmatha National Park. Beyond the legal side, your guide books teahouses before they fill in peak season, handles the permit checkpoints, and checks your blood oxygen every evening — which is the part that actually keeps you safe." },
      { question: "Will I get altitude sickness?", answer: "Mild symptoms — headache, rubbish sleep, no appetite — are normal above 4,000m and most trekkers get some of it. Serious altitude sickness is uncommon on a properly paced itinerary, and it is almost entirely about how fast you climb, not how fit you are. We keep both acclimatisation days, cap sleeping-altitude gain above Namche, and your guide carries a pulse oximeter. The 11-day itineraries you'll see advertised get shorter by cutting exactly those safeguards." },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2 — MANASLU CIRCUIT TREK                                            */
  /* ------------------------------------------------------------------ */
  {
    priority: 2,
    slug: "manaslu-circuit-trek",
    regionSlug: "manaslu",
    title: "Manaslu Circuit Trek",
    metaTitle: "Manaslu Circuit Trek — 15 Days, US$995 | Larkya La Pass",
    metaDescription:
      "15-day Manaslu Circuit Trek from US$995. Exact group pricing, full day-by-day itinerary, the 5,106m Larkya La Pass, and what the restricted-area permit rules actually mean.",
    keywords:
      "manaslu circuit trek, manaslu circuit 15 days, larkya la pass, manaslu trek cost, manaslu restricted area permit",
    entityTags: "Manaslu, Larkya La, Restricted Area, Budhi Gandaki, Nubri, Samagaun, Samdo",
    durationDays: 15,
    durationNights: 14,
    difficulty: "Moderate-Strenuous",
    maxAltitude: "5,106 m (Larkya La Pass)",
    groupSize: "1-16 Pax",
    startPoint: "Kathmandu",
    endPoint: "Kathmandu",
    bestSeason: "March–May, September–November",
    accommodation: "Teahouse / lodge",
    transportation: "Private jeep Kathmandu–Machha Khola and Dharapani–Kathmandu",
    priceFrom: 995,
    priceRegular: 1250,
    currency: "USD",
    tiers: [
      { label: "1 pax", price: 1285 },
      { label: "2 - 6 pax", price: 995 },
      { label: "7 - 9 pax", price: 930 },
      { label: "10 - 12 pax", price: 895 },
    ] as Tier[],
    heroImage:
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=2400&q=72",
    bannerImage:
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=72",
    bannerAlt: "Manaslu seen from the Nubri valley on the Manaslu Circuit trek",
    gallery: [
      "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=70",
    ].join("\n"),
    keyTakeaway:
      "15 days around the world's 8th highest mountain, over a 5,106m pass, for US$995 per person in a group of 2-6. Restricted area, so you legally need a guide and a minimum of two trekkers — which is precisely why it stays empty while Annapurna fills up.",
    takeaways: [
      "Duration: 15 days, Kathmandu to Kathmandu",
      "Max altitude: 5,106m at Larkya La Pass",
      "Trip grade: Moderate-Strenuous",
      "Price: from US$995 per person (regular US$1,250)",
      "Group size: 1-16 pax",
      "Restricted area: licensed guide mandatory, minimum 2 trekkers",
      "Permits: Manaslu Restricted Area Permit + MCAP + ACAP",
    ].join("\n"),
    overview: `## The Annapurna Circuit, twenty years ago

That is the honest pitch. Manaslu goes right around the 8th highest mountain on earth, crosses a 5,106m pass, and you will see maybe thirty other trekkers in fifteen days. On the Annapurna Circuit in October you'll see thirty before breakfast.

The reason is bureaucracy, and for once bureaucracy is doing something useful. Manaslu is a **restricted area**: you cannot walk it solo, you need a licensed guide, and you need a minimum of two people in your group. Permits only come through registered agencies. That paperwork is the wall keeping the crowds out.

If you're travelling alone, don't panic — we pair solo trekkers on the same departure to hit the two-person minimum. It costs you nothing extra.

## What actually makes it special

You start at 870m in subtropical river gorge, sweating, surrounded by paddy fields. You finish two weeks later at 5,106m in snow. Somewhere around Jagat the whole culture flips — Hindu farming villages give way to Tibetan Buddhist Nubri, with mani walls, gompas, and villages where Tibetan is the first language.

Very few treks give you that full transition on foot. Everest is Sherpa top to bottom and gloriously so, but the change is subtler.

## The Larkya La, honestly

Day 12 is the hard one. Up at 4am from Dharamsala, four to five hours of climbing to 5,106m, then a knee-destroying 1,500m descent to Bimthang. Ten to twelve hours on your feet.

In good conditions it is straightforward walking. After fresh snow it needs microspikes and a guide who has crossed recently. Our Days 9, 10 and 11 are deliberately short — that is not laziness, it's so you hit the pass acclimatised instead of wrecked.

## Is it harder than Everest Base Camp?

Yes. Longer days, rougher trail, more basic teahouses, and fewer places to bail out if something goes wrong. EBC goes higher (5,545m vs 5,106m) but Manaslu asks more of your legs.

Do EBC first if this is your first time at altitude. Do Manaslu if you've done that and want the version without the queue.`,
    highlights: [
      "Trek around the world's 8th highest mountain, Mt Manaslu (8,163m / 26,781ft)",
      "Few crowds and more wilderness",
      "Spectacular views of Manaslu and surrounding peaks including Annapurna II, Lamjung Himal and Himlung Himal",
      "Immerse in a unique blend of Nepalese and Tibetan culture",
      "Landscapes from lush forest to high-altitude desert, through traditional villages with friendly locals",
      "Crossing the challenging Larkya La Pass (5,106m)",
      "Fully supported small groups or private treks",
    ].join("\n"),
    includes: [
      "Manaslu Restricted Area Permit, MCAP and ACAP",
      "Licensed English-speaking guide, wilderness first-aid trained",
      "Porter for every two trekkers (20 kg limit per porter)",
      "Private jeep Kathmandu–Machha Khola and Dharapani–Kathmandu",
      "All teahouse accommodation on the trek, twin-share",
      "Three meals a day on the trail",
      "Guide and porter insurance, wages, meals and equipment",
      "Pulse oximeter and satellite communicator carried by your guide",
      "Solo trekker pairing to meet the two-person minimum",
    ].join("\n"),
    excludes: [
      "International flights and Nepal visa on arrival",
      "Travel insurance covering helicopter evacuation",
      "Hot showers, wi-fi, device charging and bottled drinks",
      "Personal trekking gear, including microspikes for the pass",
      "Tips for your guide and porters",
    ].join("\n"),
    days: [
      { title: "Arrival in Kathmandu (1,300m) & Briefing", altitude: "1,300 m", description: "Airport pickup and hotel. Evening briefing where we go through the restricted-area permits — there are three of them and your guide carries all of them, because checkpoints at Jagat and Sama do actually check." },
      { title: "Drive from Kathmandu to Machha Khola (870m) via Arughat", altitude: "870 m", distance: "160 km", duration: "8–9 hours", accommodation: "Teahouse in Machha Khola", description: "A long jeep day. Smooth highway, then increasingly creative road along the Budhi Gandaki. Bring a playlist and a sense of humour. The scenery makes up for your spine." },
      { title: "Trek from Machha Khola to Jagat (1,340m)", altitude: "1,340 m", distance: "22 km", duration: "6–7 hours", accommodation: "Teahouse in Jagat", description: "Walking finally. The trail hugs the gorge, crosses suspension bridges and passes hot springs at Tatopani. Jagat is the restricted-area checkpoint — passports out." },
      { title: "Trek from Jagat to Deng (1,860m)", altitude: "1,860 m", distance: "20 km", duration: "6–7 hours", accommodation: "Teahouse in Deng", description: "Through Salleri and Sirdibas into steeper gorge. Above Philim the valley narrows hard and the first mani walls appear. This is where the culture starts changing under your feet." },
      { title: "Trek from Deng to Namrung (2,630m)", altitude: "2,630 m", distance: "19 km", duration: "6–7 hours", accommodation: "Teahouse in Namrung", description: "Steady climbing through bamboo and pine, past Ghap and its carved mani stones. Namrung is the gateway to the Nubri valley proper, and the first real mountain views land here." },
      { title: "Trek from Namrung to Lho (3,180m)", altitude: "3,180 m", distance: "11 km", duration: "4–5 hours", accommodation: "Teahouse in Lho", description: "Shorter day. Manaslu shows itself in full above Lho's monastery, and it is the kind of view that stops conversation. Good spot for a sunset you'll take too many photos of." },
      { title: "Trek from Lho to Samagaun (3,530m)", altitude: "3,530 m", distance: "12 km", duration: "4–5 hours", accommodation: "Lodge in Samagaun", description: "Via Shyala, ringed by peaks on every side. Samagaun is the biggest village in the Nubri and your base for two nights." },
      { title: "Acclimatization Day in Samagaun (Hike to Birendra Lake / Manaslu Base Camp)", altitude: "4,400 m", distance: "10 km", duration: "5–6 hours", accommodation: "Lodge in Samagaun", description: "Climb high, sleep low. Push up to Manaslu Base Camp (4,400m) if your legs agree, or take the gentler option to Birendra Lake and Pungyen Gompa. Either way you sleep back at 3,530m." },
      { title: "Trek from Samagaun to Samdo (3,860m)", altitude: "3,860 m", distance: "8 km", duration: "3–4 hours", accommodation: "Teahouse in Samdo", description: "Short by design. Samdo is a Tibetan refugee village a few hours' walk from the border. The brevity is acclimatisation, not a day off." },
      { title: "Acclimatization / Rest Day in Samdo (Hike towards Tibetan Border)", altitude: "4,200 m", distance: "7 km", duration: "4 hours", accommodation: "Teahouse in Samdo", description: "Second rest day, and the last comfortable one before the pass. Hike up towards the old trading route to the Tibetan border, then back down. Eat everything. Sleep early." },
      { title: "Trek from Samdo to Dharamsala / Larkya Phedi (4,460m)", altitude: "4,460 m", distance: "7 km", duration: "4 hours", accommodation: "Basic lodge at Dharamsala", description: "Short walk to the last shelter before the pass. Dharamsala is basic — a few rooms and a dining tent, and that is the whole settlement. Nobody stays up late here." },
      { title: "Trek from Dharamsala over Larkya La Pass (5,106m) to Bimthang (3,720m)", altitude: "5,106 m", distance: "24 km", duration: "10–12 hours", accommodation: "Teahouse in Bimthang", description: "The day the whole trek has been building to. Away by 4am, four to five hours climbing to the prayer flags at 5,106m with Himlung, Cheo and Annapurna II across the valley, then a long 1,500m drop to the meadows at Bimthang. Your knees will file a complaint. Ignore them." },
      { title: "Trek from Bimthang to Dharapani (1,860m)", altitude: "1,860 m", distance: "25 km", duration: "7–8 hours", accommodation: "Teahouse in Dharapani", description: "Long descent through rhododendron and pine into the Marsyangdi valley, joining the Annapurna Circuit trail at Dharapani. Warm, thick air and your first proper appetite in days." },
      { title: "Drive from Dharapani to Beshisahar and back to Kathmandu", altitude: "1,300 m", distance: "180 km", duration: "9–10 hours", accommodation: "Hotel in Kathmandu", description: "Jeep to Beshisahar on rough mountain road, then sealed highway to Kathmandu. Hot shower in Thamel has never felt better in your life." },
      { title: "Final Departure", altitude: "1,300 m", description: "Airport transfer for your flight home, or stay on and do nothing for a day. You've earned it." },
    ] as DaySpec[],
    faqs: [
      { question: "How much does the Manaslu Circuit Trek cost?", answer: "US$995 per person starting price (regular US$1,250). By group size: **1 pax US$1,285**, **2-6 pax US$995 each**, **7-9 pax US$930 each**, **10-12 pax US$895 each**. That includes all three permits, your guide, a shared porter, jeep transfers both ends, teahouses and all meals on the trail." },
      { question: "Can I trek the Manaslu Circuit solo?", answer: "No, and this is a legal rule rather than a sales pitch. Manaslu is a restricted area: a licensed guide is mandatory, the minimum group size is two trekkers, and permits are only issued through registered agencies. Checkpoints at Jagat and Sama verify all of it. If you're travelling alone we pair you with another solo trekker on the same departure date at no extra cost." },
      { question: "How hard is the Larkya La Pass?", answer: "It is the crux of the trek — a 10-12 hour day starting around 4am, climbing four to five hours to 5,106m then descending about 1,500m to Bimthang. In clear conditions it is non-technical walking on a marked trail. After fresh snow it needs microspikes and a guide who has crossed recently. We schedule three deliberately short days before it so you arrive rested rather than wrecked." },
      { question: "What permits do I need for the Manaslu Circuit?", answer: "Three, all included in the price: the **Manaslu Restricted Area Permit**, the **Manaslu Conservation Area Permit (MCAP)**, and the **Annapurna Conservation Area Permit (ACAP)** — that last one because the circuit exits through Annapurna territory at Dharapani. Your guide carries all three." },
      { question: "Is Manaslu harder than Everest Base Camp?", answer: "Yes, moderately. Longer daily distances, rougher trail, simpler teahouses, and one very long pass day. Everest Base Camp reaches higher (5,545m at Kala Patthar versus 5,106m here) but Manaslu is the tougher trek overall, with fewer bail-out options above Samagaun. Sensible order: EBC first, Manaslu second." },
      { question: "When is the best time for the Manaslu Circuit?", answer: "Late September to November is the sweet spot — stable weather, clear views, and a pass that is reliably open. March to May is the second choice: warmer, rhododendrons in bloom, hazier views. Avoid June to August, when the Budhi Gandaki gorge is landslide-prone, and December to February when Larkya La is often snowed shut." },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3 — ANNAPURNA CIRCUIT TREK                                          */
  /* ------------------------------------------------------------------ */
  {
    priority: 3,
    slug: "annapurna-circuit-trek",
    regionSlug: "annapurna",
    title: "Annapurna Circuit Trek",
    metaTitle: "Annapurna Circuit Trek — 12 Days, US$850 | Thorong La Pass",
    metaDescription:
      "12-day Annapurna Circuit Trek from US$850. Exact group pricing, full day-by-day itinerary, the 5,416m Thorong La Pass, Muktinath temple and Tatopani hot springs.",
    keywords:
      "annapurna circuit trek, annapurna circuit 12 days, thorong la pass, annapurna circuit cost, muktinath",
    entityTags: "Annapurna, Thorong La, Manang, Muktinath, Tatopani, Pokhara, Marsyangdi",
    durationDays: 12,
    durationNights: 11,
    difficulty: "Moderate-Strenuous",
    maxAltitude: "5,416 m (Thorong La Pass)",
    groupSize: "1-12 Pax",
    startPoint: "Kathmandu",
    endPoint: "Kathmandu",
    bestSeason: "March–May, October–November",
    accommodation: "Teahouse / lodge",
    transportation: "Drive Kathmandu–Chame, Muktinath–Pokhara–Kathmandu",
    priceFrom: 850,
    priceRegular: 1199,
    currency: "USD",
    tiers: [
      { label: "1 pax", price: 1050 },
      { label: "2 - 6 pax", price: 850 },
      { label: "7 - 9 pax", price: 825 },
      { label: "10 - 12 pax", price: 799 },
    ] as Tier[],
    heroImage:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=2400&q=72",
    bannerImage:
      "https://images.unsplash.com/photo-1486911278844-a81c5267e227?auto=format&fit=crop&w=1200&q=72",
    bannerAlt: "Thorong La Pass on the Annapurna Circuit trek in Nepal",
    gallery: [
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=70",
      "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=70",
    ].join("\n"),
    keyTakeaway:
      "12 days, the 5,416m Thorong La Pass, and US$850 per person in a group of 2-6. This is the scenery-variety trek: subtropical forest to high-altitude desert in under two weeks, finishing with hot springs at Tatopani. Best value of the three.",
    takeaways: [
      "Duration: 12 days, Kathmandu to Kathmandu",
      "Max altitude: 5,416m at Thorong La Pass",
      "Trip grade: Moderate-Strenuous",
      "Price: from US$850 per person (regular US$1,199)",
      "Group size: 1-12 pax",
      "Best months: March–May and October–November",
      "No flights required — road access at both ends",
    ].join("\n"),
    overview: `## The classic, and the best value of the three

The Annapurna Circuit is on every "top 10 treks in the world" list ever written, and unlike most things on those lists it deserves the spot. Twelve days, one enormous pass at 5,416m, and more scenery variety than any other trek in Nepal.

You walk from subtropical forest and paddy fields, up through pine and alpine scrub, into what is basically high-altitude desert on the Mustang side. Same trek. Twelve days. It does not look like the same country by the end.

## Thorong La is the whole game

Day 8 is why people come. Thorong La sits at **5,416m** — higher than Everest Base Camp, higher than the Larkya La — and it is one of the highest navigable passes on the planet.

You leave High Camp in the dark, cross before the afternoon wind arrives, and drop into Muktinath on the far side. Then you drink tea and realise you just walked over a mountain range.

**The catch nobody mentions:** the wind. Thorong La gets vicious after about 10am. Every sensible operator starts absurdly early and every group that leaves late regrets it. We start early.

## Muktinath

The temple at Muktinath is sacred to both Hindus and Buddhists — one of the very few sites that genuinely matters to both. There are 108 water spouts, an eternal flame fed by natural gas, and pilgrims who have travelled a lot further than you did to get there.

Take twenty minutes. It's worth more than the photo.

## Then: hot springs

Day 9 ends at Tatopani. "Tato pani" literally means hot water, and after eight days of walking and a 5,416m pass, sitting in a natural hot spring is a genuinely religious experience regardless of your beliefs.

## Which of the three should you pick?

- **Never been to altitude?** Everest Base Camp. Best infrastructure, best rescue options.
- **Hate crowds?** Manaslu. Restricted permits keep it quiet.
- **Want the most scenery per rupee?** This one. It's the cheapest of the three, the shortest, and has the biggest variety.`,
    highlights: [
      "One of the most classic and top 10 trekking routes in the world",
      "Trekking through diverse terrains, from subtropical forests to alpine zones and high-altitude deserts",
      "Crossing Thorong La Pass, one of the world's highest passes",
      "Panoramic views of Himalayan giants including Annapurna I, Dhaulagiri and Machhapuchhre",
      "Cultural experiences in traditional villages like Manang and Muktinath",
      "Hot springs at Tatopani offer relaxation after days of trekking",
      "Exploring the holy temple of Muktinath, a significant pilgrimage site for both Hindus and Buddhists",
      "The serene beauty of the Marsyangdi and Kali Gandaki valleys",
    ].join("\n"),
    includes: [
      "Annapurna Conservation Area Permit (ACAP) and TIMS card",
      "Licensed English-speaking guide",
      "Porter for every two trekkers (20 kg limit per porter)",
      "All ground transport: Kathmandu–Chame, Muktinath–Pokhara–Kathmandu",
      "All teahouse accommodation on the trek, twin-share",
      "Three meals a day on the trail",
      "Guide and porter insurance, wages, meals and equipment",
    ].join("\n"),
    excludes: [
      "International flights and Nepal visa on arrival",
      "Travel insurance covering helicopter evacuation",
      "Hot showers, wi-fi, device charging and bottled drinks",
      "Entrance to the Tatopani hot springs",
      "Personal trekking gear",
      "Tips for your guide and porters",
    ].join("\n"),
    days: [
      { title: "Arrival in Kathmandu (1,300m)", altitude: "1,300 m", description: "Airport pickup, hotel, evening briefing. Your guide checks gear and answers the question everyone asks first: yes, the pass really is that high." },
      { title: "Drive from Kathmandu to Beshisahar & Chame (2,670m)", altitude: "2,670 m", distance: "230 km", duration: "9–10 hours", accommodation: "Teahouse in Chame", description: "Long driving day up the Marsyangdi valley. Highway to Beshisahar, then jeep on road that gets progressively more theoretical. You gain serious altitude sitting down, which is the only free lunch on this trek." },
      { title: "Trek from Chame to Upper Pisang (3,300m)", altitude: "3,300 m", distance: "15 km", duration: "5–6 hours", accommodation: "Teahouse in Upper Pisang", description: "Through pine forest with the vertical Paungda Danda rock face looming over the valley. Upper Pisang beats Lower Pisang for views and it is worth the extra climb." },
      { title: "Trek from Upper Pisang to Manang (3,540m) via Ghyaru/Ngawal", altitude: "3,540 m", distance: "17 km", duration: "6–7 hours", accommodation: "Lodge in Manang", description: "Take the high route through Ghyaru and Ngawal. It is harder and everyone who takes the low road misses the best views on the entire circuit. Annapurna II and III sit directly across the valley all afternoon." },
      { title: "Acclimatization Day in Manang (Hike to Ice Lake or Gangapurna Viewpoint)", altitude: "4,600 m", distance: "10 km", duration: "5–6 hours", accommodation: "Lodge in Manang", description: "Non-negotiable rest day. Hike to Ice Lake (4,600m) if you're strong or the Gangapurna viewpoint if you're not, then sleep back at 3,540m. Manang also has a daily altitude-sickness talk at the clinic — go to it." },
      { title: "Trek from Manang to Yak Kharka (4,050m)", altitude: "4,050 m", distance: "10 km", duration: "4–5 hours", accommodation: "Teahouse in Yak Kharka", description: "Short and slow above the treeline. Yaks outnumber people from here on. The air is noticeably thinner and the pace drops on purpose." },
      { title: "Trek from Yak Kharka to Thorong Phedi / High Camp (4,850m)", altitude: "4,850 m", distance: "7 km", duration: "3–4 hours", accommodation: "Teahouse at High Camp", description: "Short day, big altitude. Sleeping at High Camp shortens tomorrow's climb considerably, though it is a colder night. Eat properly, hydrate, and get in your bag early — you're up at 3am." },
      { title: "Cross Thorong La Pass (5,416m) & Trek down to Muktinath (3,800m)", altitude: "5,416 m", distance: "16 km", duration: "8–10 hours", accommodation: "Lodge in Muktinath", description: "The big one. Head torches at 3am, four to five hours of switchbacks in the cold to the prayer flags at 5,416m, photos, then a 1,600m descent into Muktinath. Cross early — the wind after 10am is genuinely unpleasant. Afternoon at the temple." },
      { title: "Trek/Drive from Muktinath to Jomsom / Tatopani", altitude: "1,190 m", duration: "5–6 hours", accommodation: "Teahouse in Tatopani", description: "Down the Kali Gandaki, the deepest gorge on earth, through the wind-blasted Mustang landscape via Jomsom. Ends at Tatopani and its hot springs, which after Thorong La feel like a reward you personally negotiated." },
      { title: "Drive to Pokhara", altitude: "820 m", duration: "4–5 hours", accommodation: "Hotel in Pokhara", description: "Down to Pokhara, lakeside. Real coffee, a proper bed, and Machhapuchhre reflected in Phewa Lake at sunrise if the weather plays along." },
      { title: "Drive from Pokhara back to Kathmandu", altitude: "1,300 m", distance: "200 km", duration: "6–7 hours", accommodation: "Hotel in Kathmandu", description: "Highway back to Kathmandu along the Trishuli. Evening free in Thamel for the celebration dinner and the gear shopping you postponed." },
      { title: "Final Departure", altitude: "1,300 m", description: "Airport transfer for your onward flight." },
    ] as DaySpec[],
    faqs: [
      { question: "How much does the Annapurna Circuit Trek cost?", answer: "US$850 per person starting price (regular US$1,199). By group size: **1 pax US$1,050**, **2-6 pax US$850 each**, **7-9 pax US$825 each**, **10-12 pax US$799 each**. Includes ACAP permit and TIMS, guide, shared porter, all ground transport, teahouses and meals on the trail. It is the best value of our three flagship treks." },
      { question: "How high is Thorong La Pass?", answer: "**5,416m** — higher than Everest Base Camp (5,364m) and higher than Manaslu's Larkya La (5,106m). It is one of the highest navigable passes in the world. You cross it on Day 8, starting around 3am from High Camp so you're over before the afternoon wind picks up, then descend about 1,600m to Muktinath." },
      { question: "How difficult is the Annapurna Circuit?", answer: "Trip grade **Moderate-Strenuous**. Non-technical the whole way, but Thorong La day is genuinely long — eight to ten hours with a 566m climb and a 1,600m descent, at an altitude where the air holds roughly half the oxygen of sea level. The rest of the trek is comfortable walking. Do the Manang acclimatisation day properly and the pass is very manageable." },
      { question: "Do I need a flight for the Annapurna Circuit?", answer: "No, and that is a real advantage over Everest. Both ends are reachable by road — drive in to Chame, drive out from Muktinath via Pokhara. No Lukla weather roulette, no cancelled flights eating your buffer days. If you have fixed travel dates, this is the most reliable of the three treks." },
      { question: "What is at Muktinath?", answer: "A temple sacred to both Hindus and Buddhists, which is rare. There are 108 water spouts fed by the Kali Gandaki, and an eternal flame burning on natural gas beside a spring — fire and water together, which is why both traditions consider it significant. You arrive on the afternoon of Day 8 after crossing the pass." },
      { question: "When is the best time to trek the Annapurna Circuit?", answer: "March to May and October to November. Autumn gives the clearest mountain views and the most stable pass conditions; spring is warmer with rhododendron in bloom through the lower forest. Thorong La can close with snow in December to February, and the June-August monsoon brings cloud, leeches and landslide risk on the lower sections." },
    ],
  },
];
