"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { fetchCustomers } from "@/actions/user-actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UsersClientTable from "@/components/users-table.client";
import Spinner from "@/components/spinner";
import { Customer, User } from "@/lib/types";
import NewUserClientForm from "@/components/new-user-form.client";

const CustomersPage = () => {
  const [userData, setUserData] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const getCustomers = async (search: string = "") => {
    setLoading(true);
    const data = await fetchCustomers(search);
    setUserData(data);
    setLoading(false);
  };

  React.useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div className=" flex place-content-center ">
      <div className="max-w-7xl w-full space-y-10">
        <Breadcrumb className="hidden md:flex ">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <NewUserClientForm
          title={"New Customer"}
          isStaff={false}
          callback={getCustomers}
        />

        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <div className="relative ml-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onInput={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value;
                  getCustomers(inputValue);
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

export default CustomersPage;
