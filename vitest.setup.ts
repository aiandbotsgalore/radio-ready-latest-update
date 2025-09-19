import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

if (!globalThis.crypto?.randomUUID) {
    globalThis.crypto = {
        ...(globalThis.crypto || {}),
        randomUUID: () => '00000000-0000-0000-0000-000000000000',
    } as Crypto;
}

if (typeof FileReader === 'undefined') {
    class FileReaderMock {
        public result: string | ArrayBuffer | null = null;
        public onload: null | (() => void) = null;
        public onerror: null | (() => void) = null;

        public readAsArrayBuffer(blob: Blob) {
            blob
                .arrayBuffer()
                .then((buffer) => {
                    this.result = buffer;
                    this.onload?.();
                })
                .catch(() => {
                    this.onerror?.();
                });
        }
    }

    // @ts-expect-error override for Node environment
    globalThis.FileReader = FileReaderMock;
}
