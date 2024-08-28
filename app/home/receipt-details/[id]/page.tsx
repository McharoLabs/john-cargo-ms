"use client";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Spinner from "@/components/spinner";
import { CargoReceipts } from "@/lib/types";
import { fetchCargoReceipt } from "@/actions/cargo.action";

const ReceiptDetailsPage = () => {
  const params = useParams();
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [cargoReceipts, setCargoReceipts] =
    React.useState<CargoReceipts | null>(null);

  React.useEffect(() => {
    getCargoreceipt();
  }, []);

  const getCargoreceipt = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCargoReceipt(params.id as string);
      setCargoReceipts(data ?? null);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex place-content-center">
      <div className="max-w-7xl w-full space-y-10">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home/cargo-receipts">Cargo Receipts</Link>
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

        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">Customer Information</CardHeader>
          <CardContent>
            {loading ? (
              <Spinner />
            ) : (
              cargoReceipts && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Code Number:</strong>
                    {cargoReceipts.users.codeNumber}
                  </div>
                  <div>
                    <strong>Name:</strong> {cargoReceipts.users.name as string}
                  </div>
                  <div>
                    <strong>Email:</strong> {cargoReceipts.users.email}
                  </div>
                  <div>
                    <strong>Contact:</strong> {cargoReceipts.users.contact}
                  </div>
                  <div>
                    <strong>Created At:</strong>
                    {new Date(
                      cargoReceipts.users.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {!loading && cargoReceipts && (
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">Receipt Information</CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Code Number:</strong> {cargoReceipts.cargo.codeNumber}
                </div>
                <div>
                  <strong>Posting Date:</strong>
                  {new Date(
                    cargoReceipts.cargo.postingDate
                  ).toLocaleDateString()}
                </div>
                <div>
                  <strong>Total Box:</strong> {cargoReceipts.cargo.totalBox}
                </div>
                <div>
                  <strong>Total Weight:</strong>
                  {cargoReceipts.cargo.totalWeight}
                </div>
                <div>
                  <strong>Cost Per Kg:</strong> {cargoReceipts.cargo.costPerKg}
                </div>
                <div>
                  <strong>Total Shipment (USD):</strong>
                  {cargoReceipts.cargo.totalShipmentUSD}
                </div>
                <div>
                  <strong>Exchange Rate:</strong>
                  {cargoReceipts.cargo.exchangeRate}
                </div>
                <div>
                  <strong>Total Shipment (Tshs):</strong>
                  {cargoReceipts.cargo.totalShipmentTshs}
                </div>
                <div>
                  <strong>Amount Paid:</strong> {cargoReceipts.cargo.amountPaid}{" "}
                  {cargoReceipts.cargo.paymentCurrency}
                </div>
                {cargoReceipts.cargo.creditAmount && (
                  <div>
                    <strong>Credit Amount (USD):</strong>
                    {cargoReceipts.cargo.creditAmount}
                  </div>
                )}
                {cargoReceipts.cargo.outstanding && (
                  <div>
                    <strong>Outstanding (USD):</strong>
                    {cargoReceipts.cargo.outstanding}
                  </div>
                )}
                {cargoReceipts.cargo.balance && (
                  <div>
                    <strong>Balance (USD):</strong>{" "}
                    {cargoReceipts.cargo.balance}
                  </div>
                )}
                <div>
                  <strong>Status:</strong> {cargoReceipts.cargo.status}
                </div>
                <div>
                  <strong>Shipped:</strong>
                  {cargoReceipts.cargo.shipped ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Received:</strong>
                  {cargoReceipts.cargo.received ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Created At:</strong>
                  {new Date(cargoReceipts.cargo.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated At:</strong>
                  {new Date(cargoReceipts.cargo.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReceiptDetailsPage;
