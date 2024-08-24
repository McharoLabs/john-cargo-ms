import * as XLSX from "xlsx";
import { fetchCargoReceipts } from "./cargo.action";

const columns = [
  "Code Number",
  "Posting Date",
  "Total Box",
  "Total Weight",
  "Cost Per Kg",
  "Total Shipment USD",
  "Exchange Rate",
  "Total Shipment Tshs",
  "Amount Paid",
  "Credit Amount",
  "Outstanding",
  "Balance",
  "Status",
  "Shipped",
  "Received",
  "Customer Name",
  "Customer Email",
  "Customer Contact",
  "Created At",
];

export const downloadExcel = async () => {
  try {
    const cargoReceipts = await fetchCargoReceipts();

    const data = cargoReceipts.map((receipt) => ({
      "Code Number": receipt.cargo.codeNumber,
      "Posting Date": receipt.cargo.postingDate.toISOString(),
      "Total Box": receipt.cargo.totalBox,
      "Total Weight": receipt.cargo.totalWeight,
      "Cost Per Kg": receipt.cargo.costPerKg,
      "Total Shipment USD": receipt.cargo.totalShipmentUSD,
      "Exchange Rate": receipt.cargo.exchangeRate,
      "Total Shipment Tshs": receipt.cargo.totalShipmentTshs,
      "Amount Paid": receipt.cargo.amountPaid,
      "Credit Amount": receipt.cargo.creditAmount || "",
      Outstanding: receipt.cargo.outstanding || "",
      Balance: receipt.cargo.balance || "",
      Status: receipt.cargo.status,
      Shipped: receipt.cargo.shipped ? "Yes" : "No",
      Received: receipt.cargo.received ? "Yes" : "No",
      "Customer Name": receipt.users.name,
      "Customer Email": receipt.users.email,
      "Customer Contact": receipt.users.contact,
      "Created At": receipt.users.createdAt.toISOString(),
    }));

    const ws = XLSX.utils.json_to_sheet(data, { header: columns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cargo Receipts");

    if (typeof window !== "undefined") {
      const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      };

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "cargo_receipts.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("XLSX file download triggered.");
    } else {
      console.error("Download attempted on the server side.");
    }
  } catch (error) {
    console.error("Error exporting to XLSX:", error);
  }
};
