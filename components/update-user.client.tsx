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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Cargo,
  Customer,
  RegistrationSchema,
  RegistrationSchemaType,
} from "@/lib/types";
import Loader from "./loader";
import { createUser, updateCustomer } from "@/actions/user-actions";
import { useToast } from "@/components/ui/use-toast";

import { AlertCircle, HandCoins, SquarePen } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { Toggle } from "./ui/toggle";
import { Badge } from "./ui/badge";
import { fetchCustomerBalance } from "@/actions/cargo.action";

type UpdateUserClientFormProps = {
  data: Customer;
  callback: () => void;
};

const UpdateUserClientForm: React.FC<UpdateUserClientFormProps> = ({
  callback,
  data,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [detail, setDetail] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<{
    balance: string | null;
    cargoId: string;
  } | null>(null);
  const { toast } = useToast();
  const form = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contact: data.contact,
      codeNumber: data.codeNumber,
    },
  });

  const getCustomerBalance = React.useCallback(async () => {
    try {
      const result = await fetchCustomerBalance(data.userId);
      setBalance(result);
    } catch (error) {
      console.error(error);
    }
  }, [data.userId]);

  React.useEffect(() => {
    getCustomerBalance();
  }, [getCustomerBalance]);

  const onSubmit: SubmitHandler<RegistrationSchemaType> = async (details) => {
    setDetail(null);
    setIsLoading(true);
    try {
      const res = await updateCustomer(details);
      setIsLoading(false);

      if (res && res.success === false) {
        if (res.issues) {
          res.issues.forEach((issue) => {
            form.setError(issue.path[0] as keyof RegistrationSchemaType, {
              type: "validate",
              message: issue.message,
            });
          });
        } else if (res.detail) {
          setDetail(res.detail);
        } else {
          setDetail("An unexpected error occurred.");
        }

        return;
      }

      toast({
        title: "Detail",
        description: res.detail,
        className: "bg-green-500 text-white",
      });
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
      });
      callback();
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <Card className="">
        <div className="flex items-center justify-between space-x-4 px-4">
          <CardHeader>
            <CardTitle className="text-xl">Update Information</CardTitle>
            <CardDescription>
              Created At {formatDate(data.createdAt)}
            </CardDescription>
          </CardHeader>
          <Button
            variant="ghost"
            size="sm"
            className="w-9 p-0"
            onClick={() => setDisabled(!disabled)}
          >
            <SquarePen className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
        <CardContent className="space-y-6">
          {detail && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Detail</AlertTitle>
              <AlertDescription>{detail}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
            <div className="bg-gray-100 p-4 mb-6 rounded-md flex flex-row">
              <div className="font-semibold flex flex-col w-1/2">
                Code Number
                <span className="font-normal text-muted-foreground">
                  {data.codeNumber}
                </span>
              </div>
              <div className="w-1/2 font-semibold flex flex-col">
                <div className="gap-3 flex flex-row items-center">
                  Balance
                  <Toggle variant="outline" className="bg-white">
                    <HandCoins className="h-4 w-4" />
                  </Toggle>
                </div>
                <div className="flex justify-start mt-2">
                  <Badge variant="destructive" className="w-auto inline-block">
                    ${balance?.balance}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    disabled={disabled}
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="john" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    disabled={disabled}
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="john" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <FormField
                    disabled={disabled}
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="user@example.com"
                            {...field}
                            type="email"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    disabled={disabled}
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="07********"
                            {...field}
                            type="tel"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {!disabled && (
                <Button
                  className="w-full lg:w-1/2 justify-self-center"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader message="Updating..." /> : "Save"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
};

export default UpdateUserClientForm;
