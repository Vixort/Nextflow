import {
  Activity,
  AppWindow,
  Blocks,
  Boxes,
  Braces,
  Cloud,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Globe,
  Hexagon,
  Layers,
  LayoutGrid,
  LifeBuoy,
  LineChart,
  MonitorSmartphone,
  Network,
  Palette,
  Plug,
  Puzzle,
  Radar,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Workflow,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type ServiceIconName =
  | 'Activity'
  | 'AppWindow'
  | 'Blocks'
  | 'Boxes'
  | 'Braces'
  | 'Cloud'
  | 'CloudCog'
  | 'Code2'
  | 'Cpu'
  | 'Database'
  | 'Gauge'
  | 'GitBranch'
  | 'Globe'
  | 'Hexagon'
  | 'Layers'
  | 'LayoutGrid'
  | 'LifeBuoy'
  | 'LineChart'
  | 'MonitorSmartphone'
  | 'Network'
  | 'Palette'
  | 'Plug'
  | 'Puzzle'
  | 'Radar'
  | 'Rocket'
  | 'Server'
  | 'Settings2'
  | 'ShieldCheck'
  | 'Smartphone'
  | 'Sparkles'
  | 'Terminal'
  | 'Workflow'
  | 'Wrench'
  | 'Zap'

export const SERVICE_ICONS: Record<ServiceIconName, LucideIcon> = {
  Activity,
  AppWindow,
  Blocks,
  Boxes,
  Braces,
  Cloud,
  CloudCog,
  Code2,
  Cpu,
  Database,
  Gauge,
  GitBranch,
  Globe,
  Hexagon,
  Layers,
  LayoutGrid,
  LifeBuoy,
  LineChart,
  MonitorSmartphone,
  Network,
  Palette,
  Plug,
  Puzzle,
  Radar,
  Rocket,
  Server,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  Workflow,
  Wrench,
  Zap,
}

export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS) as ServiceIconName[]

export const SERVICE_COLORS = [
  'from-cyan-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-teal-400 to-cyan-600',
  'from-sky-400 to-indigo-600',
  'from-fuchsia-400 to-violet-600',
  'from-emerald-400 to-teal-600',
  'from-blue-400 to-indigo-600',
  'from-indigo-400 to-purple-600',
  'from-cyan-400 to-teal-600',
  'from-sky-400 to-blue-600',
  'from-violet-400 to-indigo-600',
  'from-purple-400 to-fuchsia-600',
]

export const SERVICE_ICON_COLORS: Record<string, string> = {
  'from-cyan-400 to-blue-600': 'text-cyan-400',
  'from-violet-400 to-purple-600': 'text-violet-400',
  'from-teal-400 to-cyan-600': 'text-teal-400',
  'from-sky-400 to-indigo-600': 'text-sky-400',
  'from-fuchsia-400 to-violet-600': 'text-fuchsia-400',
  'from-emerald-400 to-teal-600': 'text-emerald-400',
  'from-blue-400 to-indigo-600': 'text-blue-400',
  'from-indigo-400 to-purple-600': 'text-indigo-400',
  'from-cyan-400 to-teal-600': 'text-cyan-300',
  'from-sky-400 to-blue-600': 'text-blue-300',
  'from-violet-400 to-indigo-600': 'text-violet-300',
  'from-purple-400 to-fuchsia-600': 'text-purple-400',
}
