import { HandHeart } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

interface AppLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function AppLogo({ size = 24, className, showText = true }: AppLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HandHeart className="text-primary" size={size} aria-hidden="true" />
      {showText && <span className="font-headline text-lg font-semibold text-primary">{APP_NAME}</span>}
    </div>
  );
}
