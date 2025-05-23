"use client"
import { Suspense } from 'react'
import Header from "@/components/Header";
import RouterConfig from "@/components/RouterConfig";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <RouterConfig />
      </main>
      <Footer />
    </>
  );
}