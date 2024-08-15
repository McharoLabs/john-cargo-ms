"use client";
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
import { User } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { POSITION } from "@/lib/enum";

const UsersClientTable = ({ data }: { data: User[] }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Code Number</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Position</TableHead>

            <TableHead className="hidden md:table-cell">Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="font-medium">
                  {user.firstName + " " + user.lastName}
                </div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  {user.email}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.codeNumber}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">
                  {user.contact}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {user.isStaff ? POSITION.STAFF : POSITION.CUSTOMER}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(user.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersClientTable;
