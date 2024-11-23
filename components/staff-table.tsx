"use client";
import React from "react";
import cx from "clsx";
import { ScrollArea, Table, Title } from "@mantine/core";
import classes from "../style/TableScrollArea.module.css";
import { Staff } from "@/db/schema";
import { getAll } from "@/actions/staff.server.action";
import { formatDateToYYYYMMDD } from "@/lib/utils/functions";

const StaffTable = () => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const [staffs, setStaffs] = React.useState<Staff[]>([]);

  React.useEffect(() => {
    getAllStaff();
  }, []);

  const getAllStaff = async () => {
    try {
      const result = await getAll();
      setStaffs(result);
    } catch (error) {
      console.error(error);
    }
  };

  const rows = staffs.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td>{`${row.firstName} ${row.lastName}`}</Table.Td>
      <Table.Td>{row.email}</Table.Td>
      <Table.Td>{row.contact}</Table.Td>
      <Table.Td>{row.department}</Table.Td>
      <Table.Td>
        {row.createdAt ? formatDateToYYYYMMDD(String(row.createdAt)) : "N/A"}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Title ta="start" mb="lg" size={24}>
        Staffs
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
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Contact</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Created At</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default StaffTable;
