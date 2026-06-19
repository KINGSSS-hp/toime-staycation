"use client";

import { useState, useEffect } from "react";

const CONTACTS = [
  {
    name: "Messenger",
    href: process.env.NEXT_PUBLIC_MESSENGER_URL || "https://m.me/toime.staycation",
    color: "#0084FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.906 1.453 5.497 3.727 7.192V22l3.405-1.868c.91.252 1.871.388 2.868.388 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.07 12.456l-2.547-2.72-4.97 2.72 5.466-5.804 2.61 2.72 4.907-2.72-5.466 5.804z" />
      </svg>
    ),
    external: true,
  },
  {
    name: "Zalo",
    href: process.env.NEXT_PUBLIC_ZALO_URL || "https://zalo.me/toime.staycation",
    color: "#0068FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c.15 0 .63.01.91.09.28.07.47.28.52.51.06.27.06.63.04.79-.13.89-.69 3.58-.97 4.75-.12.49-.35.65-.57.67-.48.03-.85-.32-1.32-.62-.73-.47-1.14-.77-1.85-1.23-.82-.53-.29-.82.18-1.3.12-.12 2.24-2.06 2.28-2.23.01-.02.01-.1-.04-.14-.05-.04-.12-.03-.17-.02-.07.02-1.21.77-3.41 2.26-.32.22-.61.33-.88.33-.29 0-.85-.17-1.26-.3-.51-.17-.91-.26-.88-.54.02-.15.24-.3.66-.45 2.6-1.13 4.33-1.88 5.2-2.24 2.47-1.03 2.99-1.21 3.32-1.22z" />
      </svg>
    ),
    external: true,
  },
  {
    name: "Phone",
    href: `tel:${process.env.NEXT_PUBLIC_PHONE || "+84123456789"}`,
    color: "#4A7C59",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    ),
    external: false,
  },
];

export default function FloatingContact() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {CONTACTS.map((contact, i) => (
        <a
          key={contact.name}
          href={contact.href}
          target={contact.external ? "_blank" : undefined}
          rel={contact.external ? "noopener noreferrer" : undefined}
          className="float-in revealed flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 md:w-14 md:h-14"
          style={{
            backgroundColor: contact.color,
            animationDelay: `${i * 0.12}s`,
          }}
          aria-label={contact.name}
        >
          {contact.icon}
        </a>
      ))}
    </div>
  );
}
