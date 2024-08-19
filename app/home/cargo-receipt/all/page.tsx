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
import { CargoWithCustomer } from "@/lib/types";
import { fetchCargos, received, shipped } from "@/actions/cargo.action";

import { MoreHorizontal, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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

const AllCargoPage = () => {
  const { toast } = useToast();
  const [cargoWithCustomer, setCargoWithCustomer] = React.useState<
    CargoWithCustomer[]
  >([]);

  React.useEffect(() => {
    getCargosWithCustomers();
  }, []);

  const getCargosWithCustomers = async (search: string = "") => {
    try {
      const data = await fetchCargos(search);
      setCargoWithCustomer(data ?? []);
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">Receipts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
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
                {cargoWithCustomer.map((cargo, index) => (
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

export default AllCargoPage;
