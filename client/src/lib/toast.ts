/**
 * Fires a global ERP toast notification (rendered by ToastContainer).
 * Replaces all alert() calls across the ERP.
 */
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  window.dispatchEvent(
    new CustomEvent('erp-toast', { detail: { message, type } })
  );
}
