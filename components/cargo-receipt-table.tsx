import React from "react";
import { CargoReceipts } from "@/lib/types";
import { received, shipped } from "@/actions/cargo.action";

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

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

type CargoReceiptsTableProps = {
  cargoReceipts: CargoReceipts[];
  callback: () => void;
};

const CargoReceiptsTable: React.FC<CargoReceiptsTableProps> = ({
  callback,
  cargoReceipts,
}) => {
  const { toast } = useToast();

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
      callback();
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
      callback();
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        {cargoReceipts.map((cargo, index) => (
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
              {cargo.cargo.updatedAt ? formatDate(cargo.cargo.updatedAt) : "-"}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
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
  );
};

export default CargoReceiptsTable;
