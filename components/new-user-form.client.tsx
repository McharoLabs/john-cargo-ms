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
import { RegistrationSchema, RegistrationSchemaType } from "@/lib/types";
import Loader from "./loader";
import { createUser } from "@/actions/user-actions";
import { useToast } from "@/components/ui/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type NewUserClientFormProps = {
  title: string;
  isStaff: boolean;
  callback: () => void;
};

const NewUserClientForm: React.FC<NewUserClientFormProps> = ({
  isStaff,
  callback,
  title,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [detail, setDetail] = React.useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      isStaff: isStaff,
    },
  });

  const onSubmit: SubmitHandler<RegistrationSchemaType> = async (data) => {
    setDetail(null);
    setIsLoading(true);
    try {
      const res = await createUser(data);
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
        isStaff: false,
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
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="flex items-center justify-between space-x-4 px-4">
            <CardHeader>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>
                Enter user information to create an account
              </CardDescription>
            </CardHeader>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {detail && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Detail</AlertTitle>
                  <AlertDescription>{detail}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full ">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <FormField
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

                  <Button
                    className="w-full lg:w-1/2 justify-self-center"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader message="Submitting..." /> : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </Form>
  );
};

export default NewUserClientForm;
