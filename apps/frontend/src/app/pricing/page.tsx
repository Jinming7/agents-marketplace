export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <p className="text-3xl font-bold my-4">$0/mo</p>
          <p className="text-gray-500">Basic features</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="text-3xl font-bold my-4">$29/mo</p>
          <p className="text-gray-500">All features</p>
        </div>
      </div>
    </div>
  )
}