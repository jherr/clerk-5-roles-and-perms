CREATE TABLE `shows` (
	`id` integer PRIMARY KEY NOT NULL,
	`orgId` text NOT NULL,
	`showId` integer NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`name` text(255) NOT NULL,
	`image` text(1024) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY NOT NULL,
	`orgId` text NOT NULL,
	`userId` text(255) NOT NULL,
	`showId` integer NOT NULL,
	`order` integer NOT NULL
);
