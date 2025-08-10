import React, { useState } from "react";

interface Props extends React.PropsWithChildren {
  header: string;
  isInitiallyExpanded: boolean;
}

const CollapsiblePanel: React.FC<Props> = ({
  header,
  isInitiallyExpanded,
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(isInitiallyExpanded);

  return (
    <>
      <button
        className="mb-2 w-full cursor-pointer rounded-lg p-2 text-left font-semibold"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {header} {isExpanded ? "▲" : "▼"}
      </button>

      {isExpanded && children}
    </>
  );
};

export default CollapsiblePanel;
