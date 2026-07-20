"use client";

import { useState } from "react";

export default function FAQ({ items }) {
  const [open, setOpen] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="faq-item">
          <div
            className="faq-q"
            onClick={() => setOpen(open === i ? null : i)}
            role="button"
            aria-expanded={open === i}
          >
            <span className="faq-q-text">{item.q}</span>
            <span
              className="faq-icon"
              style={{
                transform: open === i ? "rotate(45deg)" : "none",
                display: "inline-block",
              }}
            >
              +
            </span>
          </div>
          {open === i && <div className="faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}