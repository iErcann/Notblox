interface GameCardProps {
  title: string
  imageUrl: string
  serverName: string
  description: string
}

export default function GameCard({ title, imageUrl, serverName, description }: GameCardProps) {
  return (
    <a
      href="/test"
      className="relative overflow-hidden rounded-2xl  bg-gray-900/90 hover:scale-105 transform transition-transform duration-300 drop-shadow-4"
    >
      <img alt={title} src={imageUrl} className="absolute inset-0 h-full w-full object-cover" />

      <div className="relative bg-gradient-to-t from-gray-900/50 to-gray-900/10 pt-32 sm:pt-48 lg:pt-64  ">
        <div className="p-4 sm:p-6">
          <h3 className="mt-0.5 text-lg text-white">{serverName}</h3>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">{description}</p>
        </div>
      </div>
    </a>
  )
}
