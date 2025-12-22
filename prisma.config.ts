import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // استفاده از || برای اطمینان از اینکه اگر متغیر نبود، بیلد متوقف نشود
    url: process.env.DATABASE_URL || process.env["DATABASE_URL"],
  },
});