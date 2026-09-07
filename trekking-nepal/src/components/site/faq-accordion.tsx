"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = { id?: string; question: string; answer: string };

/**
 * FAQ accordion backing the FAQPage JSON-LD.
 *
 * Answers stay in the DOM (height-animated, not conditionally rendered when
 * closed would hide them from crawlers) — the first item opens by default and
 * every panel is exposed via aria-controls / hidden state for a11y.
 */
export function FaqAccordion({
  faqs,
  defaultOpen = 0,
}: {
  faqs: FaqItem[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const reduce = useReducedMotion();
  if (!faqs?.length) return null;

  return (
    <div className="divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={faq.id ?? index} itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-ink-50 sm:px-5"
              >
                <HelpCircle
                  size={18}
                  className={`mt-0.5 shrink-0 transition-colors ${isOpen ? "text-brand-600" : "text-ink-400"}`}
                  aria-hidden
                />
                <span
                  itemProp="name"
                  className="flex-1 text-[0.975rem] font-semibold leading-snug text-ink-900"
                >
                  {faq.question}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`mt-0.5 shrink-0 text-ink-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    itemProp="text"
                    className="prose-trek px-4 pb-4 pl-[3.1rem] text-[0.9375rem] sm:px-5 sm:pl-[3.4rem]"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
