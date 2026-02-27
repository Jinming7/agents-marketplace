// Database schema migration for ONES Marketplace
// Run this script to set up the database: npx tsx src/migrations/001_initial_schema.ts

import pool from '../config/database.js'

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  installs INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  version VARCHAR(50),
  developer VARCHAR(200),
  last_updated TIMESTAMP WITH TIME ZONE,
  pricing VARCHAR(200),
  highlights TEXT[],
  screenshots TEXT[],
  compatibility TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apps_category ON apps(category_id);
CREATE INDEX IF NOT EXISTS idx_apps_installs ON apps(installs DESC);
CREATE INDEX IF NOT EXISTS idx_apps_rating ON apps(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_app_id ON reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200),
  avatar TEXT,
  bio TEXT,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User installations table
CREATE TABLE IF NOT EXISTS user_installations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id)
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user tables
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_installations_user_id ON user_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_installations_app_id ON user_installations(app_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

`

async function runMigration() {
  console.log('[Migration] Starting database schema setup...')
  
  try {
    await pool.query(schema)
    console.log('[Migration] Schema created successfully!')
    
    // Seed initial data if tables are empty
    const categoryCheck = await pool.query('SELECT COUNT(*) FROM categories')
    if (parseInt(categoryCheck.rows[0].count) === 0) {
      console.log('[Migration] Seeding initial data...')
      
      // Insert categories
      await pool.query(`
        INSERT INTO categories (name, description) VALUES
        ('Collaboration', 'Team communication and collaboration tools'),
        ('Productivity', 'Tools to boost productivity'),
        ('Knowledge', 'Knowledge management and documentation'),
        ('Development', 'Software development tools'),
        ('Design', 'Design and creative tools')
        ON CONFLICT (name) DO NOTHING
      `)
      
      // Insert sample apps
      await pool.query(`
        INSERT INTO apps (name, description, installs, rating, version, developer, last_updated, pricing, highlights, screenshots, compatibility)
        VALUES 
        ('Slack', 'Team communication platform', 10000, 4.5, '4.35.0', 'Salesforce', NOW(), 'Free tier, $12.75/user/month', ARRAY['Real-time messaging', 'Channel organization', 'App integrations'], ARRAY['https://example.com/slack1.png'], ARRAY['Web', 'Desktop', 'Mobile']),
        ('Jira', 'Project tracking tool', 8000, 4.3, '9.12.0', 'Atlassian', NOW(), 'Free for up to 10 users', ARRAY['Agile boards', 'Issue tracking', 'Reporting'], ARRAY['https://example.com/jira1.png'], ARRAY['Web', 'Desktop']),
        ('Confluence', 'Documentation platform', 6000, 4.2, '8.5.0', 'Atlassian', NOW(), 'Free for up to 10 users', ARRAY['Team workspaces', 'Templates', 'Real-time collaboration'], ARRAY['https://example.com/confluence1.png'], ARRAY['Web', 'Desktop', 'Mobile']),
        ('GitHub', 'Code collaboration', 15000, 4.8, '2024.01', 'Microsoft', NOW(), 'Free for individuals', ARRAY['Git repositories', 'CI/CD', 'Code review'], ARRAY['https://example.com/github1.png'], ARRAY['Web', 'Desktop', 'CLI']),
        ('Figma', 'Design tool', 5000, 4.6, '2024.01', 'Figma Inc.', NOW(), 'Free tier available', ARRAY['Vector editing', 'Prototyping', 'Design systems'], ARRAY['https://example.com/figma1.png'], ARRAY['Web', 'Desktop'])
        ON CONFLICT DO NOTHING
      `)
      
      console.log('[Migration] Initial data seeded!')
    }
    
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('[Migration] Error:', error)
    await pool.end()
    process.exit(1)
  }
}

runMigration()
