"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  CargoFormSchema,
  CargoFormSchemaType,
  SearchCustomerType,
  SelectOption,
} from "@/lib/types";
import Loader from "./loader";
import { useToast } from "@/components/ui/use-toast";
import { STATUS } from "@/lib/enum";
import CustomerSelect, { SingleValue } from "react-select";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { addCargo } from "@/actions/cargo.action";
import { searchCustomer } from "@/actions/user-actions";

const CargoClientForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    React.useState<boolean>(false);
  const [customers, setCustomers] = React.useState<SearchCustomerType[]>([]);

  const form = useForm<CargoFormSchemaType>({
    resolver: zodResolver(CargoFormSchema),
    defaultValues: {
      codeNumber: "",
      postingDate: "",
      totalBox: "",
      totalWeight: "",
      costPerKg: "",
      totalShipmentUSD: "",
      exchangeRate: "",
      totalShipmentTshs: "",
      amountPaid: "",
      creditAmount: "",
      outstanding: "",
      balance: "",
      status: undefined,
      shipped: false,
      received: false,
    },
  });

  React.useEffect(() => {
    searchCusomers();
  }, []);

  const searchCusomers = async (search: string = "") => {
    try {
      const customers = await searchCustomer(search);
      setCustomers(customers);
    } catch (error) {
      console.error(error);
    }
  };

  const customerOptions: SelectOption[] = customers.map((customer) => ({
    value: customer.codeNumber,
    label: customer.name as string,
  }));

  const onSubmit: SubmitHandler<CargoFormSchemaType> = async (data) => {
    console.log(form.getValues().costPerKg);
    console.log(data);
    setIsConfirmDialogOpen(true);
    // setIsLoading(true);
    // try {
    //   setIsLoading(false);
    //   const res = await addCargo(data);
    //   setIsLoading(false);

    //   if (res && res.success === false) {
    //     toast({
    //       title: "Error",
    //       description: "An error occurred while saving the cargo data.",
    //       variant: "destructive",
    //     });
    //     return;
    //   }

    //   toast({
    //     title: "Success",
    //     description: "Cargo data has been saved successfully.",

    //     className: "bg-green-500 text-white",
    //   });
    //   // form.reset();
    // } catch (error) {
    //   setIsLoading(false);
    //   console.error(error);
    //   toast({
    //     title: "Error",
    //     description: "An unexpected error occurred.",
    //   });
    // }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const res = await addCargo(form.getValues());
      setIsConfirmDialogOpen(false);
      setIsLoading(false);

      if (res && res.success === false) {
        toast({
          title: "Error",
          description: "An error occurred while saving the cargo data.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Cargo data has been saved successfully.",
        className: "bg-green-500 text-white",
      });
      form.reset();
    } catch (error) {
      setIsConfirmDialogOpen(false);
      setIsLoading(false);
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <AlertDialog open={isConfirmDialogOpen}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>
                  <p>
                    This action cannot be undone. This will permanently save
                    cargo data in the database.
                  </p>
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Cost Per Kg:</td>
                        <td className="py-2">${form.getValues().costPerKg}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Total Box:</td>
                        <td className="py-2">{form.getValues().totalBox}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Total Weight (Kg):</td>
                        <td className="py-2">
                          {form.getValues().totalWeight} Kgs
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Exchange Rate:</td>
                        <td className="py-2">
                          {form.getValues().exchangeRate}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Total Shipment ($):</td>
                        <td className="py-2">
                          $
                          {Number(form.getValues().totalWeight) *
                            Number(form.getValues().costPerKg)}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 pr-4">Total Shipment (Tshs):</td>
                        <td className="py-2">
                          {Number(form.getValues().totalWeight) *
                            Number(form.getValues().costPerKg) *
                            (Number(form.getValues().exchangeRate) === 0
                              ? 1
                              : Number(form.getValues().exchangeRate))}{" "}
                          Tshs
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Form {...form}>
        <Card className="">
          <CardHeader>
            <CardTitle className="text-xl">Add New Cargo</CardTitle>
            <CardDescription>Enter cargo details to proceed</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Controller
                  control={form.control}
                  name="codeNumber"
                  render={({ field }) => (
                    <div className="">
                      <label
                        className={`block text-sm font-semibold mb-2 ${
                          form.formState.errors.codeNumber?.message
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        Customer
                      </label>
                      <div>
                        <CustomerSelect<SelectOption, false>
                          {...field}
                          options={customerOptions}
                          onInputChange={(value) => {
                            // Handle input change for search
                            searchCustomer(value);
                          }}
                          onChange={(
                            selectedOption: SingleValue<SelectOption>
                          ) => {
                            // Handle change event
                            field.onChange(
                              selectedOption ? selectedOption.value : ""
                            );
                          }}
                          value={customerOptions.find(
                            (option) => option.value === field.value
                          )}
                          placeholder="Select by name"
                          isSearchable
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              // borderColor:
                              //   state.isFocused ||
                              //   form.formState.errors.codeNumber?.message
                              //     ? "red"
                              //     : "gray",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "0.375rem",
                              boxShadow: "none",
                              height: "2.5rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              // "&:hover": {
                              //   borderColor: state.isFocused ? "red" : "gray-400",
                              // },
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                            singleValue: (base) => ({
                              ...base,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "flex",
                              alignItems: "center",
                            }),
                          }}
                        />
                      </div>
                      <p className="text-red-600 text-sm  mt-2">
                        {form.formState.errors.codeNumber?.message}
                      </p>
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Posting Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="YYYY-MM-DD"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Box</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter total box count" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter total weight" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPerKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Per Kg</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter cost per kg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exchangeRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exchange Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter exchange rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter amount paid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <UiSelect
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cargo status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(STATUS).map((status, index) => (
                            <SelectItem value={status} key={index}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </UiSelect>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipped"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Shipped</FormLabel>
                        <FormDescription>
                          Mark if the cargo has been shipped
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="received"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Received</FormLabel>
                        <FormDescription>
                          Mark if the cargo has been received
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="w-full lg:w-1/2 justify-self-center mt-6"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader message="Submitting..." /> : "Save"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </>
  );
};

export default CargoClientForm;
