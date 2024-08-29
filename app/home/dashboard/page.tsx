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
import { CargoReceipts } from "@/lib/types";
import {
  countReceipts,
  fetchCargoReceipts,
  received,
  shipped,
} from "@/actions/cargo.action";

import { MoreHorizontal, Search, Users, WalletCards } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";

import {} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  countCustomers,
  countPaymentStatuses,
  countStaffs,
} from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import CargoReceiptsTable from "@/components/cargo-receipt-table";

const itemsPerPage = 15;

const Dashboard = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [staffCount, setStaffCount] = React.useState<number>(0);
  const [customerCount, setCustomerCount] = React.useState<number>(0);
  const [totalReceipts, setTotalReceipts] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalReceipts / itemsPerPage);
  const [paymentStatuses, setPaymentStatuses] = React.useState<{
    notPaid: number;
    partiallyPaid: number;
    paidInFull: number;
  }>({
    notPaid: 0,
    partiallyPaid: 0,
    paidInFull: 0,
  });
  const [cargoReceipts, setCargoReceipts] = React.useState<CargoReceipts[]>([]);

  const getCargoreceipts = React.useCallback(
    async (search: string = "") => {
      setIsLoading(true);
      try {
        const data = await fetchCargoReceipts(
          search,
          currentPage,
          itemsPerPage
        );
        setCargoReceipts(data ?? []);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    },
    [currentPage]
  );

  React.useEffect(() => {
    getStaffCount();
    getCustomerCount();
    getPaymentStatus();
    getCargoreceipts();
    getTotalReceipts();
  }, [currentPage, getCargoreceipts]);

  const getStaffCount = async () => {
    try {
      const count = await countStaffs();
      setStaffCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerCount = async () => {
    try {
      const count = await countCustomers();
      setCustomerCount(count);
    } catch (error) {
      console.error(error);
    }
  };

  const getPaymentStatus = async () => {
    try {
      const data = await countPaymentStatuses();
      setPaymentStatuses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalReceipts = async () => {
    try {
      const { count } = await countReceipts();
      setTotalReceipts(count);
    } catch (error) {
      console.log(error);
      setTotalReceipts(0);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className=" flex place-content-center ">
      <div className="w-full space-y-10">
        <Breadcrumb className="hidden md:flex ">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 auto-cols-fr">
          <Card x-chunk="dashboard-01-chunk-1" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Staffs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffCount}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-1" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerCount}</div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-1" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paid Receipts
              </CardTitle>
              <WalletCards className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentStatuses.paidInFull}
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-1" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Partially Paid
              </CardTitle>
              <WalletCards className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentStatuses.partiallyPaid}
              </div>
            </CardContent>
          </Card>

          <Card x-chunk="dashboard-01-chunk-1" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Paid</CardTitle>
              <WalletCards className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paymentStatuses.notPaid}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex flex-col">
              <div className="text-xl font-semibold">Receipts </div>
              <div className="text-muted-foreground">
                Recent receipts from your store.
              </div>
            </div>
            <div className="relative ml-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onInput={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value;
                  getCargoreceipts(inputValue);
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
                callback={getCargoreceipts}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
