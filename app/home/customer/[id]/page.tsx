"use client";
import { fetchCustomer } from "@/actions/user-actions";
import { CargoReceipts, Customer } from "@/lib/types";
import { useParams } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Spinner from "@/components/spinner";
import UpdateUserClientForm from "@/components/update-user.client";
import {
  countCustomerReceipts,
  fetchCustomerReceipts,
} from "@/actions/cargo.action";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CargoReceiptsTable from "@/components/cargo-receipt-table";
import { Button } from "@/components/ui/button";

const itemsPerPage = 2;

const CustomerDetailPage = () => {
  const params = useParams();
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [firstLoad, setFirstLoad] = React.useState<boolean>(true);
  const [customer, setCustomer] = React.useState<Customer | null>(null);
  const [cargoReceipts, setCargoReceipts] = React.useState<CargoReceipts[]>([]);
  const [totalReceipts, setTotalReceipts] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalReceipts / itemsPerPage);

  const getCustomerReceipts = React.useCallback(
    async (search: string = "") => {
      setIsLoading(true);
      try {
        const data = await fetchCustomerReceipts(
          params.id as string,
          search,
          currentPage,
          itemsPerPage 
        );
        setIsLoading(false);
        setCargoReceipts(data ?? []);
      } catch (error) {
        setIsLoading(false);
      }
    },
    [params.id, currentPage]
  );
  
  
  const getCustomer = React.useCallback(async () => {
    try {
      const data = await fetchCustomer(params.id as string);
      setCustomer(data);
    } catch (error) {
      console.error(error);
    }
  }, [params.id]); 
  
  const getTotalReceipts = React.useCallback(async () => {
    try {
      const { count } = await countCustomerReceipts(params.id as string);
      setTotalReceipts(count);
    } catch (error) {
      console.log(error);
      setTotalReceipts(0);
    }
  }, [params.id]); 
  
  React.useEffect(() => {
    getTotalReceipts();
    getCustomerReceipts();
    getCustomer();
  }, [getCustomer, getCustomerReceipts, getTotalReceipts]);
  
  React.useEffect(() => {
    if (customer) {
      setFirstLoad(false);
    }
  }, [customer]);
  

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  return (
    <div className="flex place-content-center">
      <div className="max-w-7xl w-full space-y-10">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/customers">Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Details</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {firstLoad ? (
          <Spinner />
        ) : (
          <>
            {customer && (
              <UpdateUserClientForm callback={getCustomer} data={customer} />
            )}
            {customer && (
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      onInput={(event) => {
                        const inputValue = (event.target as HTMLInputElement)
                          .value;
                        getCustomerReceipts(inputValue);
                      }}
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <CargoReceiptsTable
                      cargoReceipts={cargoReceipts}
                      callback={getCustomerReceipts}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col gap-3 md:flex-row md:justify-between items-center ">
                    <span className="text-sm text-gray-600 ">
                      Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(currentPage * itemsPerPage, totalReceipts)} of{" "}
                      {totalReceipts} Receipts
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
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailPage;
