import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // adapter is only needed for migrate commands, not for prisma generate
    ...(connectionString
      ? {
          adapter: () =>
            new PrismaPg({ connectionString }),
        }
      : {}),
  },
});
