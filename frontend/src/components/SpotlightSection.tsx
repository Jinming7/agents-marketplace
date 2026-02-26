import { Bot, ShieldCheck, Sparkles } from "lucide-react";

const spotlightCollections = [
  {
    title: "Cloud Fortified Apps",
    description: "Security-reviewed integrations trusted by regulated enterprise teams.",
    icon: <ShieldCheck className="h-16 w-16 text-blue-500/20" />,
    gradient: "from-blue-50 to-indigo-50"
  },
  {
    title: "New & Noteworthy",
    description: "Fresh launches with modern UX, high adoption, and rapid iteration.",
    icon: <Sparkles className="h-16 w-16 text-indigo-500/20" />,
    gradient: "from-indigo-50 to-violet-50"
  },
  {
    title: "AI Productivity",
    description: "Copilots and assistants that speed up planning and delivery workflows.",
    icon: <Bot className="h-16 w-16 text-cyan-500/20" />,
    gradient: "from-cyan-50 to-blue-50"
  }
];

export function SpotlightSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">Spotlight Collections</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {spotlightCollections.map((item) => (
          <article
            key={item.title}
            className="min-h-[200px] overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${item.gradient}`}>
              {item.icon}
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
              <a href="#" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline">
                Explore collection →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
