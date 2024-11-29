"use client";

import React from "react";
import cx from "clsx";
import { ScrollArea, Table, Title } from "@mantine/core";
import { formatDateToYYYYMMDD } from "@/lib/utils/functions";
import classes from "../style/TableScrollArea.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrencies } from "@/app/GlobalRedux/Features/currency/currencySlice";
import { AppDispatch, RootState } from "@/app/GlobalRedux/store";

const CurrencyConversionTable = () => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { currencies, loading, error } = useSelector(
    (state: RootState) => state.currency
  );

  React.useEffect(() => {
    if (currencies.length === 0) {
      dispatch(fetchCurrencies());
    }
  }, [currencies.length, dispatch]);

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
          <Table.Tbody>{!loading && !error && rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default CurrencyConversionTable;
