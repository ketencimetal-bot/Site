import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Process from "@/components/Process";
import WhyUs from "@/components/WhyUs";
import QuoteForm from "@/components/QuoteForm";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main id="icerik">
      <Hero />
      <About />
      <Projects />
      <Process />
      <WhyUs />
      <QuoteForm />
      <Contact />
    </main>
  );
}
