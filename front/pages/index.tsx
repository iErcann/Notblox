import { useEffect, useState } from "react";
import { Game } from "@/components/game";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Run effect");
    async function initializeGame() {
      const game = Game.getInstance();
      try {
        await game.start(); // Wait for WebSocket connection
        setIsLoading(false); // Update state to stop showing "connecting" message
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        // Handle the error if necessary
      }
    }

    initializeGame();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <div className="border border-slate-900  shadow rounded-lg p-4 max w-full mx-auto ">
            <div className="animate-pulse flex space-x-4  ">
              <div className="flex-1 space-y-6 py-1">
                Loading..
                <p className="normal-case text-2xl">Connecting to server...</p>
                <div className="h-2 bg-slate-400 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 ">
                    <div className="h-2 bg-slate-400 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-400 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-400 rounded"></div>
                  <button
                    type="button"
                    className="w-full text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Please wait..
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-0 text-white p-4 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm">Health:</p>
              <div className="h-4 w-48 bg-red-500 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-700"
                  style={{
                    width: "75%",
                  }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm">Score:</p>
              <p className="text-lg font-bold">12345</p>
            </div>
          </div>
          <div>
            <p className="text-sm">Time:</p>
            <p className="text-lg font-bold">12:34</p>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/4 right-1/4 bg-gray-700 bg-opacity-0 text-white p-4 z-50">
          <div className="grid grid-cols-9 gap-2 justify-items-center">
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
            <svg
              className=" w-4 h-4 text-white"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
              <path d="M6 18h12" />
              <path d="M6 14h12" />
              <rect height="12" width="12" x="6" y="10" />
            </svg>
          </div>
        </div>
      </div>  

        /* Render your game content here */
      )}
    </>
  );
}
