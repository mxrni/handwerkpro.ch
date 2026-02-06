import { cn } from "@/lib/utils";
import type React from "react";

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function MainContent({
  children,
  className,
  title,
  description,
  icon,
  action,
}: MainContentProps) {
  return (
    <div className={cn("flex flex-1 flex-col h-full py-6", className)}>
      <div className="flex flex-col flex-1 h-full gap-4 px-4 lg:px-6">
        {(title || description) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {icon}
                  </div>
                )}
                {title && (
                  <h1 className="text-2xl font-semibold tracking-tight text-balance">
                    {title}
                  </h1>
                )}
              </div>

              {action && <div className="shrink-0">{action}</div>}
            </div>

            {description && (
              <p className="text-muted-foreground text-pretty max-w-2xl">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="flex-1 flex flex-col h-full">{children}</div>
      </div>
    </div>
  );
}
