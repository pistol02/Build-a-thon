import { Button } from "@/components/ui/button";
import { CustomToolTip } from "@/components/ui/tooltip";
import * as motion from "framer-motion/client";
import { LogsIcon, Ship, Train, Truck, WebcamIcon } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center max-w-7xl">
      <video
        className="absolute top-24 right-0 w-full h-full -z-10"
        autoPlay
        muted
      >
        <source
          src="/assets/hero/hero-waveform.mov"
          type="video/mp4;codecs=hvc1"
        />
        <source src="/assets/hero/hero-waveform.webm" type="video/webm" />
      </video>
      <motion.h1
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: 100, opacity: 0 }}
        transition={{ duration: 1, ease: "anticipate" }}
        className="text-7xl font-extrabold [line-height:1.1] text-center pt-48 break-keep hyphens-none"
      >
        Empowering NGOs with the right talent through AI-driven matching and seamless collaboration
      </motion.h1>
      <Link href="/wdashboard">
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
      <div className="h-[40vh] w-screen flex bg-gradient-to-b from-transparent to-secondary justify-center items-center gap-12">
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 1.2, ease: "backInOut" }}
        >
          <CustomToolTip
            content="Track your shipments in real-time"
            trigger={<WebcamIcon size={50} />}
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 1.4, ease: "backInOut" }}
        >
          <CustomToolTip
            content="Optimize your routes for maximum efficiency"
            trigger={<Train size={50} />}
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 1.6, ease: "backInOut" }}
        >
          <CustomToolTip
            content="Manage your fleet with ease"
            trigger={<Ship size={50} />}
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 1.8, ease: "backInOut" }}
        >
          <CustomToolTip
            content="Monitor your operations with detailed logs"
            trigger={<LogsIcon size={50} />}
          />
        </motion.div>
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 2, ease: "backInOut" }}
        >
          <CustomToolTip
            content="Track your shipments in real-time"
            trigger={<Truck size={50} />}
          />
        </motion.div>
      </div>
    </section>
  );
}
