
declare module "lucide-react" {
  import type { ForwardRefExoticComponent, ReactSVG, SVGProps } from "react";

  export type IconNode = [keyof ReactSVG, Record<string, string>][];

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    strokeWidth?: string | number;
    color?: string;
    title?: string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = ForwardRefExoticComponent<IconProps>;
  export type Icon = LucideIcon;

  export function createLucideIcon(name: string, iconNode: IconNode): LucideIcon;

  export const ArrowRight: LucideIcon;
  export const BarChart3: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Bot: LucideIcon;
  export const Boxes: LucideIcon;
  export const Brain: LucideIcon;
  export const BriefcaseBusiness: LucideIcon;
  export const Building2: LucideIcon;
  export const Cog: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const CircleDollarSign: LucideIcon;
  export const ClipboardCheck: LucideIcon;
  export const Clapperboard: LucideIcon;
  export const Compass: LucideIcon;
  export const ConciergeBell: LucideIcon;
  export const Contrast: LucideIcon;
  export const DoorClosed: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Flame: LucideIcon;
  export const Gift: LucideIcon;
  export const Globe: LucideIcon;
  export const Handshake: LucideIcon;
  export const Headphones: LucideIcon;
  export const Hospital: LucideIcon;
  export const Hourglass: LucideIcon;
  export const Info: LucideIcon;
  export const Laptop: LucideIcon;
  export const LineChart: LucideIcon;
  export const Lock: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Moon: LucideIcon;
  export const PartyPopper: LucideIcon;
  export const PlugZap: LucideIcon;
  export const Puzzle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Recycle: LucideIcon;
  export const RefreshCcw: LucideIcon;
  export const Rocket: LucideIcon;
  export const Search: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Sun: LucideIcon;
  export const Target: LucideIcon;
  export const Trophy: LucideIcon;
  export const Twitter: LucideIcon;
  export const Users: LucideIcon;
  export const Vote: LucideIcon;
  export const Zap: LucideIcon;
  export const Folders: LucideIcon;
}