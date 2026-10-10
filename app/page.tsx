import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesShowcase from "./components/ServicesShowcase";
import WorkflowSteps from "./components/WorkflowSteps";
import GalleryPreview from "./components/GalleryPreview";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ServicesShowcase />
        <WorkflowSteps />
        <GalleryPreview />
      </main>
      <Footer />
    </div>
  );
}
