import * as motion from "framer-motion/client";

export default function Diversity() {
  return (
    <div className="w-screen h-screen grid grid-cols-2 bg-cover grid-rows-2 bg-[url(/assets/hero/diversity.webp)]">
      <div />
      <div className="flex flex-col gap-8 p-16">
        <motion.h1
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-5xl font-extrabold text-zinc-950"
        >
          Engineered with a user&#8209;first mindset.
        </motion.h1>
        <motion.p
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          className="text-2xl font-light text-zinc-950"
        >
          Our comprehensive understanding of logistics challenges and the people
          driving operations ensures we consistently deliver an unparalleled,
          top-tier experience.
        </motion.p>
      </div>
    </div>
  );
}
