interface RatingDistributionProps {
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number }
  total: number
  average: number
}

export default function RatingDistribution({ distribution, total, average }: RatingDistributionProps) {
  const maxCount = Math.max(...Object.values(distribution))

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Overall Rating */}
      <div className="text-center mb-6 pb-6 border-b">
        <div className="text-5xl font-bold text-gray-900 mb-2">{average.toFixed(1)}</div>
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${star <= Math.round(average) ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500">{total} reviews</p>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating as keyof typeof distribution]
          const percentage = total > 0 ? (count / total) * 100 : 0
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating} ★</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-12 text-right">
                {percentage > 0 ? `${percentage.toFixed(0)}%` : '0%'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}