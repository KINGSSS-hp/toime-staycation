import { useTranslations } from "next-intl";
import Header from "@/components/sections/Header";
import BookingWizard from "@/components/booking/BookingWizard";

export default function BookingPage() {
  const t = useTranslations("booking_wizard");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-light pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brown-dark mb-3">
            {t("page_title")}
          </h1>
          <p className="text-text-muted">
            {t("page_subtitle")}
          </p>
        </div>
        <BookingWizard />
      </main>
    </>
  );
}
