/**
 * Performance Web Worker
 * Offloads heavy computations from main thread to prevent blocking
 * 
 * Use cases:
 * - Complex calculations
 * - Data processing
 * - Image manipulation
 * - JSON parsing/stringification
 * - Sorting large datasets
 */

// Type definitions for messages
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

// Listen for messages from main thread
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;

    switch (type) {
      case 'CALCULATE_METRICS':
        result = calculateMetrics(payload);
        break;

      case 'PROCESS_DATA':
        result = processData(payload);
        break;

      case 'SORT_ARRAY':
        result = sortArray(payload);
        break;

      case 'PARSE_JSON':
        result = JSON.parse(payload);
        break;

      case 'STRINGIFY_JSON':
        result = JSON.stringify(payload);
        break;

      case 'FILTER_DATA':
        result = filterData(payload);
        break;

      case 'TRANSFORM_DATA':
        result = transformData(payload);
        break;

      case 'COMPRESS_IMAGE':
        result = compressImageData(payload);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    // Send result back to main thread
    const response: WorkerResponse = {
      type: `${type}_RESULT`,
      result,
      id,
    };

    self.postMessage(response);
  } catch (error) {
    // Send error back to main thread
    const errorResponse: WorkerResponse = {
      type: `${type}_ERROR`,
      result: null,
      id,
      error: error instanceof Error ? error.message : String(error),
    };

    self.postMessage(errorResponse);
  }
});

/**
 * Calculate performance metrics
 */
function calculateMetrics(data: any) {
  const { values, operation } = data;

  switch (operation) {
    case 'average':
      return values.reduce((sum: number, val: number) => sum + val, 0) / values.length;

    case 'median':
      const sorted = [...values].sort((a: number, b: number) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    case 'percentile':
      const { percentile } = data;
      const sortedVals = [...values].sort((a: number, b: number) => a - b);
      const index = Math.ceil((percentile / 100) * sortedVals.length) - 1;
      return sortedVals[index];

    case 'stddev':
      const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      const squareDiffs = values.map((val: number) => Math.pow(val - avg, 2));
      const avgSquareDiff = squareDiffs.reduce((sum: number, val: number) => sum + val, 0) / values.length;
      return Math.sqrt(avgSquareDiff);

    default:
      return null;
  }
}

/**
 * Process large datasets
 */
function processData(data: any) {
  const { items, operations } = data;
  let result = items;

  for (const operation of operations) {
    switch (operation.type) {
      case 'map':
        result = result.map(operation.fn);
        break;

      case 'filter':
        result = result.filter(operation.fn);
        break;

      case 'reduce':
        result = result.reduce(operation.fn, operation.initial);
        break;

      case 'sort':
        result = [...result].sort(operation.fn);
        break;
    }
  }

  return result;
}

/**
 * Sort large arrays efficiently
 */
function sortArray(data: any) {
  const { array, key, order } = data;

  return [...array].sort((a: any, b: any) => {
    const aVal = key ? a[key] : a;
    const bVal = key ? b[key] : b;

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter data with complex conditions
 */
function filterData(data: any) {
  const { items, conditions } = data;

  return items.filter((item: any) => {
    return conditions.every((condition: any) => {
      const value = item[condition.field];
      
      switch (condition.operator) {
        case 'equals':
          return value === condition.value;
        case 'contains':
          return String(value).includes(condition.value);
        case 'greaterThan':
          return value > condition.value;
        case 'lessThan':
          return value < condition.value;
        case 'in':
          return condition.value.includes(value);
        default:
          return true;
      }
    });
  });
}

/**
 * Transform data structures
 */
function transformData(data: any) {
  const { items, mapping } = data;

  return items.map((item: any) => {
    const transformed: any = {};

    for (const [newKey, config] of Object.entries(mapping)) {
      const { source, transform } = config as any;
      let value = item[source];

      if (transform) {
        switch (transform.type) {
          case 'uppercase':
            value = String(value).toUpperCase();
            break;
          case 'lowercase':
            value = String(value).toLowerCase();
            break;
          case 'number':
            value = Number(value);
            break;
          case 'date':
            value = new Date(value).toISOString();
            break;
          case 'custom':
            // Allow custom transformation function
            if (typeof transform.fn === 'function') {
              value = transform.fn(value);
            }
            break;
        }
      }

      transformed[newKey] = value;
    }

    return transformed;
  });
}

/**
 * Compress image data (basic implementation)
 */
function compressImageData(data: any) {
  const { imageData, quality } = data;
  
  // Basic compression simulation
  // In production, use more sophisticated algorithms
  const compressed = {
    width: imageData.width,
    height: imageData.height,
    quality: quality || 0.8,
    data: imageData.data, // In reality, apply compression here
  };

  return compressed;
}

// Notify main thread that worker is ready
self.postMessage({ type: 'WORKER_READY' });

console.log('[Worker] Performance Worker initialized');



