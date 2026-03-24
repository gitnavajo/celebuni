"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Copy, Check, MapPin, Calendar, Star } from "lucide-react"
import { useState } from "react"

interface FilmographyItem {
  id: string
  title: string
  year: number
  posterUrl: string
  role: string
}

interface ConventionItem {
  id: string
  name: string
  location: string
  date: string
  booth: string
}

interface CelebrityData {
  name: string
  photoUrl: string
  bio: string
  categories: string[]
  filmography: FilmographyItem[]
  conventions: ConventionItem[]
  fanMailAddress: string
}

interface CelebrityProfileCardProps {
  celebrity: CelebrityData
}

export function CelebrityProfileCard({ celebrity }: CelebrityProfileCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(celebrity.fanMailAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Main Profile Card */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_var(--glow-primary)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:gap-8">
            {/* Photo */}
            <div className="relative mx-auto shrink-0 md:mx-0">
              <div className="relative h-48 w-48 overflow-hidden rounded-xl transition-all duration-500 group-hover:shadow-[0_0_30px_-5px_var(--glow-primary)]">
                <Image
                  src={celebrity.photoUrl}
                  alt={celebrity.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-xl ring-2 ring-border/50 transition-all duration-500 group-hover:ring-primary/50" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-center text-center md:text-left">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {celebrity.name}
              </h1>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
                {celebrity.bio}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                {celebrity.categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="border border-border/50 bg-secondary/50 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filmography Section */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_var(--glow-primary)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Filmography</h2>
          </div>
          <div className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent -mx-2 overflow-x-auto px-2 pb-2">
            <div className="flex gap-4">
              {celebrity.filmography.map((film) => (
                <div
                  key={film.id}
                  className="group/poster relative shrink-0 cursor-pointer"
                >
                  <div className="relative h-56 w-40 overflow-hidden rounded-lg transition-all duration-300 group-hover/poster:shadow-[0_0_25px_-5px_var(--glow-accent)]">
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover/poster:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                    <div className="absolute inset-0 rounded-lg ring-1 ring-border/30 transition-all duration-300 group-hover/poster:ring-accent/50" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {film.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {film.year} &middot; {film.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conventions Section */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_var(--glow-primary)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Upcoming Conventions</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Event</TableHead>
                  <TableHead className="text-muted-foreground">Location</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Booth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {celebrity.conventions.map((convention) => (
                  <TableRow
                    key={convention.id}
                    className="border-border/30 transition-colors hover:bg-primary/5"
                  >
                    <TableCell className="font-medium text-foreground">
                      {convention.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {convention.location}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {convention.date}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {convention.booth}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fan Mail Section */}
      <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_var(--glow-primary)]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative p-6">
          <div className="mb-4 flex items-center gap-2">
            <svg
              className="h-5 w-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-foreground">Fan Mail</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 font-mono text-sm text-foreground">
              {celebrity.fanMailAddress}
            </div>
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              className="shrink-0 gap-2 border border-border/50 bg-secondary/50 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Address
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
