import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq, asc, and } from "drizzle-orm";
import Database from "better-sqlite3";

import { shows, votes } from "./schema";

const sqlite = new Database("sqlite.db");
const connection = drizzle(sqlite, {
  schema: { shows, votes },
});

migrate(connection, { migrationsFolder: "drizzle" });

export async function getShows() {
  return await connection.query.shows.findMany({
    orderBy: [asc(shows.order)],
  });
}

export async function getVotes(userId: string) {
  return await connection.query.votes.findMany({
    where: eq(votes.userId, userId),
  });
}

export async function addShow(
  userId: string,
  showId: number,
  name: string,
  image: string
) {
  const show = await connection
    .insert(shows)
    .values({ showId, name, image })
    .onConflictDoNothing()
    .execute();

  const votesForUser = await connection.query.votes
    .findMany({
      where: and(eq(votes.userId, userId)),
    })
    .execute();

  await connection
    .insert(votes)
    .values({ showId, userId, order: votesForUser.length })
    .execute();

  await updateShowOrder();

  return show;
}

export async function updateShowOrder() {
  const showVotes: Record<number, number> = {};

  const allShows = await connection.query.shows.findMany().execute();
  for (const { showId } of allShows) {
    showVotes[showId] = 0;
  }

  const showCount = Object.keys(showVotes).length;

  const votes = await connection.query.votes.findMany();
  for (const vote of votes) {
    showVotes[vote.showId] =
      (showVotes[vote.showId] || 0) + (showCount - vote.order);
  }

  const order = Object.keys(showVotes).sort(
    (a, b) => showVotes[+b] - showVotes[+a]
  );

  for (const id of order) {
    await connection
      .update(shows)
      .set({ order: order.indexOf(id) })
      .where(eq(shows.showId, +id))
      .execute();
  }
}

export async function updateVotes(
  userId: string,
  votingOrder: {
    showId: number;
    order: number;
  }[]
) {
  const show = await connection
    .delete(votes)
    .where(eq(votes.userId, userId))
    .execute();

  for (const vote of votingOrder) {
    await connection
      .insert(votes)
      .values({ ...vote, userId })
      .execute();
  }

  await updateShowOrder();

  return show;
}
