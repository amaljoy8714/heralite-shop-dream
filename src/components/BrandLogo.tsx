import heraLogo from "@/assets/heralite-logo.jpg";

type Props = { className?: string };

export function BrandLogo({ className }: Props) {
  return <img src={heraLogo} alt="HeraLite logo" className={className} />;
}
