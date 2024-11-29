"use client";
import React from "react";
import cx from "clsx";
import { ScrollArea, Table, Title } from "@mantine/core";
import classes from "../style/TableScrollArea.module.css";
import { formatDateToYYYYMMDD } from "@/lib/utils/functions";
import { AppDispatch, RootState } from "@/app/GlobalRedux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffs } from "@/app/GlobalRedux/Features/staff/staffSlice";

const StaffTable = () => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { staffs, loading, error } = useSelector(
    (state: RootState) => state.staff
  );

  React.useEffect(() => {
    if (staffs.length === 0) {
      dispatch(fetchStaffs());
    }
  }, [staffs.length, dispatch]);

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
          <Table.Tbody>{!loading && !error && rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default StaffTable;
