import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Metrics from "@/components/sections/Metrics";
import BookingPreview from "@/components/sections/BookingPreview";
import About from "@/components/sections/About";
import Amenities from "@/components/sections/Amenities";
import RoomList from "@/components/sections/RoomList";
import Reviews from "@/components/sections/Reviews";
import Location from "@/components/sections/Location";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import { generatePageMetadata } from "./metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata(locale);
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Metrics />
        <BookingPreview />
        <About />
        <Amenities />
        <RoomList />
        <Reviews />
        <Location />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
