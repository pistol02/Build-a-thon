"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ScrollCard() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <motion.h1
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-8xl text-zinc-950 font-extrabold text-center"
            >
              We <span className="gradient-text">imagine</span> a better way.
            </motion.h1>
            <Link href="/dashboard">
              <Button className="bg-secondary py-8 px-8 mt-16 text-2xl font-bold text-slate-50 rounded-full w-fit hover:text-zinc-950 hover:border">
                Learn More
              </Button>
            </Link>
          </>
        }
      >
        <Image
          src={`/assets/hero/analytics.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
