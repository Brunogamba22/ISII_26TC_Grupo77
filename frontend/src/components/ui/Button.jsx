import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils'; // Asegúrate de que esta ruta sea correcta

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-all outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-cyan-600 text-white hover:bg-cyan-700',
        outline: 'border-gray-200 bg-white hover:bg-gray-100',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-7 px-2 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };