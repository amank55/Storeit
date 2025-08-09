"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your authentication logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h1 className="form-title">
        {type === "sign-in" ? "Sign In" : "Sign Up"}
      </h1>

      {type === "sign-up" && (
        <div className="flex flex-col gap-4 xl:flex-row">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName" className="shad-label">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              className="shad-input"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName" className="shad-label">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              className="shad-input"
              required
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="shad-label">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="shad-input"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="shad-label">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="shad-input"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="form-submit-button" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading...
          </div>
        ) : (
          type === "sign-in" ? "Sign In" : "Sign Up"
        )}
      </Button>

      <div className="body-2 flex justify-center">
        <p className="text-light-100">
          {type === "sign-in"
            ? "Don't have an account?"
            : "Already have an account?"}
        </p>
        <Link
          href={type === "sign-in" ? "/sign-up" : "/sign-in"}
          className="ml-1 font-medium text-brand"
        >
          {type === "sign-in" ? "Sign Up" : "Sign In"}
        </Link>
      </div>
    </form>
  );
};

export default AuthForm;