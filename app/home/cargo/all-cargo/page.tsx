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
import { fetchCargos } from "@/actions/cargo.action";

const AllCargoPage = () => {
  const [cargoWithCustomer, setCargoWithCustomer] = React.useState<
    CargoWithCustomer[]
  >([]);

  React.useEffect(() => {
    getCargosWithCustomers();
  }, []);

  const getCargosWithCustomers = async () => {
    try {
      const data = await fetchCargos();
      setCargoWithCustomer(data ?? []);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className=" flex place-content-center ">
      <div className="max-w-7xl w-full ">
        <Breadcrumb className="hidden md:flex ">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="#">products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <div className="relative mr-auto flex-1 md:grow-0 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                onInput={(event) => {
                  const inputValue = (event.target as HTMLInputElement).value;
                  fetchProducts(inputValue);
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
                  <TableHead>Product Name</TableHead>
                  <TableHead>Selling Unit</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.sellingUnit}</TableCell>

                    <TableCell>
                      {product?.createdAt ? formatDate(product.createdAt) : "-"}
                    </TableCell>
                    <TableCell>
                      {product?.updatedAt ? formatDate(product.updatedAt) : "-"}
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
                            onClick={() => setIsDialogOpen(true)}
                          >
                            Request
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
        </Card> */}
      </div>
    </div>
  );
};

export default AllCargoPage;
