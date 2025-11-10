import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

interface GeneratedContentProps {
  content: string;
  type: string;
  onBack: () => void;
  onSave: () => void;
}

const GeneratedContent: React.FC<GeneratedContentProps> = ({
  content,
  type,
  onBack,
  onSave,
}) => {
  return (
    <div className="h-full relative flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-all"
        >
          <FaArrowLeft />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
        >
          Save to Notes
        </motion.button>
      </div>

      <div className="overflow-y-auto flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Generated {type}
        </h2>
        <div className="prose prose-blue max-w-none">
          <div
            className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneratedContent;