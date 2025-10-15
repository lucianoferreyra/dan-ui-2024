'use client';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  warningText,
  onConfirm, 
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDanger = false
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        {warningText && (
          <p className={styles.warningText}>{warningText}</p>
        )}
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={isDanger ? styles.btnDanger : styles.btnConfirm} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
