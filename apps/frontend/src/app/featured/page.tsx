import Link from 'next/link'

const featuredApps = [
  { id: '1', name: 'Project Management Plus', icon: '📊', rating: 4.8, installs: 12500 },
  { id: '2', name: 'Workflow Automator', icon: '⚡', rating: 4.6, installs: 8900 },
  { id: '7', name: 'AI Assistant', icon: '🤖', rating: 4.9, installs: 15600 },
  { id: '4', name: 'Team Collaboration', icon: '👥', rating: 4.7, installs: 15200 },
]

export default function FeaturedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Featured Apps</h1>
      <p className="text-gray-500 mb-8">Hand-picked apps by our team</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredApps.map(app => (
          <Link key={app.id} href={`/apps/${app.id}`} className="bg-white rounded-xl border p-6 hover:shadow-lg">
            <div className="text-4xl mb-4">{app.icon}</div>
            <h3 className="font-semibold">{app.name}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span>★ {app.rating}</span>
              <span>•</span>
              <span>{(app.installs/1000).toFixed(1)}k</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}