
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CreateSection from "@/components/CreateSection";
import MyGreetings from "@/components/MyGreetings";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <CreateSection />
      <MyGreetings />
      <Footer />
    </div>
  );
};

export default Index;
