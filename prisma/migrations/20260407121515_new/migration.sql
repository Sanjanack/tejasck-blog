-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "series" SET DEFAULT 'From Filter Coffee to German Bread';

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");
