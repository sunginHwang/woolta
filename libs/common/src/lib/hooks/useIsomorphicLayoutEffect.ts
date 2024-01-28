'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * useLayoutEffect does nothing on the server
 */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
