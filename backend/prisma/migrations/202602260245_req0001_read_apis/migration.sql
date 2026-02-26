ALTER TABLE "App"
  ADD COLUMN "installCount7d" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "compatibility" JSONB,
  ADD COLUMN "minOnesVersion" TEXT,
  ADD COLUMN "screenshots" JSONB,
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "App_isPublished_idx" ON "App"("isPublished");
CREATE INDEX "App_installCount7d_idx" ON "App"("installCount7d");
