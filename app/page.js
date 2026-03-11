import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to My App</h1>
    </div>
    </>
  );
}
