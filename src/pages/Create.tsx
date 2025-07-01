
import { useState } from "react";
import Header from "@/components/Header";
import AIGreetingCreator from "@/components/AIGreetingCreator";

const Create = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header />
      <div className="pt-20">
        <AIGreetingCreator />
      </div>
    </div>
  );
};

export default Create;
