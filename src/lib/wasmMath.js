const wasmCode = new Uint8Array([
  0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f,
  0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00,
  0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b,
]);

let wasmExportsPromise;

async function getWasmExports() {
  if (!wasmExportsPromise) {
    wasmExportsPromise = WebAssembly.instantiate(wasmCode).then((result) => result.instance.exports);
  }
  return wasmExportsPromise;
}

export async function wasmAddInts(a, b) {
  const exports = await getWasmExports();
  return exports.add(a | 0, b | 0);
}

export async function wasmAverage(values) {
  if (!values.length) return 0;
  const exports = await getWasmExports();
  let total = 0;
  for (const value of values) {
    total = exports.add(total, Math.round(value));
  }
  return total / values.length;
}

export function warmupWasm() {
  getWasmExports().catch((error) => {
    console.warn("Failed to warmup WASM module", error);
  });
}