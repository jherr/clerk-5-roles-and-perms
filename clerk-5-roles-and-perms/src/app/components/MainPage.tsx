"use client";
import { useState } from "react";
import { Protect } from "@clerk/nextjs";

import ShowList from "./ShowList";
import SearchSheet from "./SearchSheet";
import SortableShows from "./SortableShows";

import { Button } from "@/components/ui/button";

import { Show, Vote } from "@/db/schema";

export default function MainPage({
  addShow,
  updateVotesAction,
}: {
  addShow: (
    showId: number,
    name: string,
    image: string
  ) => Promise<{ shows: Show[]; votes: Vote[] }>;
  updateVotesAction: (
    votes: {
      showId: number;
      order: number;
    }[]
  ) => Promise<{ shows: Show[]; votes: Vote[] }>;
}) {
  const [voting, setVoting] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <Protect permission="org:show:create">
        <SearchSheet
          addShow={addShow}
          open={searchOpen}
          onOpenChange={setSearchOpen}
        />
      </Protect>
      {voting && (
        <Protect permission="org:vote:create">
          <SortableShows
            updateVotesAction={updateVotesAction}
            onSave={() => setVoting(false)}
          />
        </Protect>
      )}
      {!voting && (
        <>
          <ShowList />
          <div className="flex items-center mt-5">
            <div className="flex-grow">
              <Protect permission="org:show:create">
                <Button onClick={() => setSearchOpen(true)} variant="secondary">
                  Add A Show
                </Button>
              </Protect>
            </div>
            <Protect permission="org:vote:create">
              <Button onClick={() => setVoting(true)}>
                Vote Your Favorites
              </Button>
            </Protect>
          </div>
        </>
      )}
    </>
  );
}
