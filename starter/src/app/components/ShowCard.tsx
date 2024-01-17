import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ShowCard({
  poster,
  name,
  onClick,
  onAdd,
  onRemove,
}: {
  poster: string;
  name: string;
  onClick?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div
      className="flex pt-2 text-white w-full cursor-pointer text-left"
      onClick={onClick}
    >
      <Image
        src={poster}
        alt={name}
        className="w-12 aspect-w-9 aspect-h-16 rounded-tl-lg rounded-bl-lg object-cover"
        width={500}
        height={800}
      />
      <div className="flex pl-2 pr-2 text-xl border-gray-500 border-2 border-l-0 rounded-tr-lg rounded-br-lg w-full cursor-pointer bg-black items-center">
        <div className="w-full">{name}</div>
        {onAdd && (
          <Button variant="secondary" onClick={onAdd}>
            Add
          </Button>
        )}
        {onRemove && (
          <Button variant="destructive" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
