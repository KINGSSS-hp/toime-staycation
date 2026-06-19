"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState, useEffect, useCallback } from "react";
import SectionReveal from "@/components/shared/SectionReveal";

const ROOMS = [
  {
    slug: "ari",
    name: "Ari",
    images: [
      "/images/rooms/ari-1.jpg",
      "/images/rooms/ari-2.jpg",
      "/images/rooms/ari-3.jpg",
      "/images/rooms/ari-4.jpg",
      "/images/rooms/ari-5.jpg",
    ],
    beds: "1 giường đôi 1.6m",
    capacity: "2 người lớn + 1 trẻ em",
  },
  {
    slug: "crimson",
    name: "Crimson",
    images: [
      "/images/rooms/crimson-1.jpg",
      "/images/rooms/crimson-2.jpg",
      "/images/rooms/crimson-3.jpg",
      "/images/rooms/crimson-4.jpg",
      "/images/rooms/crimson-5.jpg",
    ],
    beds: "2 giường đơn 1.2m",
    capacity: "2 người lớn + 1 trẻ em",
  },
  {
    slug: "gatou",
    name: "Gatou",
    images: [
      "/images/rooms/gatou-1.jpg",
      "/images/rooms/gatou-2.jpg",
      "/images/rooms/gatou-3.jpg",
      "/images/rooms/gatou-4.jpg",
      "/images/rooms/gatou-5.jpg",
    ],
    beds: "1 giường đôi 1.8m",
    capacity: "2 người lớn + 1 trẻ em",
  },
  {
    slug: "inme",
    name: "Inme",
    images: [
      "/images/rooms/inme-1.jpg",
      "/images/rooms/inme-2.jpg",
      "/images/rooms/inme-3.jpg",
      "/images/rooms/inme-4.jpg",
      "/images/rooms/inme-5.jpg",
    ],
    beds: "2 giường đôi 1.6m",
    capacity: "4 người lớn + 2 trẻ em",
  },
  {
    slug: "rome",
    name: "Rome",
    images: [
      "/images/rooms/rome-1.jpg",
      "/images/rooms/rome-2.jpg",
      "/images/rooms/rome-3.jpg",
      "/images/rooms/rome-4.jpg",
      "/images/rooms/rome-5.jpg",
    ],
    beds: "1 giường đôi 1.4m",
    capacity: "2 người lớn",
  },
  {
    slug: "tame",
    name: "Tame",
    images: [
      "/images/rooms/tame-1.jpg",
      "/images/rooms/tame-2.jpg",
      "/images/rooms/tame-3.jpg",
      "/images/rooms/tame-4.jpg",
      "/images/rooms/tame-5.jpg",
    ],
    beds: "1 đôi 1.8m + 2 đơn",
    capacity: "4 người lớn + 2 trẻ em",
  },
  {
    slug: "tome",
    name: "Tome",
    images: [
      "/images/rooms/tome-1.jpg",
      "/images/rooms/tome-2.jpg",
      "/images/rooms/tome-3.jpg",
      "/images/rooms/tome-4.jpg",
      "/images/rooms/tome-5.jpg",
    ],
    beds: "1 giường đôi 1.6m",
    capacity: "2 người lớn + 1 trẻ em",
  },
  {
    slug: "woody",
    name: "Woody",
    images: [
      "/images/rooms/woody-1.jpg",
      "/images/rooms/woody-2.jpg",
      "/images/rooms/woody-3.jpg",
      "/images/rooms/woody-4.jpg",
      "/images/rooms/woody-5.jpg",
    ],
    beds: "1 giường đôi 1.8m",
    capacity: "2 người lớn + 1 trẻ em",
  },
];

function Lightbox({
  images,
  startIndex,
  roomName,
  onClose,
}: {
  images: string[];
  startIndex: number;
  roomName: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl cursor-pointer transition-colors z-10"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Room name + counter */}
      <div className="absolute top-5 left-5 text-white/80 text-sm z-10">
        <span className="font-semibold">{roomName}</span>
        <span className="ml-2 text-white/50">{index + 1} / {images.length}</span>
      </div>

      {/* Previous */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl cursor-pointer transition-colors"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Image */}
      <img
        src={images[index].replace("w=400", "w=1200").replace("w=900", "w=1200")}
        alt={`${roomName} ${index + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl cursor-pointer transition-colors"
        aria-label="Next"
      >
        ›
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setIndex(i); }}
            className={`w-14 h-10 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
              i === index ? "ring-2 ring-white opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover object-center" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RoomList() {
  const t = useTranslations();
  const [activeRoom, setActiveRoom] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const room = ROOMS[activeRoom];

  return (
    <section id="rooms" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionReveal className="text-center mb-12">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-green mb-3">
            {t("nav.rooms")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-brown-dark">
            {t("rooms.title")}
          </h2>
        </SectionReveal>

        {/* Room tabs */}
        <SectionReveal className="flex flex-wrap justify-center gap-2 mb-10">
          {ROOMS.map((r, i) => (
            <button
              key={r.slug}
              onClick={() => setActiveRoom(i)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeRoom === i
                  ? "bg-brown text-white shadow-md"
                  : "bg-cream text-text-light hover:bg-cream-dark hover:text-brown-dark"
              }`}
            >
              {r.name}
            </button>
          ))}
        </SectionReveal>

        {/* Gallery */}
        <SectionReveal>
          <div className="space-y-3">
            {/* Main image */}
            <div
              className="aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setLightbox(0)}
            >
              <img
                src={room.images[0]}
                alt={room.name}
                className="w-full h-full object-cover object-center hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Thumbnails — same aspect ratio as main image */}
            <div className="grid grid-cols-4 gap-3">
              {room.images.slice(1).map((img, i) => (
                <div
                  key={i}
                  className="aspect-[16/9] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setLightbox(i + 1)}
                >
                  <img
                    src={img}
                    alt={`${room.name} ${i + 2}`}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-400"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>

        {/* Bottom CTA */}
        <SectionReveal className="text-center mt-12">
          <Link
            href="/booking"
            className="inline-block px-10 py-4 bg-brown text-white rounded-xl font-semibold text-lg hover:bg-brown-dark transition-colors duration-200 shadow-lg shadow-brown/20"
          >
            {t("hero.cta_booking")}
          </Link>
        </SectionReveal>
      </div>

      {/* Lightbox overlay */}
      {lightbox !== null && (
        <Lightbox
          images={room.images}
          startIndex={lightbox}
          roomName={room.name}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
