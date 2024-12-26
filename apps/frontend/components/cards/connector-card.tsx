import { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export type ConnectorCardProps = {
  name: string;
  logo?: ReactNode;
  description?: string;
  locked?: boolean;
  href?: string;
  tooltip?: string;
};

export function ConnectorCard({
  name,
  logo,
  description,
  locked,
  href,
  tooltip,
}: ConnectorCardProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link className="relative" href={href ?? "#"}>
            <Card className="bg-sidebar hover:bg-sidebar-border hover:cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-row flex-wrap items-center gap-4">
                  {logo && logo}
                  <div className="space-y-1">
                    <CardTitle>{name}</CardTitle>
                    {description && (
                      <CardDescription>{description}</CardDescription>
                    )}
                  </div>
                </div>
                {locked && <Lock className="w-6 h-6" />}
              </CardHeader>
            </Card>
            {locked && (
              <div className="absolute inset-0 z-10 bg-black/70 dark:bg-black/50 rounded-xl border cursor-auto"></div>
            )}
          </Link>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
