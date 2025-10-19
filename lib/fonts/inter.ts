import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-var.woff2",
      weight: "400 700",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-inter",
  fallback: ["system-ui", "arial"],
});

export default inter;