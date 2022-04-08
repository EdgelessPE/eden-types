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