import { EffectCallback, useEffect } from 'react';

/**
 * @hook Mount 시점만 호출하도록
 * @example
 *  useMount(() => {
 *   ...
 * });
 */

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useMount = (effect_callback: EffectCallback) => useEffect(effect_callback, []);
