/*
  Warnings:

  - The values [HOURLY,DAILY] on the enum `Frequency` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Frequency_new" AS ENUM ('hourly', 'daily');
ALTER TABLE "subscriptions" ALTER COLUMN "frequency" TYPE "Frequency_new" USING ("frequency"::text::"Frequency_new");
ALTER TYPE "Frequency" RENAME TO "Frequency_old";
ALTER TYPE "Frequency_new" RENAME TO "Frequency";
DROP TYPE "Frequency_old";
COMMIT;
