"use client";
import ShowCard from "./ShowCard";
import { useShowsContext } from "./ShowContext";

export default function ShowList() {
  const { shows } = useShowsContext();

  return (
    <>
      <h1 className="text-2xl font-bold my-3">What We&apos;re Watching</h1>
      <div className="grid md:grid-cols-2 ">
        {shows.map((show, index) => (
          <div key={show.id} className="flex items-center">
            <div className="mr-3 font-bold text-4xl md:ml-2">#{index + 1}.</div>
            <ShowCard poster={show.image} name={show.name} />
          </div>
        ))}
      </div>
    </>
  );
}
