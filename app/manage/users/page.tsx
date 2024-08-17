"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import NewUserClientForm from "@/components/new-user-form.client";
import UsersClientTable from "@/components/users-table.client";
import { users } from "@/actions/user-actions";
import { User } from "@/lib/types";

const UsersPage = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await users();
    setUserData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl w-full space-y-10">
      <NewUserClientForm />

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="staff">Staffs</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Toggle
              variant="outline"
              aria-label="Refresh users"
              onClick={fetchUsers}
            >
              <RotateCcw className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <div className="relative ml-auto flex-1 md:grow-0 ">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <UsersClientTable data={userData} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;
