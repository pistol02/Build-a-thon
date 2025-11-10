import * as motion from "framer-motion/client";

export default function Bars() {
  return (
    <section className=" bg-slate-50">
      <div className="bg-blue-600 flex justify-end flex-col h-full px-24 pt-48 w-screen overflow-hidden">
        <motion.h1
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-8xl font-extrabold text-center text-white"
        >
          BuildByte is impacting everyone.
        </motion.h1>
        <motion.img
          whileInView={{ y: 0 }}
          initial={{ y: 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
          src={"/assets/hero/pillars.png"}
        />
      </div>
    </section>
  );
}
