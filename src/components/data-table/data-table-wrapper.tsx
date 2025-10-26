"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "../ui/loading";

interface DataTableWrapperProps {
  children: React.ReactNode;
}

export function DataTableWrapper({ children }: DataTableWrapperProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mostrar loading cuando cambien los searchParams
    setIsLoading(true);
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchParams]);

  if (isLoading || isPending) {
    return (
      <Loading />
    );
  }

  return <>{children}</>;
}
