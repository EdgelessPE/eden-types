// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright 2020-2022 Edgeless Team. All rights reserved.

declare namespace Eden {
  export namespace os {
    export class Env implements Iterable<[string, string]> {
      [Symbol.iterator](): Iterator<[string, string]>;
      get(key: string): string | undefined;
      set(key: string, value: string): void;
      delete(key: string): void;
      toObject(): {
        [index: string]: string;
      }
    }
  }

  export const env: os.Env
}