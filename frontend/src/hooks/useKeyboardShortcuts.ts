import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

export default function useKeyboardShortcuts(config: ShortcutConfig[], callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      config.forEach(({ key, ctrl, alt, shift }) => {
        if (
          event.key === key &&
          (ctrl === undefined || event.ctrlKey === ctrl) &&
          (alt === undefined || event.altKey === alt) &&
          (shift === undefined || event.shiftKey === shift)
        ) {
          event.preventDefault();
          callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, callback]);
}
