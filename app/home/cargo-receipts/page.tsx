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
import { File, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CargoClientForm from "@/components/new-cargo-form.client";
import CargoReceiptsTable from "@/components/cargo-receipt-table";
import { countReceipts, fetchCargoReceipts } from "@/actions/cargo.action";
import { CargoReceipts } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { downloadExcel } from "@/actions/export-doc.action";
import Loader from "@/components/loader";

const itemsPerPage = 2;

const CargoReceiptsPage = () => {
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = React.useState<boolean>(false);
  const [cargoReceipts, setCargoReceipts] = React.useState<CargoReceipts[]>([]);
  const [totalReceipts, setTotalReceipts] = React.useState<number>(0);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.ceil(totalReceipts / itemsPerPage);


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
    getCargoreceipts();
    getTotalReceipts();
  }, [currentPage, getCargoreceipts]);

 

  const getTotalReceipts = async () => {
    try {
      const { count } = await countReceipts();
      setTotalReceipts(count);
    } catch (error) {
      console.log(error);
      setTotalReceipts(0);
    }
  };

  const exportToXLSX = async () => {
    setDownloadLoading(true);
    try {
      await downloadExcel();
      setDownloadLoading(false);
    } catch (error) {
      console.error(error);
      setDownloadLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex place-content-center">
      <div className="w-full space-y-10">
        <Breadcrumb className="hidden md:flex">
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

        <div className="space-y-3 flex flex-col">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={exportToXLSX}
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader message="Downloading..." spinnerColor="text-gray-900" />
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </div>
              )}
            </Button>
          </div>

          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <div className="relative ml-auto flex-1 md:grow-0">
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
        </div>
      </div>
    </div>
  );
};

export default CargoReceiptsPage;
