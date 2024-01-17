import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import MainPage from "./components/MainPage";

import { addShow, getShows, getVotes, updateVotes } from "@/db";

export default function Home() {
  const { userId, orgId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
    return <div>No organization</div>;
  }

  const addShowAction = async (showId: number, name: string, image: string) => {
    "use server";
    const { has } = auth();
    if (userId && has({ permission: "org:show:create" })) {
      await addShow(userId, showId, name, image);
    }
    return {
      shows: await getShows(),
      votes: userId ? await getVotes(userId) : [],
    };
  };

  const updateVotesAction = async (
    votes: {
      showId: number;
      order: number;
    }[]
  ) => {
    "use server";
    const { has } = auth();
    if (userId && has({ permission: "org:vote:create" })) {
      await updateVotes(userId, votes);
    }
    return {
      shows: await getShows(),
      votes: userId ? await getVotes(userId) : [],
    };
  };

  return (
    <div className="pt-3">
      <MainPage addShow={addShowAction} updateVotesAction={updateVotesAction} />
    </div>
  );
}
