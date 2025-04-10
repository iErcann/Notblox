import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface GameCardProps {
  title: string
  imageUrl: string
  slug: string
  metaDescription: string
}

export default function GameCard({ title, imageUrl, slug, metaDescription }: GameCardProps) {
  return (
    <a
      href={`/play/${slug}`}
      className="block group transition-transform duration-100 hover:scale-[1.02] h-full"
    >
      <Card className="relative h-full overflow-hidden rounded-2xl bg-gray-900/90 drop-shadow-4 hover:drop-shadow-5  ">
        {/* Fixed height image container */}
        <div className={`relative w-full h-64 lg:h-96`}>
          <img
            alt={title}
            src={imageUrl}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/0 to-transparent" />
        </div>

        <CardHeader className="absolute bottom-0 w-full p-4 space-y-2 sm:p-6">
          <CardTitle className="text-xl font-bold text-white md:text-xl  ">{title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm/relaxed text-gray-200/95 leading-relaxed">
            {metaDescription}
          </CardDescription>
        </CardHeader>
      </Card>
    </a>
  )
}

/**
 * A compact version of the GameCard component for use in sidebars, related games sections,
 * or any other UI element where space is limited.
 */
export function MiniGameCard({ title, imageUrl, slug, metaDescription }: GameCardProps) {
  return (
    <a
      href={`/play/${slug}`}
      className="block group transition-transform duration-100 hover:scale-[1.02] h-full"
    >
      <Card className="relative h-full overflow-hidden rounded-xl bg-gray-900/90 drop-shadow-3 hover:drop-shadow-4">
        {/* Smaller fixed height image container */}
        <div className={`relative w-full h-40 lg:h-64`}>
          <img
            alt={title}
            src={imageUrl}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-gray-900/0 to-transparent" />
        </div>

        <CardHeader className="absolute bottom-0 w-full p-3 space-y-1">
          <CardTitle className="text-base text-white md:text-xl  ">{title}</CardTitle>
          <CardDescription className="line-clamp-1 text-xs/relaxed text-gray-200/95">
            {metaDescription}
          </CardDescription>
        </CardHeader>
      </Card>
    </a>
  )
}

/**
 * A micro version of the GameCard component for use in compact UI elements
 * where minimal space is available.
 */
export function MicroGameCard({ title, imageUrl, slug }: Omit<GameCardProps, 'metaDescription'>) {
  return (
    <a
      href={`/play/${slug}`}
      className="block group transition-transform duration-200 hover:scale-[1.03]"
    >
      <Card className="relative overflow-hidden rounded-md bg-gray-900 drop-shadow-md hover:drop-shadow-lg border-0">
        <div className="relative w-full h-12 aspect-square">
          <img
            alt={title}
            src={imageUrl}
            className="h-full w-full object-cover brightness-100 group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/30" />
          <CardTitle className="absolute bottom-1 left-1 text-xs/relaxed text-white truncate w-5/6">
            {title}
          </CardTitle>
        </div>
      </Card>
    </a>
  )
}
