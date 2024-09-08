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
import { countCustomers, fetchCustomers } from "@/actions/user-actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UsersClientTable from "@/components/users-table.client";
import Spinner from "@/components/spinner";
import { Customer, User } from "@/lib/types";
import NewUserClientForm from "@/components/new-user-form.client";
import { Button } from "@/components/ui/button";

const itemsPerPage = 2;

const CustomersPage = () => {
  const [userData, setUserData] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [totalCustomers, setTotalCustomers] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalCustomers / itemsPerPage);

  const getCustomers = React.useCallback(
    async (search: string = "") => {
      setLoading(true);
      const data = await fetchCustomers(search, currentPage, itemsPerPage);
      setUserData(data);
      setLoading(false);
    },
    [currentPage]
  );

  React.useEffect(() => {
    getCustomers();
    getCustomerCount();
  }, [currentPage, getCustomers]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCustomerCount = async () => {
    try {
      const count = await countCustomers();
      setTotalCustomers(count);
    } catch (error) {
      console.error(error);
    }
  };

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
            {loading ? <Spinner /> : <UsersClientTable data={userData} staff={false}/>}
          </CardContent>
          <CardFooter>
            <div className="flex flex-col gap-3 md:flex-row md:justify-between items-center ">
              <span className="text-sm text-gray-600 ">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalCustomers)} of{" "}
                {totalCustomers} Receipts
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CustomersPage;
