"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  BriefcaseBusiness,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clapperboard,
  Code2,
  Cog,
  Compass,
  ConciergeBell,
  Contrast,
  Database,
  DoorClosed,
  FlaskConical,
  Flame,
  Folders,
  Gift,
  Globe,
  Grid3X3,
  Handshake,
  Headphones,
  Hospital,
  Hourglass,
  Info,
  Laptop,
  Linkedin,
  LineChart,
  Lock,
  LucideGithub,
  Mail,
  Megaphone,
  MessageCircle,
  Moon,
  PartyPopper,
  PlugZap,
  Puzzle,
  Recycle,
  RefreshCcw,
  Rocket,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  Twitter,
  Youtube,
  Users,
  Vote,
  Wand2,
  Workflow,
  Zap,
  type LucideIcon,
  X,
} from "lucide-react";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

const ICON_MAP = {
  hourglass: Hourglass,
  puzzle: Puzzle,
  concierge: ConciergeBell,
  dollar: CircleDollarSign,
  "dollar-sign": CircleDollarSign,
  zap: Zap,
  "arrow-right": ArrowRight,
  arrowRight: ArrowRight,
  folders: Folders,
  calendar: Calendar,
  robot: Bot,
  analytics: LineChart,
  clapperboard: Clapperboard,
  flask: FlaskConical,
  headphones: Headphones,
  book: BookOpen,
  handshake: Handshake,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  shieldOutline: Shield,
  search: Search,
  clipboard: ClipboardCheck,
  plug: PlugZap,
  refresh: RefreshCcw,
  "refresh-cw": RefreshCcw,
  lock: Lock,
  globe: Globe,
  gift: Gift,
  sparkles: Sparkles,
  check: CheckCircle2,
  "check-circle": CheckCircle2,
  alert: AlertTriangle,
  info: Info,
  vote: Vote,
  rocket: Rocket,
  flame: Flame,
  users: Users,
  twitter: Twitter,
  linkedin: Linkedin,
  github: LucideGithub,
  discord: MessageCircle,
  youtube: Youtube,
  briefcase: BriefcaseBusiness,
  laptop: Laptop,
  message: MessageCircle,
  megaphone: Megaphone,
  sun: Sun,
  moon: Moon,
  contrast: Contrast,
  target: Target,
  brain: Brain,
  boxes: Boxes,
  door: DoorClosed,
  compass: Compass,
  shoppingBag: ShoppingBag,
  hospital: Hospital,
  barChart: BarChart3,
  star: Star,
  trophy: Trophy,
  building: Building2,
  celebration: PartyPopper,
  recycle: Recycle,
  cog: Cog,
  chevronDown: ChevronDown,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronDown,
  "chevron-left": ChevronDown,
  "chevron-right": ChevronDown,
  "chevrons-down": ChevronDown,
  "chevrons-up": ChevronDown,
  grid: Grid3X3,
  "layout-grid": Grid3X3,
  wand: Wand2,
  database: Database,
  mail: Mail,
  workflow: Workflow,
  code: Code2,
  bell: Bell,
  close: X,
  x: X,
  download: ArrowRight,
  key: Lock,
  activity: LineChart,
  alertTriangle: AlertTriangle,
  clock: Target,
  cloud: Database,
  externalLink: ArrowRight,
  eye: Search,
  fileText: BookOpen,
  fingerprint: Shield,
  hardDrive: Database,
  mapPin: Target,
  network: Grid3X3,
  server: Database,
  trash: X,
  userCheck: CheckCircle2,
  clipboardCheck: ClipboardCheck,
  messageCircle: MessageCircle,
  "message-circle": MessageCircle,
  "message-square": MessageCircle,
  calculator: Grid3X3,
  "trending-up": ArrowRight,
  award: Star,
  heart: Star,
  "help-circle": Info,
  inbox: Mail,
  "play-circle": Target,
  plus: ArrowRight,
  minus: ArrowRight,
  lightbulb: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_MAP;

export type IconProps = {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  title?: string;
} & Omit<ComponentPropsWithoutRef<"svg">, "width" | "height">;

const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 24, strokeWidth = 1.75, className, title, ...rest },
  ref,
) {
  const LucideComponent = ICON_MAP[name];

  if (!LucideComponent) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Icon "${name}" is not registered.`);
    }
    return null;
  }

  return (
    <LucideComponent
      ref={ref}
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={title ? undefined : true}
      focusable={title ? undefined : false}
      role={title ? "img" : "presentation"}
      title={title}
      {...rest}
    />
  );
});

export default Icon;