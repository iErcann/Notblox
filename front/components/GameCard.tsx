import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { GameInfo } from '@/types'

export default function GameCard({ title, imageUrl, slug, metaDescription }: GameInfo) {
  return (
    <a href={`/play/${slug}`} className="block transition-transform duration-300 hover:scale-105">
      <Card className="relative overflow-hidden rounded-2xl bg-gray-900/90 drop-shadow-4">
        <img
          alt={title}
          src={imageUrl}
          className="absolute inset-0 h-full w-full object-cover transition duration-300 hover:blur-sm"
        />
        <div className="relative bg-gradient-to-t from-gray-900/30 to-gray-900/0 pt-32 sm:pt-48 lg:pt-64">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">{title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2 text-sm/relaxed text-white/95">
              {metaDescription}
            </CardDescription>
          </CardHeader>
        </div>
      </Card>
    </a>
  )
}
