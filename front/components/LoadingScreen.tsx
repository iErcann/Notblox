export default function LoadingScreen() {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <div className="border border-slate-900 shadow rounded-lg p-4 max w-full mx-auto">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            Loading..
            <p className="normal-case text-2xl">Connecting to server...</p>
            <div className="h-2 bg-slate-400 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-400 rounded col-span-2"></div>
                <div className="h-2 bg-slate-400 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-400 rounded"></div>
              <button
                type="button"
                className="w-full text-white bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800  shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Please wait..
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
