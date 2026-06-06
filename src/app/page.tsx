import type { Metadata } from "next";
import Link from "next/link";
import BeeChartWordmark, { BeeChartMark } from "@/assets/logos/beechart";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/globals/constants/site";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-5">
          <BeeChartMark width="128" height="128" className="text-foreground" />
          <BeeChartWordmark width="240" height="52" className="text-foreground" />
          <p className="text-muted-foreground text-sm leading-relaxed">{SITE_DESCRIPTION}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="sm">
            <Link href="/docs">Browse docs</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/docs/installation">Install charts</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">{SITE_TITLE}</p>
      </div>
    </div>
  );
}
