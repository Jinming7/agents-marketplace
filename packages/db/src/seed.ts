import 'dotenv/config'
import { db, marketplaceApps, marketplaceCategories, marketplaceReviews } from './index.js'
import { generateMockApps } from './seed-data.js'

async function seed() {
  console.log('🌱 Starting database seed...')
  
  try {
    // Generate mock data
    const mockApps = generateMockApps(100)
    
    // Extract unique categories
    const categoryMap = new Map<string, number>()
    mockApps.forEach(app => {
      categoryMap.set(app.category, (categoryMap.get(app.category) || 0) + 1)
    })
    
    // Insert categories
    console.log('📁 Inserting categories...')
    const categoriesData = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      description: `${name} applications`,
      icon: getCategoryIcon(name),
    }))
    
    for (const cat of categoriesData) {
      await db.insert(marketplaceCategories).values(cat).onConflictDoNothing()
    }
    console.log(`✅ Inserted ${categoriesData.length} categories`)
    
    // Insert apps
    console.log('📱 Inserting apps...')
    for (const app of mockApps) {
      const appData = {
        name: app.name,
        description: app.description,
        categoryName: app.category,
        installs: app.downloads,
        rating: app.rating.toString(),
        version: '3.2.0',
        developer: app.developer,
        lastUpdated: app.updatedAt.split('T')[0],
        pricing: JSON.stringify(app.pricing),
        highlights: app.features || [],
        screenshots: app.screenshots || [],
        compatibility: ['ONES 3.0+', 'Cloud', 'Data Center'],
        icon: app.icon,
        featured: app.featured,
        verified: app.verified,
      }
      
      await db.insert(marketplaceApps).values(appData).onConflictDoNothing()
    }
    console.log(`✅ Inserted ${mockApps.length} apps`)
    
    // Insert reviews
    console.log('⭐ Inserting reviews...')
    let reviewCount = 0
    for (const app of mockApps) {
      if (app.reviews && app.reviews.length > 0) {
        for (const review of app.reviews) {
          await db.insert(marketplaceReviews).values({
            userName: review.author,
            rating: review.rating,
            comment: review.comment,
            createdAt: new Date(review.date),
          }).onConflictDoNothing()
          reviewCount++
        }
      }
    }
    console.log(`✅ Inserted ${reviewCount} reviews`)
    
    console.log('🎉 Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
  
  process.exit(0)
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Project Management': '📊',
    'Automation': '⚡',
    'Communication': '💬',
    'Analytics': '📈',
    'Design': '🎨',
    'Development': '👨‍💻',
    'AI & Machine Learning': '🤖',
    'Security': '🔒',
  }
  return icons[category] || '📦'
}

seed()