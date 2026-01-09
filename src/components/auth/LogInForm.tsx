"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Form from "../form/Form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LogInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const method = useForm({

  });
  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    console.log(data, `login credentials`);
    try {
      const result = await signIn("credentials", {
        email: data.UserName,
        password: data.Password,
        rememberMe: data.RememberMe,
        redirect: false,
      });
      console.log(result, `signIn result`);
      
      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-full max-w-md px-6 py-12">
        <FormProvider {...method}>
          <Form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Controller
                name="UserName"
                control={method.control}
                rules={{
                  required: {
                    message: "User Name is required",
                    value: true
                  }
                }}
                render={({ field, fieldState: { error } }) => (
                  <Input placeholder="Enter User Name" type="text" hint={error?.message} error={error ? true : false} {...field} />
                )}
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Controller
                  name="Password"
                  control={method.control}
                  rules={{
                    required: {
                      message: "Password is required",
                      value: true
                    }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Input type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" hint={error?.message} error={error ? true : false} {...field} />
                  )}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Controller
                  name="RememberMe"
                  control={method.control}
                  rules={{
                    // required: {
                    //   message: "RememberMe is required",
                    //   value: true
                    // }
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <Checkbox checked={field.value} {...field} />
                  )}
                />
                <span className="text-sm text-gray-400">
                  Keep me logged in
                </span>
              </div>

              <Link href="/reset-password" className="text-sm text-brand-400">
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-center text-red-500">{error}</p>
            )}

            <Button className="w-full" size="sm" disabled={loading} onClick={method.handleSubmit(onSubmit)}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-400">
                Sign Up
              </Link>
            </p>
          </Form>
        </FormProvider>
      </div>
    </div>

  );
}
