import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] shadow-2xl w-full max-w-md border border-[var(--border)] animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-6 border-b border-[var(--border)]">
                    <h3 className="text-h4 font-display text-[var(--text-primary)]">{title}</h3>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4">
                        {variant === 'danger' && (
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                        )}
                        <p className="text-[var(--text-body)] leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-[var(--bg-elevated)]/50 rounded-b-[var(--radius-lg)] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all
                            ${variant === 'danger'
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                                : 'bg-[var(--brand-coral)] hover:bg-[var(--brand-coral)]/90 shadow-[var(--brand-coral)]/20'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
