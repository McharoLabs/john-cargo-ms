"use client";
import React from "react";
import Spinner from "@/components/spinner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CargoClientForm from "@/components/new-cargo-form.client";
import CargoReceiptsTable from "@/components/cargo-receipt-table";
import { fetchCargoReceipts } from "@/actions/cargo.action";
import { CargoReceipts } from "@/lib/types";

const CargoReceiptsPage = () => {
  const [loading, setisLoading] = React.useState<boolean>(false);
  const [cargoReceipts, setCargoReceipts] = React.useState<CargoReceipts[]>([]);

  React.useEffect(() => {
    getCargoreceipts();
  }, []);

  const getCargoreceipts = async (search: string = "") => {
    try {
      const data = await fetchCargoReceipts(search);
      setCargoReceipts(data ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" flex place-content-center ">
      <div className=" w-full space-y-10">
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

        <CargoClientForm callback={getCargoreceipts} />

        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
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

export default CargoReceiptsPage;

{
  /* <div className=" flex place-content-center ">
      <div className="max-w-7xl w-full ">
      </div>
    </div> */
}
