import type {
  ButtonHTMLAttributes,
  FC,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'tertiary';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  haptic?: boolean;
  ripple?: boolean;
  glowOnHover?: boolean;
  shine?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

declare const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>>;

export declare const ButtonShine: FC;

export default Button;