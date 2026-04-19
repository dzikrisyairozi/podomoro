"use client";

import Header from "@/components/Header";
import Timer from "@/components/Timer";
import { useDebugMode } from "@/lib/useDebugMode";

export default function Home() {
  const { debug, toggleDebug } = useDebugMode();

  return (
    <>
      <Header debug={debug} onDebugToggle={toggleDebug} />
      <main
        className="flex flex-col lg:flex-row lg:items-start lg:justify-center
                   gap-8 px-4 py-8 lg:px-8 lg:py-12
                   max-w-5xl mx-auto"
      >
        <Timer debug={debug} />
      </main>
    </>
  );
}
