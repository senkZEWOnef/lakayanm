"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-amber-200/50 dark:divide-amber-400/20">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="py-4 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-haiti-navy dark:text-haiti-turquoise">{item.question}</span>
              <span className={`sub text-lg shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen && <p className="sub mt-3 leading-relaxed text-sm">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
