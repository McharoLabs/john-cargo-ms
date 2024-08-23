"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NewUserClientForm from "@/components/new-user-form.client";
import UsersClientTable from "@/components/users-table.client";
import { fetchStaffs } from "@/actions/user-actions";
import { Customer } from "@/lib/types";
import Spinner from "@/components/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const UsersPage = () => {
  const [userData, setUserData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getUsers = async (search: string = "") => {
    setLoading(true);
    const data = await fetchStaffs(search);
    setUserData(data);
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className=" flex place-content-center ">
      <div className="max-w-7xl w-full space-y-10">
        <Breadcrumb className="hidden md:flex ">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/users">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Users</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <NewUserClientForm
          title={"New Staff"}
          isStaff={true}
          callback={getUsers}
        />

        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <div className="relative ml-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onInput={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value;
                  getUsers(inputValue);
                }}
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? <Spinner /> : <UsersClientTable data={userData} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsersPage;
