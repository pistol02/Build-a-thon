import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";

interface ChipTabsProps1 {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const tabs = ["Data Sources", "Input JSON", "Output JSON"];

const ChipTabs1 = ({ setSelectedTab }: ChipTabsProps1) => {
  const [selected, setSelected] = useState(tabs[0]);

  const handleTabClick = (tab: string) => {
    setSelected(tab);
    setSelectedTab(tab);
  };

  return (
    <div className="flex items-center flex-wrap gap-2">
      {tabs.map((tab) => (
        <Chip
          text={tab}
          selected={selected === tab}
          onClick={() => handleTabClick(tab)}
          key={tab}
        />
      ))}
    </div>
  );
};

const Chip = ({
  text,
  selected,
  onClick,
}: {
  text: string;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`${
        selected
          ? "text-white"
          : "hover:text-slate-200 hover:bg-slate-700"
      } text-sm transition-colors px-4 py-2 relative rounded-full`}
    >
      <span className="relative z-10 text-sm">{text}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
        ></motion.span>
      )}
    </button>
  );
};

export default ChipTabs1;
