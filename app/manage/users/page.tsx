import React from "react";
import { RotateCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import NewUserClientForm from "@/components/new-user-form.client";
import { users } from "@/actions/user-actions";
import UsersClientTable from "@/components/users-table.client";

const UsersPage = async () => {
  const u = await users();

  
  return (
    <div className="max-w-7xl w-full space-y-10">
      <NewUserClientForm
        
      />

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="staff">Staffs</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Toggle variant="outline" aria-label="Toggle italic">
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
              <UsersClientTable data={u} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;
