"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MedalIcon, User2Icon, UserCheckIcon, UserSquare } from "lucide-react";
import { BiLogoGithub, BiLogoGoogle } from "react-icons/bi";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Patientloginin() {
  const auth = useAuth();
  const emailRef = useRef<HTMLInputElement | null>(null); 
  const passwordRef = useRef<HTMLInputElement | null>(null); 
  const nameRef = useRef<HTMLInputElement | null>(null); 
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    await auth?.googleSignIn();
    router.push("/home");
  };

  const handleGithubSignIn = async () => {
    await auth?.githubSignIn();
    router.push("/get-repo");
  };

  const handleUserSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const pass = passwordRef.current?.value;

    if (name && email && pass) {
      auth?.signUpWithEmailPassword(name, email, pass);
      router.push("/home");
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserSquare className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Create an Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleUserSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Label className="sr-only" htmlFor="username">
                Username
              </Label>
              <Input
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                id="username"
                name="username"
                placeholder="Username"
                required
                type="text"
                ref={nameRef}
              />
            </div>
            <div className="mb-4">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                id="email"
                name="email"
                placeholder="Email"
                required
                type="email"
                ref={emailRef}
              />
            </div>
            <div className="mb-4">
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                id="password"
                name="password"
                placeholder="Password"
                required
                type="password"
                ref={passwordRef}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link className="ml-auto inline-block text-sm underline" href="">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <Button
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
        <Button
          className="group my-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handleGoogleSignIn}
        >
          <BiLogoGoogle className="mx-2" /> Login With Google
        </Button>

        <Button
          className="group my-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handleGithubSignIn}
        >
          <BiLogoGithub className="mx-2" /> Login With Github
        </Button>
        <div className="mt-2 text-center text-sm">
          Already have an account?
          <Link className="underline" href="/login">
            Login 
          </Link>
        </div>
      </div>
    </div>
  );
}
