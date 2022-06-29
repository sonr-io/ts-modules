import { wasm } from '@rollup/plugin-wasm';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [
    wasm({
        targetEnv: 'browser',
    }),
    nodeResolve(),
]
};