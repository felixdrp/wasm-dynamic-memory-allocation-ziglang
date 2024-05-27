const fs = require('node:fs');
const assert = require('assert').strict;

const wasmBuffer = fs.readFileSync('./wasm/wasm-module.wasm');
const memory = new WebAssembly.Memory({
  initial: 1,
  maximum: 10,
  shared: true,
})

const importObject = {
  js: { mem: memory },
  env: {
    __memory_base: 0,
    __table_base: 0,
    memory,
    // print: (result) => { console.log(`The result is ${result}`); },
  },
  // imports: {
  //   print: (arg) => console.log(arg)
  // }
};

WebAssembly.instantiate(wasmBuffer, importObject).then(wasmModule => {
  // Exported function live under instance.exports
  const { example, memory } = wasmModule.instance.exports;

  // Create an array that can be passed to the WebAssembly instance.
  let data = new Int16Array(memory.buffer, 0, 4)
  data.set([
    1, 1, 1, 1
  ])
  let data_out = new Uint8Array(
    memory.buffer,
    data.byteOffset + data.byteLength,
    data.length
  )
  data_out.set([
    3, 1, 1, 1
  ])
  let total = 0
  console.log(data_out);
  total = example(data.byteOffset, data.length, data_out.byteOffset);

  data = new Int16Array(memory.buffer, 0, 4)
  data_out = new Uint8Array(
    memory.buffer,
    data.byteOffset + data.byteLength,
    data.length
  )

  console.time('encode_time')
  total = example(data.byteOffset, data.length, data_out.byteOffset);
  console.timeEnd('encode_time')

  console.log(total);
  console.log('data');
  console.log(memory.buffer);
  console.log('data_out');
  console.log(data_out);
  assert.strictEqual(total, 10);
});
