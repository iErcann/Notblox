
export default function GameHud() {
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
        <div className="absolute bottom-4 left-1/4 right-1/4 bg-gray-700 bg-opacity-0 text-white p-4 z-50">
          <div className="grid grid-cols-9 gap-2 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7].map((index) => (
              <svg
                key={index}
                className="w-4 h-4 text-white"
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
                <path
                  d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"
                />
                <path d="M6 18h12" />
                <path d="M6 14h12" />
                <rect height="12" width="12" x="6" y="10" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    );
  }