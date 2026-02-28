export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
          <p className="text-gray-500 mb-4">Learn how to install and configure apps</p>
          <a href="#" className="text-blue-600 hover:underline">Read Guide →</a>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">API Reference</h2>
          <p className="text-gray-500 mb-4">Build your own apps with our API</p>
          <a href="#" className="text-blue-600 hover:underline">View Docs →</a>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Developer Guide</h2>
          <p className="text-gray-500 mb-4">Publish apps to the marketplace</p>
          <a href="#" className="text-blue-600 hover:underline">Learn More →</a>
        </div>
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Best Practices</h2>
          <p className="text-gray-500 mb-4">Tips for app development</p>
          <a href="#" className="text-blue-600 hover:underline">Read Tips →</a>
        </div>
      </div>
    </div>
  )
}