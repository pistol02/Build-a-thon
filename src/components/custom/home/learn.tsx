import { Button } from "@/components/ui/button";
import * as motion from "framer-motion/client";
import Link from "next/link";

export default function Learn() {
  return (
    <div className="w-screen p-24 bg-slate-50 pb-64 flex flex-col justify-center items-center">
      <div className="w-4/5 bg-secondary rounded-3xl p-12 flex flex-col justify-end relative h-[60vh]">
        <motion.h1
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-6xl w-1/2 font-extrabold text-zinc-950"
        >
          Learn more about our solution.
        </motion.h1>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="bg-slate-50 py-8 px-8 mt-16 text-2xl font-bold text-zinc-950 rounded-full w-fit"
          >
            Learn More
          </Button>
        </Link>
        <img
          className="w-[400px]  absolute -bottom-[30%] -right-8"
          src="/assets/hero/learn.webp"
        />
      </div>
    </div>
  );
}
