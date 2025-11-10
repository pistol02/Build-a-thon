import React, { useRef, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaIndent,
  FaOutdent,
  FaFont,
} from "react-icons/fa";

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const fontSizes = ["1", "2", "3", "4", "5", "6", "7"];
  const fontStyles = [
    "Arial",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        {/* Font Style Dropdown */}
        <select
          onChange={(e) => handleFormat("fontName", e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Font Style</option>
          {fontStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => handleFormat("fontSize", e.target.value)}
          className="px-2 py-1 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Size</option>
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          {[
            { icon: <FaBold />, command: "bold", tooltip: "Bold" },
            { icon: <FaItalic />, command: "italic", tooltip: "Italic" },
            {
              icon: <FaUnderline />,
              command: "underline",
              tooltip: "Underline",
            },
          ].map((item) => (
            <button
              key={item.command}
              onClick={() => handleFormat(item.command)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              title={item.tooltip}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          {[
            {
              icon: <FaAlignLeft />,
              command: "justifyLeft",
              tooltip: "Align Left",
            },
            {
              icon: <FaAlignCenter />,
              command: "justifyCenter",
              tooltip: "Center",
            },
            {
              icon: <FaAlignRight />,
              command: "justifyRight",
              tooltip: "Align Right",
            },
          ].map((item) => (
            <button
              key={item.command}
              onClick={() => handleFormat(item.command)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              title={item.tooltip}
            >
              {item.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {[
            {
              icon: <FaListUl />,
              command: "insertUnorderedList",
              tooltip: "Bullet List",
            },
            {
              icon: <FaListOl />,
              command: "insertOrderedList",
              tooltip: "Numbered List",
            },
            {
              icon: <FaOutdent />,
              command: "outdent",
              tooltip: "Decrease Indent",
            },
            {
              icon: <FaIndent />,
              command: "indent",
              tooltip: "Increase Indent",
            },
          ].map((item) => (
            <button
              key={item.command}
              onClick={() => handleFormat(item.command)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              title={item.tooltip}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={editorRef}
        className="flex-grow p-4 overflow-y-auto focus:outline-none"
        contentEditable
        onInput={handleInput}
        style={{ minHeight: "200px" }}
      />
    </div>
  );
};

export default TextEditor;