import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  animated,
  useSpringValue,
} from "@react-spring/web";

import { MinusIcon, PlusIcon } from "./vectors";

import { useRealHeight } from "@/hooks";

export interface CollapsibleViewProps {
  title: ReactNode;
  children: ReactNode;

  defaultCollapsed?: boolean;

  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function CollapsibleView({
  title,
  children,
  defaultCollapsed = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: CollapsibleViewProps) {
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed,
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const containerHeight =
    useRealHeight(containerRef);

  const height = useSpringValue(
    defaultCollapsed ? 0 : 1,
  );

  useEffect(() => {
    height.start(collapsed ? 0 : 1);
  }, [collapsed, height]);

  return (
    <div
      className={`
        rounded-2xl
        bg-white
        overflow-hidden
        ${className}
      `}
    >
      <div
        className={`
          flex items-center justify-between
          px-4 py-3
          cursor-pointer
          select-none
          border-b-[1px] border-black/10
          ${headerClassName}
        `}
        onClick={() =>
          setCollapsed((prev) => !prev)
        }
      >
        <div className="text-lg font-semibold">
          {title}
        </div>

        <div className="shrink-0">
          {collapsed ? (
            <PlusIcon />
          ) : (
            <MinusIcon />
          )}
        </div>
      </div>

      <animated.div
        className="overflow-hidden"
        style={{
          maxHeight: height.to(
            (x) => x * containerHeight,
          ),
        }}
      >
        <div ref={containerRef}>
          <div
            className={`
              px-4 pb-4
              ${contentClassName}
            `}
          >
            {children}
          </div>
        </div>
      </animated.div>
    </div>
  );
}