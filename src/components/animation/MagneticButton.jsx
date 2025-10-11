import { forwardRef } from "react";
import Button from "../ui/Button";

const MagneticButton = forwardRef(({ magnetic = true, ...props }, ref) => (
  <Button ref={ref} magnetic={magnetic} {...props} />
));

MagneticButton.displayName = "MagneticButton";

export default MagneticButton;