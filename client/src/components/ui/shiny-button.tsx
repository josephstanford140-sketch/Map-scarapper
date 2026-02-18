import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function ShinyButton({ 
  children, 
  className, 
  isLoading, 
  variant = 'primary',
  disabled,
  ...props 
}: ShinyButtonProps) {
  
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium transition-all duration-300 rounded-xl group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 border border-transparent",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-white/10",
    outline: "bg-transparent border-2 border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5",
    ghost: "bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
        <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
          <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white opacity-10"></span>
        </span>
      )}
      
      {/* Loading state */}
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      
      <span className="relative flex items-center gap-2">{children}</span>
      
      {/* Bottom shine for primary */}
      {variant === 'primary' && (
        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full opacity-10"></span>
      )}
    </button>
  );
}
