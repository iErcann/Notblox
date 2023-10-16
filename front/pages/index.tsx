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

        <div className=" p-4 flex flex-col absolute bottom-2.5 left-1/2 transform -translate-x-1/2 -translate-y-1/2        ">
          <h2>
            Inventory
          </h2>
          <div className="flex flex-row">

          {(() => {
            const hotbarSlots = [];
            for (let index = 0; index < 4; index++) {
              hotbarSlots.push(
                <div
                key={index}
                className="w-16 h-16 border border-4 border-gray-600 hover:border-yellow-400 p-2 flex items-center justify-center text-white bg-gray-400 bg-opacity-25"
                  >
                    {index + 1}
                </div>
              );
            }
            return hotbarSlots;
          })()}
          </div>
        </div>
      
        
        /* Render your game content here */
      )}
    </>
  );
}
