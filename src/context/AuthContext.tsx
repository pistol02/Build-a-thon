"use client";
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import {
    User,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    UserCredential,
    sendPasswordResetEmail,
    GithubAuthProvider
} from "firebase/auth";
import { auth, db } from "@/lib/firebase"
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface AuthContextProps {
    user: User | null;
    googleSignIn: Function;
    githubSignIn: Function;
    signUpWithEmailPassword: Function;
    logInWithEmailPassword: Function;
    forgotPasswordWithEmail: Function;
    logOut: Function;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider()
        try {
            const result: UserCredential = await signInWithPopup(auth, provider);
            setUser(result.user);

            const userDocRef = doc(db, 'users', result.user.uid)
            const userDoc = getDoc(userDocRef);
            if (!(await userDoc).exists()) {
                await setDoc(userDocRef, { name: result.user.displayName, likes: [], orders: [] },)
            }

            toast.success(`Logged in as ${result.user.email}`)
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error("Failed to Sign In")
        }
    }

    const githubSignIn = async () => {
        const provider = new GithubAuthProvider()
        try {
            const result: UserCredential = await signInWithPopup(auth, provider);
            setUser(result.user);

            const userDocRef = doc(db, 'users', result.user.uid)
            const userDoc = getDoc(userDocRef);
            if (!(await userDoc).exists()) {
                await setDoc(userDocRef, { name: result.user.displayName },)
            }

            toast.success(`Logged in as ${result.user.email}`)
        } catch (error) {
            console.error('Authentication error:', error);
            toast.error("Failed to Sign In")
        }
    }

    const signUpWithEmailPassword = async (name: string, email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        setUser(result.user)
        const userDocRef = doc(db, 'users', result.user.uid)

        const userDoc = getDoc(userDocRef);
        if (!(await userDoc).exists()) {
            await setDoc(userDocRef, { name: name, likes: [], orders: [] },)
        }

        toast.success(`Signed up as ${result.user.email}`)
    }

    const logInWithEmailPassword = async (email: string, password: string) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user)
        toast.success(`Logged In as ${result.user.email}`)
    }

    const forgotPasswordWithEmail = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
        toast.success(`Email Sent to ${email}`)
    }

    const logOut = () => {
        signOut(auth);
        toast.success(`Logged Out`)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [user]);

    return <AuthContext.Provider value={{ user, googleSignIn, githubSignIn, signUpWithEmailPassword, logInWithEmailPassword, forgotPasswordWithEmail, logOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}