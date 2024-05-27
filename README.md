# wasm-dynamic-memory-allocation-ziglang
Related to  dynamic allocation of memory within WebAssembly programs implemented using the Zig programming language.

Exploring WebAssembly's dynamic memory allocation capabilities using Zig language showcases intriguing behaviors.
This examination reveals how re-entrancy in a WebAssembly (WASM) module, particularly with Bun or Node.js,
affects variable state and memory references across multiple function invocations.

## Condition reproduction

We will use Bun for this example, but it reproduces also with Nodejs.

```bash
bun run build-zig
# With only one run the vars data and result are unreferenced.
# The memory changes of data and result are preserved at memory.buffer
bun run test-oneRun
# If we run the function a second time it works a spected.
bun run test
```

### Observing Behavioral Patterns

Utilizing Bun for demonstration purposes, we uncovered notable patterns concerning dynamic memory allocation within a 
Zig-implemented WASM module:

1. **Initial State (One Run)**: Upon the first invocation of our test function (`test-oneRun`), variable `data_out` does
not retain a reference to allocated memory in `memory.buffer`. This absence is confirmed through console logging, 
displaying an empty Uint8Array.

```bash
# console.log('data_out');
data_out
Uint8Array(0) [  ]
```

2. **Re-invocation and Memory Reinitialization (Second Run)**: After executing the test function (`test`) 
reveals that `data_out` once again loses its reference to `memory.buffer`. However, we subsequently reassign values to 
`data_out`, effectively resetting it to its initial state as intended. This restoration allows our example function to 
execute correctly on subsequent calls.

```bash
# console.log('data_out');
data_out
Uint8Array(4) [ 1, 2, 3, 4 ]
```

Assistance required to pinpoint the source of the problem!
