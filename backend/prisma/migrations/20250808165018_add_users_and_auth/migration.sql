/*
  Warnings:

  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploaderId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- Create default user for existing data
INSERT INTO "public"."User" ("username", "password") VALUES ('default_user', '$2a$10$dummy.hash.for.existing.data');

-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "uploaderId" INTEGER NOT NULL DEFAULT 1;

-- Update existing records to use the default user
UPDATE "public"."Comment" SET "userId" = 1 WHERE "userId" = 1;
UPDATE "public"."Image" SET "uploaderId" = 1 WHERE "uploaderId" = 1;

-- Remove default values
ALTER TABLE "public"."Comment" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "public"."Image" ALTER COLUMN "uploaderId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
