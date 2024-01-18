import { auth } from "@clerk/nextjs/server";

import MainPage from "./components/MainPage";

import { addShow, getShows, getVotes, updateVotes } from "@/db";

export default function Home() {
  const { orgId } = auth().protect();

  if (!orgId) {
    return <div>No organization</div>;
  }

  const addShowAction = async (showId: number, name: string, image: string) => {
    "use server";
    const { userId, orgId, has } = auth();
    if (orgId && userId && has({ permission: "org:show:create" })) {
      await addShow(orgId, userId, showId, name, image);
    }
    return {
      shows: orgId ? await getShows(orgId) : [],
      votes: userId && orgId ? await getVotes(orgId, userId) : [],
    };
  };

  const updateVotesAction = async (
    votes: {
      showId: number;
      order: number;
    }[]
  ) => {
    "use server";
    const { userId, orgId, has } = auth();
    if (orgId && userId && has({ permission: "org:vote:create" })) {
      await updateVotes(orgId, userId, votes);
    }
    return {
      shows: orgId ? await getShows(orgId) : [],
      votes: userId && orgId ? await getVotes(orgId, userId) : [],
    };
  };

  return (
    <div className="pt-3">
      <MainPage addShow={addShowAction} updateVotesAction={updateVotesAction} />
    </div>
  );
}
