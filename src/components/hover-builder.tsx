import { ReactNode, useState } from "react";

export default function HoverBuilder({
  builder,
}: {
  builder: (isHover: boolean) => ReactNode;
}) {
  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {builder(isHovering)}
    </span>
  );
}
