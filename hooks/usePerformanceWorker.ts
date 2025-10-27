import { useEffect, useRef, useState, useCallback } from 'react';

interface WorkerMessage {
  type: string;
  payload: any;
  id: string;
}

interface WorkerResponse {
  type: string;
  result: any;
  id: string;
  error?: string;
}

interface UsePerformanceWorkerReturn {
  executeTask: <T = any>(type: string, payload: any) => Promise<T>;
  isReady: boolean;
  terminate: () => void;
}

/**
 * Hook for using Performance Web Worker
 * Offloads heavy computations to background thread
 * 
 * @example
 * const { executeTask } = usePerformanceWorker();
 * 
 * const result = await executeTask('CALCULATE_METRICS', {
 *   values: [1, 2, 3, 4, 5],
 *   operation: 'average'
 * });
 */
export function usePerformanceWorker(): UsePerformanceWorkerReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const pendingTasksRef = useRef<Map<string, {
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }>>(new Map());

  useEffect(() => {
    // Only create worker in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Create worker
    try {
      workerRef.current = new Worker(
        new URL('../workers/performance.worker.ts', import.meta.url),
        { type: 'module' }
      );

      // Listen for messages from worker
      workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const { type, result, id, error } = event.data;

        if (type === 'WORKER_READY') {
          setIsReady(true);
          console.log('[App] Performance Worker ready');
          return;
        }

        // Resolve pending task
        const pending = pendingTasksRef.current.get(id);
        if (pending) {
          if (error) {
            pending.reject(new Error(error));
          } else {
            pending.resolve(result);
          }
          pendingTasksRef.current.delete(id);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('[App] Performance Worker error:', error);
        
        // Reject all pending tasks
        pendingTasksRef.current.forEach(({ reject }) => {
          reject(new Error('Worker error'));
        });
        pendingTasksRef.current.clear();
      };

    } catch (error) {
      console.error('[App] Failed to create Performance Worker:', error);
    }

    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      pendingTasksRef.current.clear();
    };
  }, []);

  /**
   * Execute a task in the worker
   */
  const executeTask = useCallback(<T = any>(type: string, payload: any): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isReady) {
        reject(new Error('Worker not ready'));
        return;
      }

      // Generate unique task ID
      const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store pending task
      pendingTasksRef.current.set(id, { resolve, reject });

      // Send message to worker
      const message: WorkerMessage = {
        type,
        payload,
        id,
      };

      workerRef.current.postMessage(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        const pending = pendingTasksRef.current.get(id);
        if (pending) {
          pending.reject(new Error('Task timeout'));
          pendingTasksRef.current.delete(id);
        }
      }, 30000);
    });
  }, [isReady]);

  /**
   * Terminate the worker manually
   */
  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setIsReady(false);
    }
  }, []);

  return {
    executeTask,
    isReady,
    terminate,
  };
}

/**
 * Helper hook for calculating metrics in worker
 */
export function useWorkerMetrics() {
  const { executeTask, isReady } = usePerformanceWorker();

  const calculateAverage = useCallback(
    (values: number[]) => {
      return executeTask<number>('CALCULATE_METRICS', {
        values,
        operation: 'average',
      });
    },
    [executeTask]
  );

  const calculateMedian = useCallback(
    (values: number[]) => {
      return executeTask<number>('CALCULATE_METRICS', {
        values,
        operation: 'median',
      });
    },
    [executeTask]
  );

  const calculatePercentile = useCallback(
    (values: number[], percentile: number) => {
      return executeTask<number>('CALCULATE_METRICS', {
        values,
        operation: 'percentile',
        percentile,
      });
    },
    [executeTask]
  );

  const calculateStdDev = useCallback(
    (values: number[]) => {
      return executeTask<number>('CALCULATE_METRICS', {
        values,
        operation: 'stddev',
      });
    },
    [executeTask]
  );

  return {
    calculateAverage,
    calculateMedian,
    calculatePercentile,
    calculateStdDev,
    isReady,
  };
}

/**
 * Helper hook for sorting large arrays in worker
 */
export function useWorkerSort() {
  const { executeTask, isReady } = usePerformanceWorker();

  const sortArray = useCallback(
    <T extends any[]>(array: T, key?: string, order: 'asc' | 'desc' = 'asc') => {
      return executeTask<T>('SORT_ARRAY', {
        array,
        key,
        order,
      });
    },
    [executeTask]
  );

  return {
    sortArray,
    isReady,
  };
}



