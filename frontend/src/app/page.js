import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import Documents from "@/components/Documents";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingZalo from "@/components/FloatingZalo";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Courses />
        <Documents />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingZalo />
      <RevealOnScroll />
    </>
  );
}
