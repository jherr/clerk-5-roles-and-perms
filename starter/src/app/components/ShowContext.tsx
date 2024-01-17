"use client";
import { createContext, useContext, useState } from "react";
import type { Show, Vote } from "@/db/schema";

function useShows(initialShows: Show[], initialVotes: Vote[]) {
  const [shows, setShows] = useState<Show[]>(initialShows);
  const [votes, setVotes] = useState<Vote[]>(initialVotes);
  return {
    shows,
    setShows,
    votes,
    setVotes,
  };
}

const ShowsContext = createContext<ReturnType<typeof useShows> | null>(null);

export function useShowsContext() {
  const context = useContext(ShowsContext);
  if (!context) {
    throw new Error("useShowsContext must be used within a ShowsProvider");
  }
  return context;
}

export function ShowsProvider({
  shows,
  votes,
  children,
}: {
  shows: Show[];
  votes: Vote[];
  children: React.ReactNode;
}) {
  return (
    <ShowsContext.Provider value={useShows(shows, votes)}>
      {children}
    </ShowsContext.Provider>
  );
}
