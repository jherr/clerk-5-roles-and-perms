"use client";
import Image from "next/image";
import { useState } from "react";
import { useDebounce } from "react-use";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";

import type { SearchShow } from "@/app/types";

export default function Search({
  addShow,
  onClose,
}: {
  addShow: (showId: number, name: string, image: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(q);
  useDebounce(
    () => {
      setDebouncedQuery(q);
    },
    500,
    [q]
  );

  const { data } = useQuery<SearchShow[]>({
    queryKey: ["shows", debouncedQuery],
    queryFn: () =>
      fetch(`/shows/search?q=${encodeURIComponent(debouncedQuery)}`).then(
        (res) => res.json()
      ),
  });

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Search"
        value={q}
        onChange={(evt) => setQ(evt.target.value)}
      />
      <div className="flex flex-wrap mt-2">
        {data?.map((show) => (
          <div
            key={show.id}
            className="flex pt-2 text-white w-full cursor-pointer text-left"
            onClick={() => {
              addShow(show.id, show.name, show.poster);
              onClose();
            }}
          >
            <Image
              src={show.poster}
              alt={show.name}
              className="w-12 aspect-w-9 aspect-h-16 rounded-tl-lg rounded-bl-lg object-cover"
              width={500}
              height={800}
            />
            <div className="pl-2 pr-2 text-xl border-gray-500 border-2 border-l-0 rounded-tr-lg rounded-br-lg w-full cursor-pointer">
              {show.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
