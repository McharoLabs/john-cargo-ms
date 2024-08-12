"use client";

import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFormSchemaType } from "@/lib/types";
import { loginAction } from "@/actions/auth.action";

const LoginForm = () => {
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
  } = useForm<LoginFormSchemaType>();
  const [detail, setDetail] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormSchemaType> = async (data) => {
    const res = await loginAction(data);

    if (res && res.success === false) {
      if (res.issues) {
        res.issues.forEach((issue) => {
          setError(issue.path[0] as keyof LoginFormSchemaType, {
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

    setDetail("");
    reset({ email: "", password: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="m@example.com"
              />
              {errors.email && (
                <p className="text-yellow-600">{errors.email.message}</p>
              )}
              {detail && <p className="text-red-600">{detail}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="********"
              />
              {errors.password && (
                <p className="text-yellow-600">{errors.password.message}</p>
              )}
              {detail && <p className="text-red-600">{detail}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
