import * as motion from "framer-motion/client";

export default function Expanding() {
  return (
    <div className="w-screen pt-48 px-12 bg-[#d9c6ff] flex flex-col justify-center items-center">
      <motion.h1
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="text-8xl font-extrabold text-zinc-950 text-center"
      >
        Expanding access to care where it&apos;s needed most.
      </motion.h1>
      <p className="text-lg font-light text-zinc-950 text-center w-1/2">
        Streamlined logistics processes ensure goods reach their destination
        quickly, reducing delays and optimizing resource utilization.
      </p>
      <div className="relative w-1/2 mt-16">
        <img className="w-full" src="/assets/hero/phone.png" />
      </div>
    </div>
  );
}
