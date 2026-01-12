import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HotkeyConfig {
    key: string;
    alt?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    action: () => void;
    description: string;
}

export function useHotkeys() {
    const navigate = useNavigate();
    const [showHelp, setShowHelp] = useState(false);

    const hotkeys: HotkeyConfig[] = [
        { key: 'h', alt: true, action: () => navigate('/'), description: 'Главная страница' },
        { key: 'p', alt: true, action: () => navigate('/catalog'), description: 'Каталог продукции' },
        { key: 'c', alt: true, action: () => navigate('/cart'), description: 'Корзина' },
        { key: 's', alt: true, action: () => navigate('/settings'), description: 'Настройки' },
        { key: '/', action: () => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus(), description: 'Фокус на поиск' },
        { key: '?', shift: true, action: () => setShowHelp(true), description: 'Показать справку' },
        { key: 'Escape', action: () => setShowHelp(false), description: 'Закрыть модальное окно' },
    ];

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            if (event.key === 'Escape') {
                (event.target as HTMLElement).blur();
            }
            return;
        }

        for (const hotkey of hotkeys) {
            const altMatch = hotkey.alt ? event.altKey : !event.altKey;
            const ctrlMatch = hotkey.ctrl ? event.ctrlKey : !event.ctrlKey;
            const shiftMatch = hotkey.shift ? event.shiftKey : !event.shiftKey;

            if (event.key === hotkey.key && altMatch && ctrlMatch && shiftMatch) {
                event.preventDefault();
                hotkey.action();
                break;
            }
        }
    }, [navigate]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return { showHelp, setShowHelp, hotkeys };
}

interface HotkeysHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

export function HotkeysHelp({ isOpen, onClose }: HotkeysHelpProps) {
    if (!isOpen) return null;

    const shortcuts = [
        { keys: ['Alt', 'H'], description: 'Главная страница' },
        { keys: ['Alt', 'P'], description: 'Каталог продукции' },
        { keys: ['Alt', 'C'], description: 'Корзина' },
        { keys: ['Alt', 'S'], description: 'Настройки' },
        { keys: ['/'], description: 'Фокус на поиск' },
        { keys: ['Shift', '?'], description: 'Показать эту справку' },
        { keys: ['Esc'], description: 'Закрыть модальное окно' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Горячие клавиши</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-600">{shortcut.description}</span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, keyIndex) => (
                                    <kbd key={keyIndex} className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center">
                        Нажмите <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs">Esc</kbd> для закрытия
                    </p>
                </div>
            </div>
        </div>
    );
}
