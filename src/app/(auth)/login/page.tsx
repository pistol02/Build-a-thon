
"use client";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, MedalIcon } from "lucide-react"
import { BiLogoGithub, BiLogoGoogle } from "react-icons/bi"
import { useRef, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext";


export default function Loginin() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const auth = useAuth();

    const handleOnSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        if (!emailRef.current || !passwordRef.current) {
            console.error("Email or Password input is missing.");
            return;
        }
    
        await auth?.logInWithEmailPassword(emailRef.current.value, passwordRef.current.value);
        router.push("/home");
    };

    const handleGoogleSignIn = async () => {
        await auth?.googleSignIn();
        router.push("/home")
    }
    
    const handleGithubSignIn = async () => {
        await auth?.githubSignIn();
        router.push("/get-repo")
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <LogIn className="mx-auto h-12 w-auto" />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Login</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleOnSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <Label className="sr-only" htmlFor="username">
                                Email
                            </Label>
                            <Input
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                id="username"
                                name="username"
                                placeholder="Email"
                                required
                                type="email"
                                ref={emailRef}
                            />
                        </div>
                        <div>
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
                            <Link className="ml-auto inline-block text-sm underline" href="#">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                    <div>
                        {/* <Link href="user"> */}
                        <Button
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            type="submit"
                        >
                            Login
                        </Button>
                        {/* </Link> */}
                    </div>
                </form>
                <Button
                    className="group mt-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handleGoogleSignIn}
                >
                    <BiLogoGoogle className="mx-2" /> SignUp With Google
                </Button>
                <Button
                    className="group mb-2 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handleGithubSignIn}
                >
                    <BiLogoGithub className="mx-2" /> Sign up With Github
                </Button>
                <div className="mt-2 text-center text-sm">
                    Don't have an account?
                    <Link className="underline" href="/signup">
                        Sign up
                    </Link>
                </div>
            </div >
        </div >
    )
}
