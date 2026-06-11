// ============================================
// hooks/redux.ts
// Typed versions of useSelector and useDispatch.
// Always use these instead of the raw ones.
// ============================================

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);