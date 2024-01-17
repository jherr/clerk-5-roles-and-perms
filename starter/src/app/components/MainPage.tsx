"use client";
import { useState } from "react";

import ShowList from "./ShowList";

import { Button } from "@/components/ui/button";

export default function MainPage() {
  const [voting, setVoting] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {!voting && (
        <>
          <ShowList />
          <div className="flex items-center mt-5">
            <div className="flex-grow">
              <Button onClick={() => setSearchOpen(true)} variant="secondary">
                Add A Show
              </Button>
            </div>
            <Button onClick={() => setVoting(true)}>Vote Your Favorites</Button>
          </div>
        </>
      )}
    </>
  );
}
