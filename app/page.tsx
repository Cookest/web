import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Showcase from "./components/Showcase";
import ScrollStory from "./components/ScrollStory";
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
        <ScrollStory />
        <Sustainability />
        <Download />
      </main>
      <Footer />
    </>
  );
}
