declare namespace Eden {
  
  export namespace process {
    
    export class Process<T extends RunOptions = RunOptions> {
      readonly rid: number;
      readonly pid: number;
      readonly stdin: T["stdin"] extends "piped" ? Writer & Closer
        : (Writer & Closer) | null;
      readonly stdout: T["stdout"] extends "piped" ? Reader & Closer
        : (Reader & Closer) | null;
      readonly stderr: T["stderr"] extends "piped" ? Reader & Closer
        : (Reader & Closer) | null;
      /** Wait for the process to exit and return its exit status.
       *
       * Calling this function multiple times will return the same status.
       *
       * Stdin handle to the process will be closed before waiting to avoid
       * a deadlock.
       *
       * If `stdout` and/or `stderr` were set to `"piped"`, they must be closed
       * manually before the process can exit.
       *
       * To run process to completion and collect output from both `stdout` and
       * `stderr` use:
       *
       * ```ts
       * const p = Deno.run({ cmd: [ "echo", "hello world" ], stderr: 'piped', stdout: 'piped' });
       * const [status, stdout, stderr] = await Promise.all([
       *   p.status(),
       *   p.output(),
       *   p.stderrOutput()
       * ]);
       * p.close();
       * ```
       */
      status(): Promise<ProcessStatus>;
      /** Buffer the stdout until EOF and return it as `Uint8Array`.
       *
       * You must set stdout to `"piped"` when creating the process.
       *
       * This calls `close()` on stdout after its done. */
      output(): Promise<Uint8Array>;
      /** Buffer the stderr until EOF and return it as `Uint8Array`.
       *
       * You must set stderr to `"piped"` when creating the process.
       *
       * This calls `close()` on stderr after its done. */
      stderrOutput(): Promise<Uint8Array>;
      close(): void;

      /** Send a signal to process.
       *
       * ```ts
       * const p = Deno.run({ cmd: [ "sleep", "20" ]});
       * p.kill("SIGTERM");
       * p.close();
       * ```
       */
      kill(signo: Signal): void;
    }

    export type Signal =
      | "SIGABRT"
      | "SIGALRM"
      | "SIGBUS"
      | "SIGCHLD"
      | "SIGCONT"
      | "SIGEMT"
      | "SIGFPE"
      | "SIGHUP"
      | "SIGILL"
      | "SIGINFO"
      | "SIGINT"
      | "SIGIO"
      | "SIGKILL"
      | "SIGPIPE"
      | "SIGPROF"
      | "SIGPWR"
      | "SIGQUIT"
      | "SIGSEGV"
      | "SIGSTKFLT"
      | "SIGSTOP"
      | "SIGSYS"
      | "SIGTERM"
      | "SIGTRAP"
      | "SIGTSTP"
      | "SIGTTIN"
      | "SIGTTOU"
      | "SIGURG"
      | "SIGUSR1"
      | "SIGUSR2"
      | "SIGVTALRM"
      | "SIGWINCH"
      | "SIGXCPU"
      | "SIGXFSZ";

    export type ProcessStatus =
      | {
        success: true;
        code: 0;
        signal?: undefined;
      }
      | {
        success: false;
        code: number;
        signal?: number;
      };

    export interface RunOptions {
      /** Arguments to pass. Note, the first element needs to be a path to the
       * binary */
      cmd: string[] | [URL, ...string[]];
      cwd?: string;
      env?: {
        [key: string]: string;
      };
      stdout?: "inherit" | "piped" | "null" | number;
      stderr?: "inherit" | "piped" | "null" | number;
      stdin?: "inherit" | "piped" | "null" | number;
    }

    /** Spawns new subprocess.  RunOptions must contain at a minimum the `opt.cmd`,
     * an array of program arguments, the first of which is the binary.
     *
     * ```ts
     * const p = Deno.run({
     *   cmd: ["echo", "hello"],
     * });
     * ```
     *
     * Subprocess uses same working directory as parent process unless `opt.cwd`
     * is specified.
     *
     * Environmental variables from parent process can be cleared using `opt.clearEnv`.
     * Doesn't guarantee that only `opt.env` variables are present,
     * as the OS may set environmental variables for processes.
     *
     * Environmental variables for subprocess can be specified using `opt.env`
     * mapping.
     *
     * `opt.uid` sets the child process’s user ID. This translates to a setuid call
     * in the child process. Failure in the setuid call will cause the spawn to fail.
     *
     * `opt.gid` is similar to `opt.uid`, but sets the group ID of the child process.
     * This has the same semantics as the uid field.
     *
     * By default subprocess inherits stdio of parent process. To change that
     * `opt.stdout`, `opt.stderr` and `opt.stdin` can be specified independently -
     * they can be set to either an rid of open file or set to "inherit" "piped"
     * or "null":
     *
     * `"inherit"` The default if unspecified. The child inherits from the
     * corresponding parent descriptor.
     *
     * `"piped"` A new pipe should be arranged to connect the parent and child
     * sub-processes.
     *
     * `"null"` This stream will be ignored. This is the equivalent of attaching
     * the stream to `/dev/null`.
     *
     * Details of the spawned process are returned.
     *
     * Requires `allow-run` permission. */
    export function run<T extends RunOptions = RunOptions>(opt: T): Process<T>;
  }

}