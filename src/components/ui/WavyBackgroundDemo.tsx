"use client";
import React from "react";
import { WavyBackground } from "../ui/wavy-background";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./button";
import { Vortex } from "./vortex";
 
export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="flex flex-col items-center max-w-7xl mt-0">
        <Vortex className="flex flex-col items-center max-w-7xl mt-0"
      >
     <motion.h1
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 100, opacity: 0 }}
        transition={{ duration: 1, ease: "anticipate" }}
        className="text-6xl font-extrabold [line-height:1.1] text-center pt-12 break-keep hyphens-none"
      >
        AI-powered video learning—smart analysis, interactive navigation, and automated notes for deeper understanding
      </motion.h1>
      <Link href="/dashboard">
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: 1, ease: "circOut" }}
        >
          <Button className="rounded-full w-fit text-xl font-bold py-8 px-8 mt-12">
            Get Started
          </Button>
        </motion.div>
      </Link>
      </Vortex>
    </WavyBackground>
  );
}