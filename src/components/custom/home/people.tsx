import { Button } from "@/components/ui/button";
import React from "react";
import * as motion from "framer-motion/client";
import Link from "next/link";

export default function People() {
  return (
    <div className="flex w-full py-48 px-24 flex-col justify-center items-center">
      <img className="w-full" src="/assets/hero/people.webp" />
      <motion.h1
        whileInView={{ y: 0, opacity: 1 }}
        initial={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-8xl font-extrabold text-center mt-16"
      >
        People are why we&apos;ve built our platform.
      </motion.h1>
      <Link href="/dashboard">
        <Button
          variant="secondary"
          className="bg-secondary py-8 px-8 mt-16 text-2xl font-bold text-slate-50 rounded-full w-fit"
        >
          Know More
        </Button>
      </Link>
    </div>
  );
}
