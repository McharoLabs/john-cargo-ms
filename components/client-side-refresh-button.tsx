// src/components/client-side-refresh-button.tsx
"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import { users } from "@/actions/user-actions";
import UsersClientTable from "@/components/users-table.client";
import { User } from "@/lib/types";

const ClientSideRefreshButton = ({ initialData }: { initialData: User[] }) => {
  const [data, setData] = useState<User[]>(initialData);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    const refreshedData = await users(); // Refetches the data
    setData(refreshedData);
    setRefreshing(false);
  };

  return (
    <div>
      <button
        onClick={handleRefresh}
        className="flex items-center p-2 border rounded"
        aria-label="Refresh users"
      >
        {refreshing ? (
          <span>Loading...</span>
        ) : (
          <RotateCcw className="h-4 w-4" />
        )}
      </button>
      {/* Display table only here to avoid duplication */}
    </div>
  );
};

export default ClientSideRefreshButton;
