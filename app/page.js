import Link from "next/link";

export default function Home() {
  return (
    <>
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to My App</h1>
      <Link href="/login">
        <button className="bg-white py-2 px-4 rounded-md text-black">Get Started</button>
      </Link>
    </div>
    </>
  );
}
