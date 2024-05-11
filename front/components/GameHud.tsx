import { ChatListComponent } from "@shared/component/ChatComponent";
import { useEffect, useRef } from "react";

export interface GameHudProps {
  chatList: ChatListComponent | undefined;
  sendMessage: (message: string) => void;
}
export default function GameHud({ chatList, sendMessage }: GameHudProps) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatList?.list]);
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-0 text-white p-4 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm">Health:</p>
            <div className="h-4 w-48 bg-red-500 rounded-full overflow-hidden">
              <div className="h-full bg-red-700" style={{ width: "75%" }} />
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

      <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-xl p-4 z-50 hidden md:block w-[360px]">
        {/* Chat messages */}
        <div className="overflow-y-auto overflow-hidden max-h-full h-64   ">
          {chatList?.list.map((message, index) => {
            return (
              <div
                key={index}
                className="flex items-center mb-2"
                ref={messagesEndRef}
              >
                <div className="bg-black bg-opacity-20 rounded-lg p-2">
                  <p className="text-sm">
                    <span className="font-medium	">
                      {message.message.author}{" "}
                    </span>{" "}
                    : {message.message.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Chat input */}
        <input
          type="text"
          placeholder="Type your message..."
          className="p-4 bg-gray-600 bg-opacity-20  text-white   w-full rounded-xl"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              sendMessage(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}
