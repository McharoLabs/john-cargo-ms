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
import { fetchCargoReceipts, received, shipped } from "@/actions/cargo.action";

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

const Dashboard = () => {
  const { toast } = useToast();
  const [staffCount, setStaffCount] = React.useState<number>(0);
  const [customerCount, setCustomerCount] = React.useState<number>(0);
  const [paymentStatuses, setPaymentStatuses] = React.useState<{
    notPaid: number;
    partiallyPaid: number;
    paidInFull: number;
  }>({
    notPaid: 0,
    partiallyPaid: 0,
    paidInFull: 0,
  });
  const [CargoReceipts, setCargoReceipts] = React.useState<CargoReceipts[]>([]);

  React.useEffect(() => {
    getCargosWithCustomers();
    getStaffCount();
    getCustomerCount();
    getPaymentStatus();
  }, []);

  const getCargosWithCustomers = async (search: string = "") => {
    try {
      const data = await fetchCargoReceipts(search);
      setCargoReceipts(data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

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

  const setReceived = async (cargoId: string) => {
    try {
      const res = await received(cargoId);
      if (!res.success) {
        toast({
          title: "Detail",
          description: res.detail,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Detail",
        description: res.detail,
        className: "bg-green-500 text-white text-lg",
      });
      getCargosWithCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const setShipped = async (cargoId: string) => {
    try {
      const res = await shipped(cargoId);

      if (res.success === false) {
        toast({
          title: "Detail",
          description: res.detail,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Detail",
        description: res.detail,
        className: "bg-green-500 text-white text-lg",
      });
      getCargosWithCustomers();
    } catch (error) {
      console.error(error);
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
          <CardHeader className="flex flex-row items-center">
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
                  getCargosWithCustomers(inputValue);
                }}
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Code Number</TableHead>
                  <TableHead>Posting Date</TableHead>
                  <TableHead>Total Box</TableHead>
                  <TableHead>Total Weight</TableHead>
                  <TableHead>Cost Per Kg</TableHead>
                  <TableHead>Total Shipment (USD)</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Total Shipment (Tshs)</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Credit Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shipped</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CargoReceipts.map((cargo, index) => (
                  <TableRow key={index}>
                    <TableCell>{cargo.users.name as string}</TableCell>
                    <TableCell>{cargo.cargo.codeNumber}</TableCell>
                    <TableCell>{formatDate(cargo.cargo.postingDate)}</TableCell>
                    <TableCell>{cargo.cargo.totalBox}</TableCell>
                    <TableCell>{cargo.cargo.totalWeight}</TableCell>
                    <TableCell>{cargo.cargo.costPerKg}</TableCell>
                    <TableCell>{cargo.cargo.totalShipmentUSD}</TableCell>
                    <TableCell>{cargo.cargo.exchangeRate}</TableCell>
                    <TableCell>{cargo.cargo.totalShipmentTshs}</TableCell>
                    <TableCell>{cargo.cargo.amountPaid}</TableCell>
                    <TableCell>{cargo.cargo.creditAmount || "N/A"}</TableCell>
                    <TableCell>{cargo.cargo.outstanding || "N/A"}</TableCell>
                    <TableCell>{cargo.cargo.balance || "N/A"}</TableCell>
                    <TableCell>{cargo.cargo.status}</TableCell>
                    <TableCell>
                      {cargo.cargo.shipped ? (
                        <Badge className="bg-green-500">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-500">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {cargo.cargo.received ? (
                        <Badge className="bg-green-500">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-500">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(cargo.cargo.createdAt)}</TableCell>
                    <TableCell>
                      {cargo.cargo.updatedAt
                        ? formatDate(cargo.cargo.updatedAt)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setShipped(cargo.cargo.cargoId)}
                          >
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setReceived(cargo.cargo.cargoId);
                            }}
                          >
                            Received
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            Update Outstanding
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
