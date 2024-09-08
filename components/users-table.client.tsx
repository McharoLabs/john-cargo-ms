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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

const UsersClientTable = ({ data,staff }: { data: Customer[], staff: boolean }) => {
  const router = useRouter();
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
            <TableCell className={`${staff ? 'hidden' : 'flex'}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                 
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `/home/customer/${user.userId}`
                      )
                    }
                    className="space-x-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye text-gray-700"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>View</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersClientTable;
