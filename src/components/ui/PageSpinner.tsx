// ============================================
// PageSpinner.tsx
// Full page loading indicator.
// Shown by Suspense while a lazy page loads.
// ============================================

import styles from './PageSpinner.module.scss';

export function PageSpinner() {
  return (
    <div className={styles.overlay} role="status" aria-label="Loading...">
      <div className={styles.spinner} />
      <p className={styles.text}>Loading...</p>
    </div>
  );
}