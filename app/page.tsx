import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import HowItWorks from "./components/HowItWorks";
import Sustainability from "./components/Sustainability";
import Download from "./components/Download";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <HowItWorks />
        <Sustainability />
        <Download />
      </main>
      <Footer />
    </>
  );
}
