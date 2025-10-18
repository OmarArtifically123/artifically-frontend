import * as React from "react";
import { createStore } from "zustand/vanilla";
import type { StateCreator, StoreApi } from "zustand/vanilla";

type EqualityChecker<T> = (state: T, newState: T) => boolean;
type UseBoundStore<T> = {
  (): T extends StoreApi<infer R> ? R : never;
  <U>(selector: (state: T extends StoreApi<infer R> ? R : never) => U, equalityFn?: EqualityChecker<U>): U;
} & T;

type AnyStateCreator<T> = StateCreator<T, [], []> | StoreApi<T>;

const isServerEnvironment =
  typeof window === "undefined" ||
  typeof window.navigator === "undefined" ||
  /ServerSideRendering|^Deno\//.test(window.navigator.userAgent ?? "");

function useIsomorphicLayoutEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const hookName: "useEffect" | "useLayoutEffect" =
    !isServerEnvironment && typeof React.useLayoutEffect === "function" ? "useLayoutEffect" : "useEffect";

  const hook = React[hookName] as typeof React.useEffect;
  return hook(effect, deps);
}

function createHookedStore<TState>(createState: AnyStateCreator<TState>) {
  const api = typeof createState === "function" ? createStore(createState as StateCreator<TState, [], []>) : (createState as StoreApi<TState>);

  const defaultSelector = (value: TState) => value;
  const useStore: UseBoundStore<StoreApi<TState>> = ((
    selector: ((state: TState) => unknown) | undefined = undefined,
    equalityFn: EqualityChecker<unknown> = Object.is as EqualityChecker<unknown>,
  ) => {
    const [, forceUpdate] = React.useReducer((count) => count + 1, 0);
    const state = api.getState();

    const stateRef = React.useRef(state);
    const resolvedSelector = selector ?? defaultSelector;
    const selectorRef = React.useRef(resolvedSelector);
    const equalityFnRef = React.useRef(equalityFn);
    const erroredRef = React.useRef(false);
    const currentSliceRef = React.useRef<unknown>();

    if (currentSliceRef.current === undefined) {
      currentSliceRef.current = resolvedSelector(state);
    }

    let newStateSlice: unknown;
    let hasNewSlice = false;

    if (
      stateRef.current !== state ||
      selectorRef.current !== selector ||
      equalityFnRef.current !== equalityFn ||
      erroredRef.current
    ) {
      newStateSlice = resolvedSelector(state);
      hasNewSlice = !equalityFn(currentSliceRef.current, newStateSlice);
    }

    useIsomorphicLayoutEffect(() => {
      if (hasNewSlice) {
        currentSliceRef.current = newStateSlice;
      }
      stateRef.current = state;
      selectorRef.current = resolvedSelector;
      equalityFnRef.current = equalityFn;
      erroredRef.current = false;
    });

    const stateBeforeSubscriptionRef = React.useRef(state);

    useIsomorphicLayoutEffect(() => {
      const listener = () => {
        try {
          const nextState = api.getState();
          const nextStateSlice = selectorRef.current(nextState);
          if (!equalityFnRef.current(currentSliceRef.current, nextStateSlice)) {
            stateRef.current = nextState;
            currentSliceRef.current = nextStateSlice;
            forceUpdate();
          }
        } catch (error) {
          erroredRef.current = true;
          forceUpdate();
        }
      };

      const unsubscribe = api.subscribe(listener);

      if (api.getState() !== stateBeforeSubscriptionRef.current) {
        listener();
      }

      return unsubscribe;
    }, []);

    const sliceToReturn = hasNewSlice ? newStateSlice : currentSliceRef.current;
    React.useDebugValue(sliceToReturn);
    return sliceToReturn as TState;
  }) as UseBoundStore<StoreApi<TState>>;

  Object.assign(useStore, api);

  Object.defineProperty(useStore, Symbol.iterator, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: function iterator() {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[useStore, api] = create() is deprecated and will be removed in a future release.");
      }
      const items: Array<typeof useStore | typeof api> = [useStore, api];
      return {
        next() {
          const value = items.shift();
          return { value, done: value === undefined };
        },
      };
    },
  });

  return useStore;
}

export function create<TState>(createState: StateCreator<TState, [], []>): UseBoundStore<StoreApi<TState>>;
export function create<TState>(createState: StoreApi<TState>): UseBoundStore<StoreApi<TState>>;
export function create<TState>(createState: AnyStateCreator<TState>) {
  return createHookedStore(createState);
}

export default create;
export * from "zustand/vanilla";