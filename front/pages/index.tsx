import KeyboardLayout from "@/components/KeyboardLayout";
import { ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container md:w-1/4 mx-auto px-4 h-screen flex flex-col justify-center items-center text-center space-y-4 max-w-screen-lg">
      <h1 className="text-5xl font-bold mb-4">NoNameYet.io</h1>
      <Image
        src="/Logo.png"
        alt={"Logo"}
        width={200}
        height={300}
        className="rounded-lg shadow-xl"
      />

      <Link href={"/test"}>
        <button className="w-full  inline-flex h-14 items-center justify-center rounded-md bg-zinc-900 px-10 text-lg font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300">
          <Play className="mr-2" />
          Play Now
        </button>
      </Link>

      <KeyboardLayout />
      <div className="hidden lg:block">
        <p className="text-lg font-semibold">What's this?</p>
        <p className="text-sm text-gray-600 my-4">
          This is my playground for learning new technologies and having fun. I
          might get inspired by Roblox (dont sue pls)
        </p>
        <Link href={"https://discord.gg/kPhgtj49U2"}>
          <button className="inline-flex h-14 items-center justify-center rounded-md bg-blue-600 px-10 text-lg font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300">
            <ExternalLink className="mr-2" />
            Join Discord
          </button>
        </Link>
      </div>
    </div>
  );
}
