interface Version {
  version: string
  date: string
  changes: string[]
}

interface VersionHistoryProps {
  versions: Version[]
}

export default function VersionHistory({ versions }: VersionHistoryProps) {
  return (
    <div className="space-y-6">
      {versions.map((v, index) => (
        <div key={v.version} className="relative pl-8">
          {/* Timeline dot */}
          <div className="absolute left-0 top-1 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow" />
          {index < versions.length - 1 && (
            <div className="absolute left-[7px] top-5 w-0.5 h-full bg-gray-200" />
          )}
          
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">v{v.version}</span>
              <span className="text-sm text-gray-500">{v.date}</span>
            </div>
            <ul className="space-y-1">
              {v.changes.map((change, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}