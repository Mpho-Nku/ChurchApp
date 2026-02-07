import "./globals.css";
import NavBar from "@/components/NavBar";
import EnforcementBanner from "@/app/components/EnforcementBanner";
import Footer from "@/components/Footer";

export const metadata = {
  title: "St John AFM",
  description: "Church app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <NavBar />

        {/*  ✅ Enforcement banner is back again globally */}
        <EnforcementBanner />

        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
