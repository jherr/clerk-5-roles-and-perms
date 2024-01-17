"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import type { FC } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Identifier, XYCoord } from "dnd-core";
import update from "immutability-helper";

import { Show, Vote } from "@/db/schema";

import { useShowsContext } from "./ShowContext";
import ShowCard from "./ShowCard";
import { Button } from "@/components/ui/button";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const DraggingShowCard: FC<
  Show & {
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    onRemove: (id: number) => void;
  }
> = ({ id, index, image, name, moveCard, onRemove }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "SHOW",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (
        (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
        (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
      ) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "SHOW",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="cursor-move"
      data-handler-id={handlerId}
    >
      <ShowCard poster={image} name={name} onRemove={() => onRemove(id)} />
    </div>
  );
};

function ShowsToWatch({
  votes,
  moveCard,
  onRemove,
}: {
  votes: Show[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (id: number) => void;
}) {
  const renderCard = useCallback(
    (card: Show, index: number) => {
      return (
        <DraggingShowCard
          key={card.id}
          index={index}
          moveCard={moveCard}
          onRemove={onRemove}
          {...card}
        />
      );
    },
    [moveCard, onRemove]
  );

  return (
    <div className="cursor-move">
      {votes.map((show, i) => renderCard(show, i))}
    </div>
  );
}

function ShowsToAvoid({
  shows,
  votes,
  onAdd,
}: {
  shows: Show[];
  votes: Show[];
  onAdd: (id: number) => void;
}) {
  return (
    <div>
      {shows
        .filter(({ showId }) => !votes.some((v) => showId === v.showId))
        .map((show) => (
          <ShowCard
            key={show.id}
            poster={show.image}
            name={show.name}
            onAdd={() => onAdd(show.id)}
          />
        ))}
    </div>
  );
}

export default function SortableShows({
  onSave,
  updateVotesAction,
}: {
  onSave: () => void;
  updateVotesAction: (
    votes: {
      showId: number;
      order: number;
    }[]
  ) => Promise<{ shows: Show[]; votes: Vote[] }>;
}) {
  const { shows, votes, setShows, setVotes } = useShowsContext();

  const votesToShows = useCallback(
    (votes: Vote[]) =>
      votes
        .toSorted((a, b) => a.order - b.order)
        .map((vote) => shows.find(({ showId }) => showId === vote.showId)!),
    [shows]
  );

  const [currentVotes, setCurrentVotes] = useState<Show[]>(votesToShows(votes));

  useEffect(() => {
    setCurrentVotes(votesToShows(votes));
  }, [votes, votesToShows]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCurrentVotes((prevShows: Show[]) =>
      update(prevShows, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevShows[dragIndex] as Show],
        ],
      }).map((card, index) => ({
        ...card,
        order: index,
      }))
    );
  }, []);

  const onRemove = useCallback((id: number) => {
    setCurrentVotes((prevCards: Show[]) =>
      prevCards.filter((card) => card.id !== id)
    );
  }, []);

  const onAdd = useCallback(
    (id: number) => {
      const show = shows.find(({ id: showId }) => showId === id)!;
      setCurrentVotes((prevVotes: Show[]) =>
        [...prevVotes, show].map((vote, index) => ({
          ...vote,
          order: index,
        }))
      );
    },
    [shows]
  );

  const onSaveClick = useCallback(async () => {
    const newVotes = currentVotes.map((vote, index) => ({
      showId: vote.showId,
      order: vote.order,
    }));
    const result = await updateVotesAction(newVotes);
    if (result) {
      setShows(result.shows);
      setVotes(result.votes);
    }
    onSave();
  }, [currentVotes, setShows, setVotes, updateVotesAction, onSave]);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className="text-2xl font-bold mb-3">Shows You Want To Watch</h1>
      <ShowsToWatch
        votes={currentVotes}
        moveCard={moveCard}
        onRemove={onRemove}
      />
      <h1 className="text-2xl font-bold my-3">
        Shows You Don&apos;t Want To Watch
      </h1>
      <ShowsToAvoid shows={shows} votes={currentVotes} onAdd={onAdd} />
      <div className="mt-5 flex w-full justify-end">
        <Button onClick={onSaveClick}>Save Your Votes</Button>
      </div>
    </DndProvider>
  );
}
