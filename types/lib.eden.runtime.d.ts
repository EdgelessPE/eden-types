declare namespace Eden {
  export namespace runtime {
    export interface MemoryUsage {
      rss: number;
      heapTotal: number;
      heapUsed: number;
      external: number;
    }

    /**
     * Returns an object describing the memory usage of the Deno process measured
     * in bytes.
     */
    export function memoryUsage(): MemoryUsage;

    export interface OpMetrics {
      opsDispatched: number;
      opsDispatchedSync: number;
      opsDispatchedAsync: number;
      opsDispatchedAsyncUnref: number;
      opsCompleted: number;
      opsCompletedSync: number;
      opsCompletedAsync: number;
      opsCompletedAsyncUnref: number;
      bytesSentControl: number;
      bytesSentData: number;
      bytesReceived: number;
    }

    export interface Metrics extends OpMetrics {
      ops: Record<string, OpMetrics>;
    }

    /** Receive metrics from the privileged side of Deno. This is primarily used
     * in the development of Deno. 'Ops', also called 'bindings', are the go-between
     * between Deno JavaScript and Deno Rust.
     *
     *      > console.table(Deno.metrics())
     *      ┌─────────────────────────┬────────┐
     *      │         (index)         │ Values │
     *      ├─────────────────────────┼────────┤
     *      │      opsDispatched      │   3    │
     *      │    opsDispatchedSync    │   2    │
     *      │   opsDispatchedAsync    │   1    │
     *      │ opsDispatchedAsyncUnref │   0    │
     *      │      opsCompleted       │   3    │
     *      │    opsCompletedSync     │   2    │
     *      │    opsCompletedAsync    │   1    │
     *      │ opsCompletedAsyncUnref  │   0    │
     *      │    bytesSentControl     │   73   │
     *      │      bytesSentData      │   0    │
     *      │      bytesReceived      │  375   │
     *      └─────────────────────────┴────────┘
     */
    export function metrics(): Metrics;

    interface ResourceMap {
      // deno-lint-ignore no-explicit-any
      [rid: number]: any;
    }

    /** Returns a map of open resource ids (rid) along with their string
     * representations. This is an internal API and as such resource
     * representation has `any` type; that means it can change any time.
     *
     * ```ts
     * console.log(Deno.resources());
     * // { 0: "stdin", 1: "stdout", 2: "stderr" }
     * Deno.openSync('../test.file');
     * console.log(Deno.resources());
     * // { 0: "stdin", 1: "stdout", 2: "stderr", 3: "fsFile" }
     * ```
     */
    export function resources(): ResourceMap;
  }

}