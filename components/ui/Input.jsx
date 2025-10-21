"use client";

import { forwardRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../utils/cn";

const Input = forwardRef(({ label, error, success, className, value, id, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const { ["aria-describedby"]: ariaDescribedByProp, ["aria-invalid"]: ariaInvalidProp, ...restProps } = props;
  const errorId = error ? `${inputId}-error` : undefined;
  const successId = !error && success ? `${inputId}-success` : undefined;
  const describedBy = [ariaDescribedByProp, errorId ?? successId].filter(Boolean).join(" ") || undefined;
  const ariaInvalid = ariaInvalidProp ?? (error ? "true" : "false");

  return (
    <div className={cn("input", className)}>
      <motion.input
        id={inputId}
        ref={ref}
        className={cn("input__field", {
          "input__field--error": Boolean(error),
          "input__field--success": Boolean(success),
        })}
        whileFocus={{ scale: 1.01 }}
        value={value}
        aria-invalid={ariaInvalid}
        aria-describedby={describedBy}
        {...restProps}
      />
      {label && (
        <motion.label
          className="input__label"
          htmlFor={inputId}
          initial={{ y: 0, scale: 1 }}
          animate={{ y: value ? -24 : 0, scale: value ? 0.85 : 1 }}
        >
          {label}
        </motion.label>
      )}
      <motion.div
        className="input__underline"
        initial={{ scaleX: 0 }}
        whileFocus={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            id={errorId}
            role="alert"
            aria-live="assertive"
            className="input__message input__message--error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.span>
        )}
        {!error && success && (
          <motion.span
            id={successId}
            role="status"
            aria-live="polite"
            className="input__message input__message--success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {success}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = "Input";

export default Input;