import * as React from "react"
import { Slot } from "radix-ui"
import styles from "./button.module.css"

type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

function getButtonClassName({
  className,
  variant,
  size,
}: {
  className?: string
  variant: ButtonVariant
  size: ButtonSize
}) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[`size-${size}`],
    className,
  ].filter(Boolean)

  return classNames.join(" ")
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  {
    variant?: ButtonVariant
    size?: ButtonSize
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={getButtonClassName({ variant, size, className })}
      {...props}
    />
  )
}

export { Button }
