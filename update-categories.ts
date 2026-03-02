import postgres from 'postgres'

const DATABASE_URL = 'postgresql://postgres.nshivvjuaggohjovldfd:pengjinming123@aws-1-ap-south-1.pooler.supabase.com:5432/postgres'

async function updateCategories() {
  const client = postgres(DATABASE_URL, { prepare: false, max: 1 })
  
  // Update categories to English
  await client`
    UPDATE categories SET 
      name = 'Project Management',
      description = 'Project planning, tracking and collaboration tools'
    WHERE slug = 'project-management'
  `
  
  await client`
    UPDATE categories SET 
      name = 'Development Tools',
      description = 'Code review, CI/CD, version control'
    WHERE slug = 'development-tools'
  `
  
  await client`
    UPDATE categories SET 
      name = 'Documentation',
      description = 'Knowledge management, document editing, Wiki'
    WHERE slug = 'documentation'
  `
  
  await client`
    UPDATE categories SET 
      name = 'Design',
      description = 'UI/UX design, prototyping'
    WHERE slug = 'design'
  `
  
  await client`
    UPDATE categories SET 
      name = 'Automation',
      description = 'Workflow automation, integration tools'
    WHERE slug = 'automation'
  `
  
  await client`
    UPDATE categories SET 
      name = 'Security',
      description = 'Security scanning, compliance audit'
    WHERE slug = 'security'
  `
  
  // Update marketplace_apps category names
  await client`
    UPDATE marketplace_apps SET category_name = 'Project Management' 
    WHERE category_name = '项目管理'
  `
  
  await client`
    UPDATE marketplace_apps SET category_name = 'Development Tools' 
    WHERE category_name = '开发工具'
  `
  
  await client`
    UPDATE marketplace_apps SET category_name = 'Documentation' 
    WHERE category_name = '文档协作'
  `
  
  await client`
    UPDATE marketplace_apps SET category_name = 'Design' 
    WHERE category_name = '设计工具'
  `
  
  await client`
    UPDATE marketplace_apps SET category_name = 'Automation' 
    WHERE category_name = '自动化'
  `
  
  await client`
    UPDATE marketplace_apps SET category_name = 'Security' 
    WHERE category_name = '安全合规'
  `
  
  // Verify
  const categories = await client`SELECT * FROM categories`
  console.log('Updated categories:', categories)
  
  const appCategories = await client`
    SELECT DISTINCT category_name FROM marketplace_apps
  `
  console.log('App categories:', appCategories)
  
  await client.end()
  console.log('Done!')
}

updateCategories().catch(console.error)