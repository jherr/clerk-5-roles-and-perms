"use client";
import { useEffect } from "react";
import { useAuth, useOrganizationList } from "@clerk/nextjs";

export function SyncActiveOrganization({
  membership,
}: {
  membership?: Record<string, string>;
}) {
  const { setActive, isLoaded } = useOrganizationList();

  const { orgId } = useAuth();

  const firstOrgId = Object.keys(membership ?? {})?.[0];

  useEffect(() => {
    if (!isLoaded) return;

    if (!orgId && firstOrgId) {
      void setActive({ organization: firstOrgId });
    }
  }, [isLoaded, setActive, orgId, firstOrgId]);

  return null;
}
