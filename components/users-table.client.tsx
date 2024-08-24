"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer, User } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const UsersClientTable = ({ data }: { data: Customer[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Code Number</TableHead>
          <TableHead>Contact</TableHead>

          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="font-medium">{user.name as string}</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {user.email}
              </div>
            </TableCell>
            <TableCell>{user.codeNumber}</TableCell>
            <TableCell>
              <Badge className="text-xs" variant="secondary">
                {user.contact}
              </Badge>
            </TableCell>

            <TableCell>{formatDate(user.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersClientTable;
