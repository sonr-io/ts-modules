import { buffer2string } from '../lib/utils';
import { string2buffer } from './../src/utils';

test('string2buf should returned defined array buffer', () => {
    const buf: Uint8Array = string2buffer("YXNkYXNkYXNkYXNkYXNkYXNk")
    expect(buf).toBeDefined();
});

test('string2buf should returned defined array buffer of correct length', () => {
    const buf: Uint8Array = string2buffer("YXN")
    expect(buf.length).toBe(3)
});

test('buffer2string should return defined string', () => {
    const buf: Uint8Array = string2buffer("YXN")
    const str: string = buffer2string(buf)
    expect(str).toBeDefined()
});

test('buffer2string should return decoded string from buffer', () => {
    const buf: Uint8Array = string2buffer("YXN")
    const str: string = buffer2string(buf)
    expect(str).toBe('YXN')
});