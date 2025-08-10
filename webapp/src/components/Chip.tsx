import React from "react";

interface Props extends React.PropsWithChildren {
  className?: string;
  title?: string;
}

const Chip: React.FC<Props> = ({ className, title, children }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs rounded-sm ${className}`}
      title={title}
    >
      {children}
    </span>
  );
};

export default Chip;
