-- Create user_favourites table with camelCase column names
CREATE TABLE IF NOT EXISTS "user_favourites" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "imageId" UUID NOT NULL REFERENCES project_images(id) ON DELETE CASCADE,
  "projectId" UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("userId", "imageId")
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favourites_userId ON "user_favourites"("userId");
CREATE INDEX IF NOT EXISTS idx_user_favourites_projectId ON "user_favourites"("projectId");
CREATE INDEX IF NOT EXISTS idx_user_favourites_imageId ON "user_favourites"("imageId");

-- Add RLS policies
ALTER TABLE "user_favourites" ENABLE ROW LEVEL SECURITY;

-- Policy for selecting favourites (users can only see their own favourites)
CREATE POLICY select_user_favourites ON "user_favourites"
  FOR SELECT USING (auth.uid() = "userId");

-- Policy for inserting favourites (users can only add their own favourites)
CREATE POLICY insert_user_favourites ON "user_favourites"
  FOR INSERT WITH CHECK (auth.uid() = "userId");

-- Policy for deleting favourites (users can only delete their own favourites)
CREATE POLICY delete_user_favourites ON "user_favourites"
  FOR DELETE USING (auth.uid() = "userId");

-- Grant access to authenticated users
GRANT SELECT, INSERT, DELETE ON "user_favourites" TO authenticated;