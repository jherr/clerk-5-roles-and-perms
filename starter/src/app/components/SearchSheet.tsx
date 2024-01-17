"use client";
import { useCallback } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Show, Vote } from "@/db/schema";

import Search from "./Search";
import { useShowsContext } from "./ShowContext";

export default function SearchSheet({
  open,
  onOpenChange,
  addShow,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  addShow: (
    showId: number,
    name: string,
    image: string
  ) => Promise<{ shows: Show[]; votes: Vote[] }>;
}) {
  const { setShows, setVotes } = useShowsContext();
  const onAddShow = useCallback(
    (showId: number, name: string, image: string) => {
      addShow(showId, name, image).then(({ shows, votes }) => {
        setShows(shows);
        setVotes(votes);
      });
    },
    [addShow, setVotes, setShows]
  );

  return (
    <Sheet modal open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>TV Show Search</SheetTitle>
          <SheetDescription asChild>
            <Search
              addShow={onAddShow}
              onClose={() => {
                onOpenChange(false);
              }}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
