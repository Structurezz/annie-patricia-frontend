// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed version of useDispatch
 * Ensures dispatch is typed with AppDispatch (supports async thunks)
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed version of useSelector
 * Prevents having to write `state: RootState` every time
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;