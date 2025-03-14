-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES project_images(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, image_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_project_id ON user_favorites(project_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_image_id ON user_favorites(image_id);

-- Add RLS policies
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policy for selecting favorites (users can only see their own favorites)
CREATE POLICY select_user_favorites ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for inserting favorites (users can only add their own favorites)
CREATE POLICY insert_user_favorites ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for deleting favorites (users can only delete their own favorites)
CREATE POLICY delete_user_favorites ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, DELETE ON user_favorites TO authenticated; 