import pool from '../config/database.js'

// Use 'marketplace_' prefix to avoid conflict with existing 'apps' table
const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apps table (marketplace apps with full details)
CREATE TABLE IF NOT EXISTS marketplace_apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_name VARCHAR(100),
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  version VARCHAR(50),
  developer VARCHAR(255),
  last_updated DATE,
  pricing VARCHAR(255),
  highlights TEXT[],
  screenshots TEXT[],
  compatibility TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id UUID REFERENCES marketplace_apps(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_marketplace_apps_category ON marketplace_apps(category_name);
CREATE INDEX IF NOT EXISTS idx_marketplace_apps_name ON marketplace_apps(name);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_app ON marketplace_reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user ON marketplace_reviews(user_id);
`

async function initializeDatabase() {
  console.log('[Supabase] Initializing database...')
  
  const client = await pool.connect()
  
  try {
    // Create schema
    console.log('[Supabase] Creating tables...')
    await client.query(schema)
    console.log('[Supabase] Tables created successfully')
    
    // Insert categories
    console.log('[Supabase] Seeding categories...')
    await client.query(`
      INSERT INTO marketplace_categories (name, description, icon) VALUES
        ('Collaboration', 'Team communication and collaboration tools', 'users'),
        ('Productivity', 'Tools to boost productivity', 'check-circle'),
        ('Knowledge', 'Documentation and knowledge management', 'book'),
        ('Development', 'Developer tools and platforms', 'code'),
        ('Design', 'Design and creative tools', 'palette')
      ON CONFLICT (name) DO NOTHING
    `)
    
    // Insert apps
    console.log('[Supabase] Seeding apps...')
    await client.query(`
      INSERT INTO marketplace_apps (name, description, category_name, installs, rating, version, developer, last_updated, pricing, highlights, screenshots, compatibility) VALUES
        ('Slack', 'Team communication platform', 'Collaboration', 10000, 4.5, '4.35.0', 'Salesforce', '2024-01-15', 'Free tier, $12.75/user/month', ARRAY['Real-time messaging', 'Channel organization', 'App integrations'], ARRAY['https://example.com/slack1.png', 'https://example.com/slack2.png'], ARRAY['Web', 'Desktop', 'Mobile']),
        ('Jira', 'Project tracking tool', 'Productivity', 8000, 4.3, '9.12.0', 'Atlassian', '2024-01-10', 'Free for up to 10 users', ARRAY['Agile boards', 'Issue tracking', 'Reporting'], ARRAY['https://example.com/jira1.png'], ARRAY['Web', 'Desktop']),
        ('Confluence', 'Documentation platform', 'Knowledge', 6000, 4.2, '8.5.0', 'Atlassian', '2024-01-08', 'Free for up to 10 users', ARRAY['Team workspaces', 'Templates', 'Real-time collaboration'], ARRAY['https://example.com/confluence1.png'], ARRAY['Web', 'Desktop', 'Mobile']),
        ('GitHub', 'Code collaboration', 'Development', 15000, 4.8, '2024.01', 'Microsoft', '2024-01-20', 'Free for individuals', ARRAY['Git repositories', 'CI/CD', 'Code review'], ARRAY['https://example.com/github1.png', 'https://example.com/github2.png'], ARRAY['Web', 'Desktop', 'CLI']),
        ('Figma', 'Design tool', 'Design', 5000, 4.6, '2024.01', 'Figma Inc.', '2024-01-18', 'Free tier available', ARRAY['Vector editing', 'Prototyping', 'Design systems'], ARRAY['https://example.com/figma1.png'], ARRAY['Web', 'Desktop'])
      ON CONFLICT DO NOTHING
    `)
    
    // Get Slack and GitHub app IDs for reviews
    const slackResult = await client.query("SELECT id FROM marketplace_apps WHERE name = 'Slack' LIMIT 1")
    const githubResult = await client.query("SELECT id FROM marketplace_apps WHERE name = 'GitHub' LIMIT 1")
    
    if (slackResult.rows.length > 0) {
      const slackId = slackResult.rows[0].id
      // Check if reviews already exist for Slack
      const existingSlackReviews = await client.query('SELECT COUNT(*) FROM marketplace_reviews WHERE app_id = $1', [slackId])
      if (parseInt(existingSlackReviews.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO marketplace_reviews (app_id, user_id, user_name, rating, comment) VALUES
            ($1, 'u1', 'John D.', 5, 'Great team communication tool!'),
            ($1, 'u2', 'Jane S.', 4, 'Very useful, but can be noisy')
        `, [slackId])
      }
    }
    
    if (githubResult.rows.length > 0) {
      const githubId = githubResult.rows[0].id
      // Check if reviews already exist for GitHub
      const existingGithubReviews = await client.query('SELECT COUNT(*) FROM marketplace_reviews WHERE app_id = $1', [githubId])
      if (parseInt(existingGithubReviews.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO marketplace_reviews (app_id, user_id, user_name, rating, comment) VALUES
            ($1, 'u3', 'Dev Pro', 5, 'Essential for any development team')
        `, [githubId])
      }
    }
    
    console.log('[Supabase] Data seeded successfully')
    
    // Verify data
    const appsResult = await client.query('SELECT COUNT(*) FROM marketplace_apps')
    const categoriesResult = await client.query('SELECT COUNT(*) FROM marketplace_categories')
    const reviewsResult = await client.query('SELECT COUNT(*) FROM marketplace_reviews')
    
    console.log('[Supabase] Database initialized:')
    console.log(`  - Apps: ${appsResult.rows[0].count}`)
    console.log(`  - Categories: ${categoriesResult.rows[0].count}`)
    console.log(`  - Reviews: ${reviewsResult.rows[0].count}`)
    
    client.release()
    return true
  } catch (error) {
    client.release()
    console.error('[Supabase] Database initialization failed:', error)
    throw error
  }
}

export default initializeDatabase
