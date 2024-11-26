"use client";
import { formatDateToYYYYMMDD } from "@/lib/utils/functions";
import { ScrollArea, Table, Title } from "@mantine/core";
import classes from "../style/TableScrollArea.module.css";
import cx from "clsx";
import React from "react";
import { Customer } from "@/db/schema";
import { getAllCustomers } from "@/actions/customer.server.action";

const CustomerTable = () => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const [customers, setCustomers] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    getAllSCustomers();
  }, []);

  const getAllSCustomers = async () => {
    try {
      const result = await getAllCustomers();
      setCustomers(result);
    } catch (error) {
      console.error(error);
    }
  };

  const rows = customers.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{row.codeNumber}</Table.Td>
      <Table.Td>{`${row.firstName} ${row.lastName}`}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.contact}</Table.Td>
      <Table.Td>{row.region}</Table.Td>
      <Table.Td>{row.district}</Table.Td>
      <Table.Td>
        {row.createdAt ? formatDateToYYYYMMDD(String(row.createdAt)) : "N/A"}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Title ta="start" mb="lg" size={24}>
        Customers
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
              <Table.Th>Code Number</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Region</Table.Th>
              <Table.Th>District</Table.Th>
              <Table.Th>Created At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default CustomerTable;
