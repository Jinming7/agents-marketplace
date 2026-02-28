'use client'

import Link from 'next/link'

const stats = [
  { value: '200K+', label: 'Active Users' },
  { value: '500+', label: 'Apps Available' },
  { value: '150+', label: 'Developer Partners' },
  { value: '99.9%', label: 'Uptime SLA' },
]

const values = [
  {
    icon: '🎯',
    title: 'Quality First',
    description: 'Every app is reviewed and tested before listing. We maintain high standards for security and performance.',
  },
  {
    icon: '🤝',
    title: 'Trust & Transparency',
    description: 'Clear pricing, honest reviews, and verified developers. No hidden fees or surprises.',
  },
  {
    icon: '🚀',
    title: 'Developer Success',
    description: 'We help developers reach more customers with fair revenue sharing and marketing support.',
  },
  {
    icon: '🔒',
    title: 'Security & Privacy',
    description: 'SOC 2 compliant platform with enterprise-grade security. Your data stays protected.',
  },
]

const team = [
  { name: 'Sarah Chen', role: 'CEO & Co-founder', avatar: '👩‍💼' },
  { name: 'Michael Park', role: 'CTO & Co-founder', avatar: '👨‍💻' },
  { name: 'Emily Rodriguez', role: 'Head of Product', avatar: '👩‍🔬' },
  { name: 'David Kim', role: 'Head of Engineering', avatar: '👨‍🎨' },
]

const milestones = [
  { year: '2020', event: 'ONES Marketplace founded' },
  { year: '2021', event: 'Reached 10,000 users' },
  { year: '2022', event: 'Launched developer program' },
  { year: '2023', event: 'Expanded to 50+ countries' },
  { year: '2024', event: 'Surpassed 200,000 users' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Empowering Teams with Better Tools
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            ONES Marketplace connects teams with the best enterprise apps, 
            helping them work smarter and achieve more together.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl border shadow-lg p-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We believe that the right tools can transform how teams work. 
            Our mission is to make discovering, evaluating, and adopting 
            enterprise software as simple as installing an app on your phone.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(value => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200" />
          <div className="space-y-8">
            {milestones.map((milestone, i) => (
              <div key={milestone.year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white rounded-xl border p-6 inline-block">
                    <div className="text-blue-600 font-bold text-lg mb-1">{milestone.year}</div>
                    <div className="text-gray-700">{milestone.event}</div>
                  </div>
                </div>
                <div className="w-4 h-4 bg-blue-600 rounded-full relative z-10" />
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Whether you're a developer looking to reach more customers or a team 
            searching for the perfect tools, we're here to help.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50"
            >
              Browse Apps
            </Link>
            <Link
              href="/developers"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400"
            >
              Become a Developer
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}