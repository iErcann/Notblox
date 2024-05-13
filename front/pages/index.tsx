import KeyboardLayout from "@/components/KeyboardLayout";
import { ExternalLink, Play } from "lucide-react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container md:w-1/4 flex flex-col items-start md:items-center justify-center flex-1  text-center">
      <NextSeo
        title="NotBlox - Play multiplayer games in your browser"
        description="Play multiplayer games like Roblox in your browser. Create your own games and share them with your friends."
        openGraph={{
          title: "NotBlox - Play multiplayer games in your browser",
          description:
            "Play multiplayer games like Roblox in your browser. Create your own games and share them with your friends.",
          images: [
            {
              url: "/Logo.png",
              width: 800,
              height: 600,
              alt: "NotBlox Logo",
              type: "image/png",
            },
            {
              url: "/BigPreview.webp",
              width: 1200,
              height: 630,
              alt: "NotBlox Logo",
              type: "image/webp",
            },
          ],
          siteName: "NotBlox Online",
        }}
        twitter={{
          handle: "@iercan_",
          site: "@iercan_",
          cardType: "summary_large_image",
        }}
      />

      <main className="space-y-4 my-8 p-8">
        <h1 className="text-6xl font-bold">NotBlox.online</h1>
        <p className="text-2xl">Play multiplayer games in your browser</p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl sm:w-full space-y-8 ">
          <Image
            src="/Logo-Removed.png"
            alt={"Logo"}
            width={200}
            height={300}
          />

          <Link
            href={"/test"}
            className="flex items-center justify-center w-full px-8 py-3 font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
          >
            <Play className="mr-2" />
            Play Now
          </Link>
        </div>

        <KeyboardLayout />

        <p className="text-lg font-semibold">What's this?</p>
        <p className="text-sm text-gray-600 my-4">
          This is my playground for learning new technologies and having fun. I
          might get inspired by Roblox (dont sue pls)
        </p>
        <Link
          href={"https://discord.gg/kPhgtj49U2"}
          className="flex py-2 items-center justify-center w-full px-8   font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700   md:text-lg md:px-10"
        >
          <ExternalLink className="mr-2" />
          Project Discord
        </Link>
        <Link
          href={"https://twitter.com/iErcan_"}
          className="flex py-2 items-center justify-center w-full px-8   font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700   md:text-lg md:px-10"
        >
          <ExternalLink className="mr-2" />
          Twitter
        </Link>
        <Link
          href={"https://github.com/iErcann/NotRoblox"}
          className="flex py-2 items-center justify-center w-full px-8   font-medium text-white bg-gray-800 border border-transparent rounded-md hover:bg-gray-700   md:text-lg md:px-10"
        >
          <ExternalLink className="mr-2" />
          Source Code
        </Link>
      </main>
    </div>
  );
}
