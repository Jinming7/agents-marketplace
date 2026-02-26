import { FileText, ListTodo, PenTool, ShieldCheck, Terminal } from "lucide-react";

interface AppIconProps {
  name: string;
  category?: string;
  sizeClassName?: string;
  iconClassName?: string;
}

type IconConfig = {
  gradient: string;
  Icon: typeof ListTodo;
};

const CATEGORY_MAP: Record<string, IconConfig> = {
  "project management": { gradient: "from-blue-500 to-blue-600", Icon: ListTodo },
  jira: { gradient: "from-blue-500 to-blue-600", Icon: ListTodo },
  automation: { gradient: "from-slate-800 to-slate-900", Icon: Terminal },
  devops: { gradient: "from-slate-800 to-slate-900", Icon: Terminal },
  communication: { gradient: "from-slate-800 to-slate-900", Icon: Terminal },
  "test management": { gradient: "from-slate-800 to-slate-900", Icon: Terminal },
  design: { gradient: "from-pink-500 to-purple-500", Icon: PenTool },
  ai: { gradient: "from-pink-500 to-purple-500", Icon: PenTool },
  security: { gradient: "from-emerald-500 to-teal-600", Icon: ShieldCheck },
  utility: { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
  reporting: { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
  productivity: { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
  "time tracking": { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
  "office/doc": { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
  crm: { gradient: "from-blue-500 to-blue-600", Icon: ListTodo },
  service: { gradient: "from-orange-400 to-yellow-500", Icon: FileText },
};

function hashSeed(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h << 5) - h + text.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const FALLBACKS: IconConfig[] = [
  { gradient: "from-blue-500 to-blue-600", Icon: ListTodo },
  { gradient: "from-slate-800 to-slate-900", Icon: Terminal },
  { gradient: "from-pink-500 to-purple-500", Icon: PenTool },
  { gradient: "from-emerald-500 to-teal-600", Icon: ShieldCheck },
  { gradient: "from-orange-400 to-yellow-500", Icon: FileText }
];

export function AppIcon({
  name,
  category,
  sizeClassName = "h-12 w-12",
  iconClassName = "h-5 w-5"
}: AppIconProps) {
  const key = (category ?? "").toLowerCase();
  const direct = CATEGORY_MAP[key];
  const config = direct ?? FALLBACKS[hashSeed(`${name}:${category ?? ""}`) % FALLBACKS.length];
  const Icon = config.Icon;

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient} shadow-sm ${sizeClassName}`}
      aria-hidden="true"
    >
      <Icon className={`text-white ${iconClassName}`} />
    </div>
  );
}
