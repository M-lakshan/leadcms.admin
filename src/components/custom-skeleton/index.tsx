import { LocalContainerProps } from "types";
import { Skeleton } from "@mui/material";
import { SetComponentStyles } from "@utils/general-helper";

export { SkeletonPlaceholder } from "./index.styled";

export const Placeholder = ({
  cmpID,
  styleObj,
  className,
  height,
  width,
  variant,
  animation,
  children,
}: LocalContainerProps & {
  height: number | string;
  width: number | string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "wave" | "pulse" | false;
}) => {
  const cmpStyles = SetComponentStyles({ className, styleObj });
  const transitionEffect = animation ? animation : "wave";

  return (
    <Skeleton
      {...(cmpID && { id: cmpID })}
      {...(cmpStyles && { className: cmpStyles })}
      {...(animation && { animation: transitionEffect })}
      variant={variant}
      width={width}
      height={height}
    >
      {children}
    </Skeleton>
  );
};
