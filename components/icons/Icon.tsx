"use client";

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  BriefcaseBusiness,
  Building2,
  Cog,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clapperboard,
  Compass,
  ConciergeBell,
  Contrast,
  DoorClosed,
  ChevronDown,
  FlaskConical,
  Flame,
  Gift,
  Globe,
  Handshake,
  Headphones,
  Hospital,
  Hourglass,
  Info,
  Laptop,
  LineChart,
  Lock,
  MessageCircle,
  Moon,
  PartyPopper,
  PlugZap,
  Puzzle,
  AlertTriangle,
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
  Users,
  Vote,
  Zap,
  Folders,
  type LucideIcon,
} from "lucide-react";

import { forwardRef, type ComponentPropsWithoutRef } from "react";

const ICON_MAP = {
  hourglass: Hourglass,
  puzzle: Puzzle,
  concierge: ConciergeBell,
  dollar: CircleDollarSign,
  zap: Zap,
  arrowRight: ArrowRight,
  folders: Folders,
  robot: Bot,
  analytics: LineChart,
  clapperboard: Clapperboard,
  flask: FlaskConical,
  headphones: Headphones,
  book: BookOpen,
  handshake: Handshake,
  shield: ShieldCheck,
  shieldOutline: Shield,
  search: Search,
  clipboard: ClipboardCheck,
  plug: PlugZap,
  refresh: RefreshCcw,
  lock: Lock,
  globe: Globe,
  gift: Gift,
  sparkles: Sparkles,
  check: CheckCircle2,
  alert: AlertTriangle,
  info: Info,
  vote: Vote,
  rocket: Rocket,
  flame: Flame,
  users: Users,
  twitter: Twitter,
  briefcase: BriefcaseBusiness,
  laptop: Laptop,
  message: MessageCircle,
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
      role={title ? "img" : "presentation"}
      title={title}
      {...rest}
    />
  );
});

export default Icon;