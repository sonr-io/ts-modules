import { wasm } from '@rollup/plugin-wasm';

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    wasm({
        targetEnv: 'browser',
    })
]
};