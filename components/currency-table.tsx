"use client";
import React from "react";
import cx from "clsx";
import { ScrollArea, Table, Title } from "@mantine/core";
import classes from "../style/TableScrollArea.module.css";
import { Currency } from "@/db/schema";
import { getCurrencies } from "@/actions/currency.server.action";
import { formatDateToYYYYMMDD } from "@/lib/utils/functions";

const CurrencyConversionTable = () => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);

  React.useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const result = await getCurrencies();
      setCurrencies(result);
    } catch (error) {
      console.error(error);
    }
  };

  const rows = currencies.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.symbol}</Table.Td>
      <Table.Td>{row.currency_code}</Table.Td>
      <Table.Td>{row.currency_name}</Table.Td>
      <Table.Td>{row.rate_to_tzs}</Table.Td>
      <Table.Td>{formatDateToYYYYMMDD(String(row.createdAt))}</Table.Td>
      <Table.Td>{formatDateToYYYYMMDD(String(row.updatedAt))}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Title ta="start" mb="lg" size={24}>
        Currency Conversion Rates
      </Title>
      <ScrollArea
        h={300}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table miw={700} striped highlightOnHover>
          <Table.Thead
            className={cx(classes.header, { [classes.scrolled]: scrolled })}
          >
            <Table.Tr>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Currency Code</Table.Th>
              <Table.Th>Currency Name</Table.Th>
              <Table.Th>Rate To Tzs</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Updated At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default CurrencyConversionTable;
