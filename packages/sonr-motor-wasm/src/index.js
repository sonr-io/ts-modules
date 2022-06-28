// import './polyfis';
import { createModuleInstance } from './loader';
import wasmBuff from '../public/sonr-motor.wasm'

const runtime = new Go()
createModuleInstance(wasmBuff, runtime)
