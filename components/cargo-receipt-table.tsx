import React from "react";
import { CargoReceipts } from "@/lib/types";
import { received, shipped } from "@/actions/cargo.action";

import { MoreHorizontal } from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

type CargoReceiptsTableProps = {
  cargoReceipts: CargoReceipts[];
  callback: () => void;
};

const CargoReceiptsTable: React.FC<CargoReceiptsTableProps> = ({
  callback,
  cargoReceipts,
}) => {
  const { toast } = useToast();
  const router = useRouter();

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
          {/* <TableHead>Created At</TableHead>
          <TableHead>Updated At</TableHead> */}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cargoReceipts.map((cargo, index) => (
          <TableRow key={index} className="cursor-pointer">
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
            {/* <TableCell>{formatDate(cargo.cargo.createdAt)}</TableCell>
            <TableCell>
              {cargo.cargo.updatedAt ? formatDate(cargo.cargo.updatedAt) : "-"}
            </TableCell> */}
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
                    className="space-x-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-arrow-out-down-right text-gray-700"
                    >
                      <path d="M12 22a10 10 0 1 1 10-10" />
                      <path d="M22 22 12 12" />
                      <path d="M22 16v6h-6" />
                    </svg>
                    <span>Shipped</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setReceived(cargo.cargo.cargoId);
                    }}
                    className="space-x-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-hand-coins text-gray-700"
                    >
                      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                      <path d="m2 16 6 6" />
                      <circle cx="16" cy="9" r="2.9" />
                      <circle cx="6" cy="5" r="3" />
                    </svg>
                    <span>Received</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `/home/receipt-details/${cargo.cargo.cargoId}`
                      )
                    }
                    className="space-x-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye text-gray-700"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>View</span>
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
