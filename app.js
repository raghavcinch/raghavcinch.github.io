import { asModule, setASModuleExports, getString } from './as-utils.js';

const importObj = {
  module: {
    log: (msgPtr) => {
      console.log(`WASM >> ${getString(asModule, msgPtr)}`);
    }
  },
  env: {
    memory: new WebAssembly.Memory({ initial: 256 }),
    table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
  }
};

const wasm = WebAssembly.instantiateStreaming(fetch('https://barkeywolf.consulting/barcode-scanner-webassembly-demo/a.out.wasm'), importObj);
wasm
  .then(({ instance }) => {
    const { exports } = instance;
    setASModuleExports(exports);

    const { add } = exports;
    console.log(`2 + 4 = ${add(2, 4)}`);
  })
  .catch(err => {
    console.error('Error: ', err);
  });
