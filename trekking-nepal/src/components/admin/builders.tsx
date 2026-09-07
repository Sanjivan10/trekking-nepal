"use client";

import { Field, Input, Textarea, RepeaterCard, AddButton } from "./fields";
import { emptyDay, emptyReview, type FaqDraft, type DayDraft, type ReviewDraft } from "@/lib/drafts";

// Types only — value re-exports from a client module stay client references.
export type { FaqDraft, DayDraft, ReviewDraft };

/* -------------------------------- FAQs -------------------------------- */

export function FaqBuilder({
  items,
  onChange,
  hint = "These power the FAQPage JSON-LD. Write the question exactly as someone would ask it, and answer it in the first sentence.",
}: {
  items: FaqDraft[];
  onChange: (items: FaqDraft[]) => void;
  hint?: string;
}) {
  const update = (index: number, patch: Partial<FaqDraft>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <p className="hint mt-0">{hint}</p>
      {items.map((faq, index) => (
        <RepeaterCard
          key={index}
          index={index}
          title={`FAQ ${index + 1}`}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
          onMoveUp={index > 0 ? () => move(index, index - 1) : undefined}
          onMoveDown={index < items.length - 1 ? () => move(index, index + 1) : undefined}
        >
          <Field label="Question">
            <Input
              value={faq.question}
              onChange={(e) => update(index, { question: e.target.value })}
              placeholder="How difficult is the Everest Base Camp trek?"
            />
          </Field>
          <Field label="Answer" hint="Markdown supported. Lead with the direct answer.">
            <Textarea
              rows={3}
              value={faq.answer}
              onChange={(e) => update(index, { answer: e.target.value })}
              placeholder="The Everest Base Camp trek is moderately difficult…"
            />
          </Field>
        </RepeaterCard>
      ))}
      <AddButton onClick={() => onChange([...items, { question: "", answer: "" }])} label="Add FAQ" />
    </div>
  );
}

/* ------------------------------ Day builder ---------------------------- */

export function DayBuilder({
  items,
  onChange,
}: {
  items: DayDraft[];
  onChange: (items: DayDraft[]) => void;
}) {
  const update = (index: number, patch: Partial<DayDraft>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  /** Reorders and renumbers so day numbers always stay 1..n in sequence. */
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next.map((day, i) => ({ ...day, dayNumber: i + 1 })));
  };

  const remove = (index: number) =>
    onChange(
      items.filter((_, i) => i !== index).map((day, i) => ({ ...day, dayNumber: i + 1 })),
    );

  return (
    <div className="space-y-3">
      <p className="hint mt-0">
        Each day becomes a step in the <code>TouristTrip</code> itinerary schema and a row in the
        public route table. Distance, walking time and altitude are what answer engines quote.
      </p>

      {items.map((day, index) => (
        <RepeaterCard
          key={index}
          index={index}
          title={`Day ${day.dayNumber}`}
          onRemove={() => remove(index)}
          onMoveUp={index > 0 ? () => move(index, index - 1) : undefined}
          onMoveDown={index < items.length - 1 ? () => move(index, index + 1) : undefined}
        >
          <div className="grid gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
            <Field label="Day #">
              <Input
                type="number"
                min={1}
                value={day.dayNumber}
                onChange={(e) => update(index, { dayNumber: Number(e.target.value) || 1 })}
              />
            </Field>
            <Field label="Title">
              <Input
                value={day.title}
                onChange={(e) => update(index, { title: e.target.value })}
                placeholder="Fly to Lukla, trek to Phakding"
              />
            </Field>
          </div>

          <Field label="Description" hint="Markdown supported.">
            <Textarea
              rows={4}
              value={day.description}
              onChange={(e) => update(index, { description: e.target.value })}
              placeholder="An early morning flight to Lukla (2,860 m)…"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Distance">
              <Input
                value={day.distance}
                onChange={(e) => update(index, { distance: e.target.value })}
                placeholder="8 km"
              />
            </Field>
            <Field label="Walking time">
              <Input
                value={day.duration}
                onChange={(e) => update(index, { duration: e.target.value })}
                placeholder="3–4 hours"
              />
            </Field>
            <Field label="Max altitude">
              <Input
                value={day.altitude}
                onChange={(e) => update(index, { altitude: e.target.value })}
                placeholder="2,610 m"
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Accommodation">
              <Input
                value={day.accommodation}
                onChange={(e) => update(index, { accommodation: e.target.value })}
                placeholder="Teahouse in Phakding"
              />
            </Field>
            <Field label="Meals">
              <Input
                value={day.meals}
                onChange={(e) => update(index, { meals: e.target.value })}
                placeholder="Breakfast, lunch, dinner"
              />
            </Field>
          </div>
        </RepeaterCard>
      ))}

      <AddButton
        onClick={() => onChange([...items, emptyDay(items.length + 1)])}
        label="Add day"
      />
    </div>
  );
}

/* ---------------------------- Review builder --------------------------- */

export function ReviewBuilder({
  items,
  onChange,
}: {
  items: ReviewDraft[];
  onChange: (items: ReviewDraft[]) => void;
}) {
  const update = (index: number, patch: Partial<ReviewDraft>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      <p className="hint mt-0">
        Reviews feed the <code>AggregateRating</code> schema that renders star ratings in search
        results. Only publish reviews you actually received — fabricated reviews breach Google&apos;s
        review-snippet policy and can trigger a manual action.
      </p>

      {items.map((review, index) => (
        <RepeaterCard
          key={index}
          index={index}
          title={`Review ${index + 1}${review.approved ? "" : " · pending"}`}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
        >
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_6rem]">
            <Field label="Name">
              <Input
                value={review.authorName}
                onChange={(e) => update(index, { authorName: e.target.value })}
              />
            </Field>
            <Field label="Country">
              <Input
                value={review.country}
                onChange={(e) => update(index, { country: e.target.value })}
              />
            </Field>
            <Field label="Rating">
              <Input
                type="number"
                min={1}
                max={5}
                value={review.rating}
                onChange={(e) =>
                  update(index, {
                    rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)),
                  })
                }
              />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <Field label="Headline">
              <Input
                value={review.title}
                onChange={(e) => update(index, { title: e.target.value })}
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={review.reviewedAt?.slice(0, 10) || ""}
                onChange={(e) => update(index, { reviewedAt: e.target.value })}
              />
            </Field>
          </div>

          <Field label="Review">
            <Textarea
              rows={3}
              value={review.body}
              onChange={(e) => update(index, { body: e.target.value })}
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={review.approved}
              onChange={(e) => update(index, { approved: e.target.checked })}
              className="h-4 w-4 rounded border-ink-300 text-brand-600"
            />
            Approved (counts toward the aggregate rating)
          </label>
        </RepeaterCard>
      ))}

      <AddButton onClick={() => onChange([...items, emptyReview()])} label="Add review" />
    </div>
  );
}
