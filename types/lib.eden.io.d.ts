declare namespace Eden { 
  
  export namespace errors {
    export class NotFound extends Error {}
    export class BrokenPipe extends Error {}
    export class AlreadyExists extends Error {}
    export class InvalidData extends Error {}
    export class TimedOut extends Error {}
    export class Interrupted extends Error {}
    export class WriteZero extends Error {}
    export class UnexpectedEof extends Error {}
    export class BadResource extends Error {}
    export class Busy extends Error {}
    export class NotSupported extends Error {}
  }


  export namespace io {
    /** A set of error constructors that are raised by Deno APIs. */

    /**
     * Change the current working directory to the specified path.
     *
     * ```ts
     * Deno.chdir("/home/userA");
     * Deno.chdir("../userB");
     * Deno.chdir("C:\\Program Files (x86)\\Java");
     * ```
     *
     * Throws `Deno.errors.NotFound` if directory not found.
     * Throws `Deno.errors.PermissionDenied` if the user does not have access
     * rights
     *
     * Requires --allow-read.
     */
    export function chdir(directory: string | URL): void;

    /**
     * Return a string representing the current working directory.
     *
     * If the current directory can be reached via multiple paths (due to symbolic
     * links), `cwd()` may return any one of them.
     *
     * ```ts
     * const currentWorkingDirectory = Deno.cwd();
     * ```
     *
     * Throws `Deno.errors.NotFound` if directory not available.
     *
     * Requires --allow-read
     */
    export function cwd(): string;

    /**
     * Synchronously creates `newpath` as a hard link to `oldpath`.
     *
     * ```ts
     * Deno.linkSync("old/name", "new/name");
     * ```
     *
     * Requires `allow-read` and `allow-write` permissions. */
    export function linkSync(oldpath: string, newpath: string): void;

    /**
     * Creates `newpath` as a hard link to `oldpath`.
     *
     * ```ts
     * await Deno.link("old/name", "new/name");
     * ```
     *
     * Requires `allow-read` and `allow-write` permissions. */
    export function link(oldpath: string, newpath: string): Promise<void>;

    export enum SeekMode {
      Start = 0,
      Current = 1,
      End = 2,
    }

    export interface Reader {
      /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number of
       * bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
       * encountered. Even if `read()` resolves to `n` < `p.byteLength`, it may
       * use all of `p` as scratch space during the call. If some data is
       * available but not `p.byteLength` bytes, `read()` conventionally resolves
       * to what is available instead of waiting for more.
       *
       * When `read()` encounters end-of-file condition, it resolves to EOF
       * (`null`).
       *
       * When `read()` encounters an error, it rejects with an error.
       *
       * Callers should always process the `n` > `0` bytes returned before
       * considering the EOF (`null`). Doing so correctly handles I/O errors that
       * happen after reading some bytes and also both of the allowed EOF
       * behaviors.
       *
       * Implementations should not retain a reference to `p`.
       *
       * Use iter() from https://deno.land/std/io/util.ts to turn a Reader into an
       * AsyncIterator.
       */
      read(p: Uint8Array): Promise<number | null>;
    }

    export interface ReaderSync {
      /** Reads up to `p.byteLength` bytes into `p`. It resolves to the number
       * of bytes read (`0` < `n` <= `p.byteLength`) and rejects if any error
       * encountered. Even if `readSync()` returns `n` < `p.byteLength`, it may use
       * all of `p` as scratch space during the call. If some data is available
       * but not `p.byteLength` bytes, `readSync()` conventionally returns what is
       * available instead of waiting for more.
       *
       * When `readSync()` encounters end-of-file condition, it returns EOF
       * (`null`).
       *
       * When `readSync()` encounters an error, it throws with an error.
       *
       * Callers should always process the `n` > `0` bytes returned before
       * considering the EOF (`null`). Doing so correctly handles I/O errors that happen
       * after reading some bytes and also both of the allowed EOF behaviors.
       *
       * Implementations should not retain a reference to `p`.
       *
       * Use iterSync() from https://deno.land/std/io/util.ts to turn a ReaderSync
       * into an Iterator.
       */
      readSync(p: Uint8Array): number | null;
    }

    export interface Writer {
      /** Writes `p.byteLength` bytes from `p` to the underlying data stream. It
       * resolves to the number of bytes written from `p` (`0` <= `n` <=
       * `p.byteLength`) or reject with the error encountered that caused the
       * write to stop early. `write()` must reject with a non-null error if
       * would resolve to `n` < `p.byteLength`. `write()` must not modify the
       * slice data, even temporarily.
       *
       * Implementations should not retain a reference to `p`.
       */
      write(p: Uint8Array): Promise<number>;
    }

    export interface WriterSync {
      /** Writes `p.byteLength` bytes from `p` to the underlying data
       * stream. It returns the number of bytes written from `p` (`0` <= `n`
       * <= `p.byteLength`) and any error encountered that caused the write to
       * stop early. `writeSync()` must throw a non-null error if it returns `n` <
       * `p.byteLength`. `writeSync()` must not modify the slice data, even
       * temporarily.
       *
       * Implementations should not retain a reference to `p`.
       */
      writeSync(p: Uint8Array): number;
    }

    export interface Closer {
      close(): void;
    }

    export interface Seeker {
      /** Seek sets the offset for the next `read()` or `write()` to offset,
       * interpreted according to `whence`: `Start` means relative to the
       * start of the file, `Current` means relative to the current offset,
       * and `End` means relative to the end. Seek resolves to the new offset
       * relative to the start of the file.
       *
       * Seeking to an offset before the start of the file is an error. Seeking to
       * any positive offset is legal, but the behavior of subsequent I/O
       * operations on the underlying object is implementation-dependent.
       * It returns the number of cursor position.
       */
      seek(offset: number, whence: SeekMode): Promise<number>;
    }

    export interface SeekerSync {
      /** Seek sets the offset for the next `readSync()` or `writeSync()` to
       * offset, interpreted according to `whence`: `Start` means relative
       * to the start of the file, `Current` means relative to the current
       * offset, and `End` means relative to the end.
       *
       * Seeking to an offset before the start of the file is an error. Seeking to
       * any positive offset is legal, but the behavior of subsequent I/O
       * operations on the underlying object is implementation-dependent.
       */
      seekSync(offset: number, whence: SeekMode): number;
    }

    /**
     * Copies from `src` to `dst` until either EOF (`null`) is read from `src` or
     * an error occurs. It resolves to the number of bytes copied or rejects with
     * the first error encountered while copying.
     *
     * ```ts
     * const source = await Deno.open("my_file.txt");
     * const bytesCopied1 = await Deno.copy(source, Deno.stdout);
     * const destination = await Deno.create("my_file_2.txt");
     * const bytesCopied2 = await Deno.copy(source, destination);
     * ```
     *
     * - deprecated Use `copy` from https://deno.land/std/streams/conversion.ts
     * instead. `Deno.copy` will be removed in Deno 2.0.
     *
     * @param src The source to copy from
     * @param dst The destination to copy to
     * @param options Can be used to tune size of the buffer. Default size is 32kB
     */
    export function copy(
      src: Reader,
      dst: Writer,
      options?: {
        bufSize?: number;
      },
    ): Promise<number>;

    /**
     * Turns a Reader, `r`, into an async iterator.
     *
     * ```ts
     * let f = await Deno.open("/etc/passwd");
     * for await (const chunk of Deno.iter(f)) {
     *   console.log(chunk);
     * }
     * f.close();
     * ```
     *
     * Second argument can be used to tune size of a buffer.
     * Default size of the buffer is 32kB.
     *
     * ```ts
     * let f = await Deno.open("/etc/passwd");
     * const iter = Deno.iter(f, {
     *   bufSize: 1024 * 1024
     * });
     * for await (const chunk of iter) {
     *   console.log(chunk);
     * }
     * f.close();
     * ```
     *
     * Iterator uses an internal buffer of fixed size for efficiency; it returns
     * a view on that buffer on each iteration. It is therefore caller's
     * responsibility to copy contents of the buffer if needed; otherwise the
     * next iteration will overwrite contents of previously returned chunk.
     *
     * - deprecated Use `iterateReader` from
     * https://deno.land/std/streams/conversion.ts instead. `Deno.iter` will be
     * removed in Deno 2.0.
     */
    export function iter(
      r: Reader,
      options?: {
        bufSize?: number;
      },
    ): AsyncIterableIterator<Uint8Array>;

    /**
     * Turns a ReaderSync, `r`, into an iterator.
     *
     * ```ts
     * let f = Deno.openSync("/etc/passwd");
     * for (const chunk of Deno.iterSync(f)) {
     *   console.log(chunk);
     * }
     * f.close();
     * ```
     *
     * Second argument can be used to tune size of a buffer.
     * Default size of the buffer is 32kB.
     *
     * ```ts
     * let f = await Deno.open("/etc/passwd");
     * const iter = Deno.iterSync(f, {
     *   bufSize: 1024 * 1024
     * });
     * for (const chunk of iter) {
     *   console.log(chunk);
     * }
     * f.close();
     * ```
     *
     * Iterator uses an internal buffer of fixed size for efficiency; it returns
     * a view on that buffer on each iteration. It is therefore caller's
     * responsibility to copy contents of the buffer if needed; otherwise the
     * next iteration will overwrite contents of previously returned chunk.
     *
     * - deprecated Use `iterateReaderSync` from
     * https://deno.land/std/streams/conversion.ts instead. `Deno.iterSync` will
     * be removed in Deno 2.0.
     */
    export function iterSync(
      r: ReaderSync,
      options?: {
        bufSize?: number;
      },
    ): IterableIterator<Uint8Array>;

    /** Synchronously open a file and return an instance of `Deno.File`.  The
     * file does not need to previously exist if using the `create` or `createNew`
     * open options.  It is the callers responsibility to close the file when finished
     * with it.
     *
     * ```ts
     * const file = Deno.openSync("/foo/bar.txt", { read: true, write: true });
     * // Do work with file
     * Deno.close(file.rid);
     * ```
     *
     * Requires `allow-read` and/or `allow-write` permissions depending on options.
     */
    export function openSync(path: string | URL, options?: OpenOptions): File;

    /** Open a file and resolve to an instance of `Deno.File`.  The
     * file does not need to previously exist if using the `create` or `createNew`
     * open options.  It is the callers responsibility to close the file when finished
     * with it.
     *
     * ```ts
     * const file = await Deno.open("/foo/bar.txt", { read: true, write: true });
     * // Do work with file
     * Deno.close(file.rid);
     * ```
     *
     * Requires `allow-read` and/or `allow-write` permissions depending on options.
     */
    export function open(
      path: string | URL,
      options?: OpenOptions,
    ): Promise<File>;

    /** Creates a file if none exists or truncates an existing file and returns
     *  an instance of `Deno.File`.
     *
     * ```ts
     * const file = Deno.createSync("/foo/bar.txt");
     * ```
     *
     * Requires `allow-read` and `allow-write` permissions.
     */
    export function createSync(path: string | URL): File;

    /** Creates a file if none exists or truncates an existing file and resolves to
     *  an instance of `Deno.File`.
     *
     * ```ts
     * const file = await Deno.create("/foo/bar.txt");
     * ```
     *
     * Requires `allow-read` and `allow-write` permissions.
     */
    export function create(path: string | URL): Promise<File>;

    /** Synchronously read from a resource ID (`rid`) into an array buffer (`buffer`).
     *
     * Returns either the number of bytes read during the operation or EOF
     * (`null`) if there was nothing more to read.
     *
     * It is possible for a read to successfully return with `0` bytes. This does
     * not indicate EOF.
     *
     * This function is one of the lowest level APIs and most users should not
     * work with this directly, but rather use Deno.readAllSync() instead.
     *
     * **It is not guaranteed that the full buffer will be read in a single call.**
     *
     * ```ts
     * // if "/foo/bar.txt" contains the text "hello world":
     * const file = Deno.openSync("/foo/bar.txt");
     * const buf = new Uint8Array(100);
     * const numberOfBytesRead = Deno.readSync(file.rid, buf); // 11 bytes
     * const text = new TextDecoder().decode(buf);  // "hello world"
     * Deno.close(file.rid);
     * ```
     */
    export function readSync(rid: number, buffer: Uint8Array): number | null;

    /** Read from a resource ID (`rid`) into an array buffer (`buffer`).
     *
     * Resolves to either the number of bytes read during the operation or EOF
     * (`null`) if there was nothing more to read.
     *
     * It is possible for a read to successfully return with `0` bytes. This does
     * not indicate EOF.
     *
     * This function is one of the lowest level APIs and most users should not
     * work with this directly, but rather use Deno.readAll() instead.
     *
     * **It is not guaranteed that the full buffer will be read in a single call.**
     *
     * ```ts
     * // if "/foo/bar.txt" contains the text "hello world":
     * const file = await Deno.open("/foo/bar.txt");
     * const buf = new Uint8Array(100);
     * const numberOfBytesRead = await Deno.read(file.rid, buf); // 11 bytes
     * const text = new TextDecoder().decode(buf);  // "hello world"
     * Deno.close(file.rid);
     * ```
     */
    export function read(rid: number, buffer: Uint8Array): Promise<number | null>;

    /** Synchronously write to the resource ID (`rid`) the contents of the array
     * buffer (`data`).
     *
     * Returns the number of bytes written.  This function is one of the lowest
     * level APIs and most users should not work with this directly, but rather use
     * `writeAllSync()` from https://deno.land/std/streams/conversion.ts instead.
     *
     * **It is not guaranteed that the full buffer will be written in a single
     * call.**
     *
     * ```ts
     * const encoder = new TextEncoder();
     * const data = encoder.encode("Hello world");
     * const file = Deno.openSync("/foo/bar.txt", {write: true});
     * const bytesWritten = Deno.writeSync(file.rid, data); // 11
     * Deno.close(file.rid);
     * ```
     */
    export function writeSync(rid: number, data: Uint8Array): number;

    /** Write to the resource ID (`rid`) the contents of the array buffer (`data`).
     *
     * Resolves to the number of bytes written.  This function is one of the lowest
     * level APIs and most users should not work with this directly, but rather use
     * Deno.writeAll() instead.
     *
     * **It is not guaranteed that the full buffer will be written in a single
     * call.**
     *
     * ```ts
     * const encoder = new TextEncoder();
     * const data = encoder.encode("Hello world");
     * const file = await Deno.open("/foo/bar.txt", { write: true });
     * const bytesWritten = await Deno.write(file.rid, data); // 11
     * Deno.close(file.rid);
     * ```
     */
    export function write(rid: number, data: Uint8Array): Promise<number>;

    /** Synchronously seek a resource ID (`rid`) to the given `offset` under mode
     * given by `whence`.  The new position within the resource (bytes from the
     * start) is returned.
     *
     * ```ts
     * const file = Deno.openSync('hello.txt', {read: true, write: true, truncate: true, create: true});
     * Deno.writeSync(file.rid, new TextEncoder().encode("Hello world"));
     *
     * // advance cursor 6 bytes
     * const cursorPosition = Deno.seekSync(file.rid, 6, Deno.SeekMode.Start);
     * console.log(cursorPosition);  // 6
     * const buf = new Uint8Array(100);
     * file.readSync(buf);
     * console.log(new TextDecoder().decode(buf)); // "world"
     * ```
     *
     * The seek modes work as follows:
     *
     * ```ts
     * // Given file.rid pointing to file with "Hello world", which is 11 bytes long:
     * const file = Deno.openSync('hello.txt', {read: true, write: true, truncate: true, create: true});
     * Deno.writeSync(file.rid, new TextEncoder().encode("Hello world"));
     *
     * // Seek 6 bytes from the start of the file
     * console.log(Deno.seekSync(file.rid, 6, Deno.SeekMode.Start)); // "6"
     * // Seek 2 more bytes from the current position
     * console.log(Deno.seekSync(file.rid, 2, Deno.SeekMode.Current)); // "8"
     * // Seek backwards 2 bytes from the end of the file
     * console.log(Deno.seekSync(file.rid, -2, Deno.SeekMode.End)); // "9" (e.g. 11-2)
     * ```
     */
    export function seekSync(
      rid: number,
      offset: number,
      whence: SeekMode,
    ): number;

    /** Seek a resource ID (`rid`) to the given `offset` under mode given by `whence`.
     * The call resolves to the new position within the resource (bytes from the start).
     *
     * ```ts
     * // Given file.rid pointing to file with "Hello world", which is 11 bytes long:
     * const file = await Deno.open('hello.txt', {read: true, write: true, truncate: true, create: true});
     * await Deno.write(file.rid, new TextEncoder().encode("Hello world"));
     *
     * // advance cursor 6 bytes
     * const cursorPosition = await Deno.seek(file.rid, 6, Deno.SeekMode.Start);
     * console.log(cursorPosition);  // 6
     * const buf = new Uint8Array(100);
     * await file.read(buf);
     * console.log(new TextDecoder().decode(buf)); // "world"
     * ```
     *
     * The seek modes work as follows:
     *
     * ```ts
     * // Given file.rid pointing to file with "Hello world", which is 11 bytes long:
     * const file = await Deno.open('hello.txt', {read: true, write: true, truncate: true, create: true});
     * await Deno.write(file.rid, new TextEncoder().encode("Hello world"));
     *
     * // Seek 6 bytes from the start of the file
     * console.log(await Deno.seek(file.rid, 6, Deno.SeekMode.Start)); // "6"
     * // Seek 2 more bytes from the current position
     * console.log(await Deno.seek(file.rid, 2, Deno.SeekMode.Current)); // "8"
     * // Seek backwards 2 bytes from the end of the file
     * console.log(await Deno.seek(file.rid, -2, Deno.SeekMode.End)); // "9" (e.g. 11-2)
     * ```
     */
    export function seek(
      rid: number,
      offset: number,
      whence: SeekMode,
    ): Promise<number>;

    /**
     * Synchronously flushes any pending data and metadata operations of the given file stream to disk.
     *  ```ts
     * const file = Deno.openSync("my_file.txt", { read: true, write: true, create: true });
     * Deno.writeSync(file.rid, new TextEncoder().encode("Hello World"));
     * Deno.ftruncateSync(file.rid, 1);
     * Deno.fsyncSync(file.rid);
     * console.log(new TextDecoder().decode(Deno.readFileSync("my_file.txt"))); // H
     * ```
     */
    export function fsyncSync(rid: number): void;

    /**
     * Flushes any pending data and metadata operations of the given file stream to disk.
     *  ```ts
     * const file = await Deno.open("my_file.txt", { read: true, write: true, create: true });
     * await Deno.write(file.rid, new TextEncoder().encode("Hello World"));
     * await Deno.ftruncate(file.rid, 1);
     * await Deno.fsync(file.rid);
     * console.log(new TextDecoder().decode(await Deno.readFile("my_file.txt"))); // H
     * ```
     */
    export function fsync(rid: number): Promise<void>;

    /*
    * Synchronously flushes any pending data operations of the given file stream to disk.
    *  ```ts
    * const file = Deno.openSync("my_file.txt", { read: true, write: true, create: true });
    * Deno.writeSync(file.rid, new TextEncoder().encode("Hello World"));
    * Deno.fdatasyncSync(file.rid);
    * console.log(new TextDecoder().decode(Deno.readFileSync("my_file.txt"))); // Hello World
    * ```
    */
    export function fdatasyncSync(rid: number): void;

    /**
     * Flushes any pending data operations of the given file stream to disk.
     *  ```ts
     * const file = await Deno.open("my_file.txt", { read: true, write: true, create: true });
     * await Deno.write(file.rid, new TextEncoder().encode("Hello World"));
     * await Deno.fdatasync(file.rid);
     * console.log(new TextDecoder().decode(await Deno.readFile("my_file.txt"))); // Hello World
     * ```
     */
    export function fdatasync(rid: number): Promise<void>;

    /** Close the given resource ID (rid) which has been previously opened, such
     * as via opening or creating a file.  Closing a file when you are finished
     * with it is important to avoid leaking resources.
     *
     * ```ts
     * const file = await Deno.open("my_file.txt");
     * // do work with "file" object
     * Deno.close(file.rid);
     * ````
     */
    export function close(rid: number): void;

    /** The Deno abstraction for reading and writing files. */
    export class File
      implements
        Reader,
        ReaderSync,
        Writer,
        WriterSync,
        Seeker,
        SeekerSync,
        Closer {
      readonly rid: number;
      constructor(rid: number);
      write(p: Uint8Array): Promise<number>;
      writeSync(p: Uint8Array): number;
      truncate(len?: number): Promise<void>;
      truncateSync(len?: number): void;
      read(p: Uint8Array): Promise<number | null>;
      readSync(p: Uint8Array): number | null;
      seek(offset: number, whence: SeekMode): Promise<number>;
      seekSync(offset: number, whence: SeekMode): number;
      stat(): Promise<FileInfo>;
      statSync(): FileInfo;
      close(): void;
    }

    export interface OpenOptions {
      /** Sets the option for read access. This option, when `true`, means that the
       * file should be read-able if opened. */
      read?: boolean;
      /** Sets the option for write access. This option, when `true`, means that
       * the file should be write-able if opened. If the file already exists,
       * any write calls on it will overwrite its contents, by default without
       * truncating it. */
      write?: boolean;
      /** Sets the option for the append mode. This option, when `true`, means that
       * writes will append to a file instead of overwriting previous contents.
       * Note that setting `{ write: true, append: true }` has the same effect as
       * setting only `{ append: true }`. */
      append?: boolean;
      /** Sets the option for truncating a previous file. If a file is
       * successfully opened with this option set it will truncate the file to `0`
       * size if it already exists. The file must be opened with write access
       * for truncate to work. */
      truncate?: boolean;
      /** Sets the option to allow creating a new file, if one doesn't already
       * exist at the specified path. Requires write or append access to be
       * used. */
      create?: boolean;
      /** Defaults to `false`. If set to `true`, no file, directory, or symlink is
       * allowed to exist at the target location. Requires write or append
       * access to be used. When createNew is set to `true`, create and truncate
       * are ignored. */
      createNew?: boolean;
      /** Permissions to use if creating the file (defaults to `0o666`, before
       * the process's umask).
       * Ignored on Windows. */
      mode?: number;
    }

    export interface ReadFileOptions {
      /**
       * An abort signal to allow cancellation of the file read operation.
       * If the signal becomes aborted the readFile operation will be stopped
       * and the promise returned will be rejected with an AbortError.
       */
      signal?: AbortSignal;
    }

    /**
     *  Check if a given resource id (`rid`) is a TTY.
     *
     * ```ts
     * // This example is system and context specific
     * const nonTTYRid = Deno.openSync("my_file.txt").rid;
     * const ttyRid = Deno.openSync("/dev/tty6").rid;
     * console.log(Deno.isatty(nonTTYRid)); // false
     * console.log(Deno.isatty(ttyRid)); // true
     * Deno.close(nonTTYRid);
     * Deno.close(ttyRid);
     * ```
     */
    export function isatty(rid: number): boolean;

    /**
     * - deprecated Use Buffer from https://deno.land/std/io/buffer.ts instead. Deno.Buffer will be removed in Deno 2.0.
     *
     * A variable-sized buffer of bytes with `read()` and `write()` methods.
     *
     * Deno.Buffer is almost always used with some I/O like files and sockets. It
     * allows one to buffer up a download from a socket. Buffer grows and shrinks
     * as necessary.
     *
     * Deno.Buffer is NOT the same thing as Node's Buffer. Node's Buffer was
     * created in 2009 before JavaScript had the concept of ArrayBuffers. It's
     * simply a non-standard ArrayBuffer.
     *
     * ArrayBuffer is a fixed memory allocation. Deno.Buffer is implemented on top
     * of ArrayBuffer.
     *
     * Based on [Go Buffer](https://golang.org/pkg/bytes/#Buffer). */
    export class Buffer implements Reader, ReaderSync, Writer, WriterSync {
      constructor(ab?: ArrayBuffer);
      /** Returns a slice holding the unread portion of the buffer.
       *
       * The slice is valid for use only until the next buffer modification (that
       * is, only until the next call to a method like `read()`, `write()`,
       * `reset()`, or `truncate()`). If `options.copy` is false the slice aliases the buffer content at
       * least until the next buffer modification, so immediate changes to the
       * slice will affect the result of future reads.
       * @param options Defaults to `{ copy: true }`
       */
      bytes(options?: { copy?: boolean }): Uint8Array;
      /** Returns whether the unread portion of the buffer is empty. */
      empty(): boolean;
      /** A read only number of bytes of the unread portion of the buffer. */
      readonly length: number;
      /** The read only capacity of the buffer's underlying byte slice, that is,
       * the total space allocated for the buffer's data. */
      readonly capacity: number;
      /** Discards all but the first `n` unread bytes from the buffer but
       * continues to use the same allocated storage. It throws if `n` is
       * negative or greater than the length of the buffer. */
      truncate(n: number): void;
      /** Resets the buffer to be empty, but it retains the underlying storage for
       * use by future writes. `.reset()` is the same as `.truncate(0)`. */
      reset(): void;
      /** Reads the next `p.length` bytes from the buffer or until the buffer is
       * drained. Returns the number of bytes read. If the buffer has no data to
       * return, the return is EOF (`null`). */
      readSync(p: Uint8Array): number | null;
      /** Reads the next `p.length` bytes from the buffer or until the buffer is
       * drained. Resolves to the number of bytes read. If the buffer has no
       * data to return, resolves to EOF (`null`).
       *
       * NOTE: This methods reads bytes synchronously; it's provided for
       * compatibility with `Reader` interfaces.
       */
      read(p: Uint8Array): Promise<number | null>;
      writeSync(p: Uint8Array): number;
      /** NOTE: This methods writes bytes synchronously; it's provided for
       * compatibility with `Writer` interface. */
      write(p: Uint8Array): Promise<number>;
      /** Grows the buffer's capacity, if necessary, to guarantee space for
       * another `n` bytes. After `.grow(n)`, at least `n` bytes can be written to
       * the buffer without another allocation. If `n` is negative, `.grow()` will
       * throw. If the buffer can't grow it will throw an error.
       *
       * Based on Go Lang's
       * [Buffer.Grow](https://golang.org/pkg/bytes/#Buffer.Grow). */
      grow(n: number): void;
      /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
       * growing the buffer as needed. It resolves to the number of bytes read.
       * If the buffer becomes too large, `.readFrom()` will reject with an error.
       *
       * Based on Go Lang's
       * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
      readFrom(r: Reader): Promise<number>;
      /** Reads data from `r` until EOF (`null`) and appends it to the buffer,
       * growing the buffer as needed. It returns the number of bytes read. If the
       * buffer becomes too large, `.readFromSync()` will throw an error.
       *
       * Based on Go Lang's
       * [Buffer.ReadFrom](https://golang.org/pkg/bytes/#Buffer.ReadFrom). */
      readFromSync(r: ReaderSync): number;
    }

    /**
     * Read Reader `r` until EOF (`null`) and resolve to the content as
     * Uint8Array`.
     *
     * ```ts
     * // Example from stdin
     * const stdinContent = await Deno.readAll(Deno.stdin);
     *
     * // Example from file
     * const file = await Deno.open("my_file.txt", {read: true});
     * const myFileContent = await Deno.readAll(file);
     * Deno.close(file.rid);
     *
     * // Example from buffer
     * const myData = new Uint8Array(100);
     * // ... fill myData array with data
     * const reader = new Deno.Buffer(myData.buffer as ArrayBuffer);
     * const bufferContent = await Deno.readAll(reader);
     * ```
     *
     * - deprecated Use `readAll` from https://deno.land/std/streams/conversion.ts
     * instead. `Deno.readAll` will be removed in Deno 2.0.
     */
    export function readAll(r: Reader): Promise<Uint8Array>;

    /**
     * Synchronously reads Reader `r` until EOF (`null`) and returns the content
     * as `Uint8Array`.
     *
     * ```ts
     * // Example from stdin
     * const stdinContent = Deno.readAllSync(Deno.stdin);
     *
     * // Example from file
     * const file = Deno.openSync("my_file.txt", {read: true});
     * const myFileContent = Deno.readAllSync(file);
     * Deno.close(file.rid);
     *
     * // Example from buffer
     * const myData = new Uint8Array(100);
     * // ... fill myData array with data
     * const reader = new Deno.Buffer(myData.buffer as ArrayBuffer);
     * const bufferContent = Deno.readAllSync(reader);
     * ```
     *
     * - deprecated Use `readAllSync` from
     * https://deno.land/std/streams/conversion.ts instead. `Deno.readAllSync`
     * will be removed in Deno 2.0.
     */
    export function readAllSync(r: ReaderSync): Uint8Array;

    /**
     * Write all the content of the array buffer (`arr`) to the writer (`w`).
     *
     * ```ts
     * // Example writing to stdout
     * const contentBytes = new TextEncoder().encode("Hello World");
     * await Deno.writeAll(Deno.stdout, contentBytes);
     * ```
     *
     * ```ts
     * // Example writing to file
     * const contentBytes = new TextEncoder().encode("Hello World");
     * const file = await Deno.open('test.file', {write: true});
     * await Deno.writeAll(file, contentBytes);
     * Deno.close(file.rid);
     * ```
     *
     * ```ts
     * // Example writing to buffer
     * const contentBytes = new TextEncoder().encode("Hello World");
     * const writer = new Deno.Buffer();
     * await Deno.writeAll(writer, contentBytes);
     * console.log(writer.bytes().length);  // 11
     * ```
     *
     * - deprecated Use `writeAll` from https://deno.land/std/streams/conversion.ts
     * instead. `Deno.writeAll` will be removed in Deno 2.0.
     */
    export function writeAll(w: Writer, arr: Uint8Array): Promise<void>;

    /**
     * Synchronously write all the content of the array buffer (`arr`) to the
     * writer (`w`).
     *
     * ```ts
     * // Example writing to stdout
     * const contentBytes = new TextEncoder().encode("Hello World");
     * Deno.writeAllSync(Deno.stdout, contentBytes);
     * ```
     *
     * ```ts
     * // Example writing to file
     * const contentBytes = new TextEncoder().encode("Hello World");
     * const file = Deno.openSync('test.file', {write: true});
     * Deno.writeAllSync(file, contentBytes);
     * Deno.close(file.rid);
     * ```
     *
     * ```ts
     * // Example writing to buffer
     * const contentBytes = new TextEncoder().encode("Hello World");
     * const writer = new Deno.Buffer();
     * Deno.writeAllSync(writer, contentBytes);
     * console.log(writer.bytes().length);  // 11
     * ```
     *
     * - deprecated Use `writeAllSync` from
     * https://deno.land/std/streams/conversion.ts instead. `Deno.writeAllSync`
     * will be removed in Deno 2.0.
     */
    export function writeAllSync(w: WriterSync, arr: Uint8Array): void;

    export interface MkdirOptions {
      /** Defaults to `false`. If set to `true`, means that any intermediate
       * directories will also be created (as with the shell command `mkdir -p`).
       * Intermediate directories are created with the same permissions.
       * When recursive is set to `true`, succeeds silently (without changing any
       * permissions) if a directory already exists at the path, or if the path
       * is a symlink to an existing directory. */
      recursive?: boolean;
      /** Permissions to use when creating the directory (defaults to `0o777`,
       * before the process's umask).
       * Ignored on Windows. */
      mode?: number;
    }

    /** Synchronously creates a new directory with the specified path.
     *
     * ```ts
     * Deno.mkdirSync("new_dir");
     * Deno.mkdirSync("nested/directories", { recursive: true });
     * Deno.mkdirSync("restricted_access_dir", { mode: 0o700 });
     * ```
     *
     * Defaults to throwing error if the directory already exists.
     *
     * Requires `allow-write` permission. */
    export function mkdirSync(path: string | URL, options?: MkdirOptions): void;

    /** Creates a new directory with the specified path.
     *
     * ```ts
     * await Deno.mkdir("new_dir");
     * await Deno.mkdir("nested/directories", { recursive: true });
     * await Deno.mkdir("restricted_access_dir", { mode: 0o700 });
     * ```
     *
     * Defaults to throwing error if the directory already exists.
     *
     * Requires `allow-write` permission. */
    export function mkdir(
      path: string | URL,
      options?: MkdirOptions,
    ): Promise<void>;

    export interface MakeTempOptions {
      /** Directory where the temporary directory should be created (defaults to
       * the env variable TMPDIR, or the system's default, usually /tmp).
       *
       * Note that if the passed `dir` is relative, the path returned by
       * makeTempFile() and makeTempDir() will also be relative. Be mindful of
       * this when changing working directory. */
      dir?: string;
      /** String that should precede the random portion of the temporary
       * directory's name. */
      prefix?: string;
      /** String that should follow the random portion of the temporary
       * directory's name. */
      suffix?: string;
    }

    /** Synchronously creates a new temporary directory in the default directory
     * for temporary files, unless `dir` is specified. Other optional options
     * include prefixing and suffixing the directory name with `prefix` and
     * `suffix` respectively.
     *
     * The full path to the newly created directory is returned.
     *
     * Multiple programs calling this function simultaneously will create different
     * directories. It is the caller's responsibility to remove the directory when
     * no longer needed.
     *
     * ```ts
     * const tempDirName0 = Deno.makeTempDirSync();  // e.g. /tmp/2894ea76
     * const tempDirName1 = Deno.makeTempDirSync({ prefix: 'my_temp' });  // e.g. /tmp/my_temp339c944d
     * ```
     *
     * Requires `allow-write` permission. */
    // TODO(ry) Doesn't check permissions.
    export function makeTempDirSync(options?: MakeTempOptions): string;

    /** Creates a new temporary directory in the default directory for temporary
     * files, unless `dir` is specified. Other optional options include
     * prefixing and suffixing the directory name with `prefix` and `suffix`
     * respectively.
     *
     * This call resolves to the full path to the newly created directory.
     *
     * Multiple programs calling this function simultaneously will create different
     * directories. It is the caller's responsibility to remove the directory when
     * no longer needed.
     *
     * ```ts
     * const tempDirName0 = await Deno.makeTempDir();  // e.g. /tmp/2894ea76
     * const tempDirName1 = await Deno.makeTempDir({ prefix: 'my_temp' }); // e.g. /tmp/my_temp339c944d
     * ```
     *
     * Requires `allow-write` permission. */
    // TODO(ry) Doesn't check permissions.
    export function makeTempDir(options?: MakeTempOptions): Promise<string>;

    /** Synchronously creates a new temporary file in the default directory for
     * temporary files, unless `dir` is specified.
     * Other optional options include prefixing and suffixing the directory name
     * with `prefix` and `suffix` respectively.
     *
     * The full path to the newly created file is returned.
     *
     * Multiple programs calling this function simultaneously will create different
     * files. It is the caller's responsibility to remove the file when no longer
     * needed.
     *
     * ```ts
     * const tempFileName0 = Deno.makeTempFileSync(); // e.g. /tmp/419e0bf2
     * const tempFileName1 = Deno.makeTempFileSync({ prefix: 'my_temp' });  // e.g. /tmp/my_temp754d3098
     * ```
     *
     * Requires `allow-write` permission. */
    export function makeTempFileSync(options?: MakeTempOptions): string;

    /** Creates a new temporary file in the default directory for temporary
     * files, unless `dir` is specified.  Other
     * optional options include prefixing and suffixing the directory name with
     * `prefix` and `suffix` respectively.
     *
     * This call resolves to the full path to the newly created file.
     *
     * Multiple programs calling this function simultaneously will create different
     * files. It is the caller's responsibility to remove the file when no longer
     * needed.
     *
     * ```ts
     * const tmpFileName0 = await Deno.makeTempFile();  // e.g. /tmp/419e0bf2
     * const tmpFileName1 = await Deno.makeTempFile({ prefix: 'my_temp' });  // e.g. /tmp/my_temp754d3098
     * ```
     *
     * Requires `allow-write` permission. */
    export function makeTempFile(options?: MakeTempOptions): Promise<string>;

    /** Synchronously changes the permission of a specific file/directory of
     * specified path.  Ignores the process's umask.
     *
     * ```ts
     * Deno.chmodSync("/path/to/file", 0o666);
     * ```
     *
     * For a full description, see [chmod](#Deno.chmod)
     *
     * NOTE: This API currently throws on Windows
     *
     * Requires `allow-write` permission. */
    export function chmodSync(path: string | URL, mode: number): void;

    /** Changes the permission of a specific file/directory of specified path.
     * Ignores the process's umask.
     *
     * ```ts
     * await Deno.chmod("/path/to/file", 0o666);
     * ```
     *
     * The mode is a sequence of 3 octal numbers.  The first/left-most number
     * specifies the permissions for the owner.  The second number specifies the
     * permissions for the group. The last/right-most number specifies the
     * permissions for others.  For example, with a mode of 0o764, the owner (7) can
     * read/write/execute, the group (6) can read/write and everyone else (4) can
     * read only.
     *
     * | Number | Description |
     * | ------ | ----------- |
     * | 7      | read, write, and execute |
     * | 6      | read and write |
     * | 5      | read and execute |
     * | 4      | read only |
     * | 3      | write and execute |
     * | 2      | write only |
     * | 1      | execute only |
     * | 0      | no permission |
     *
     * NOTE: This API currently throws on Windows
     *
     * Requires `allow-write` permission. */
    export function chmod(path: string | URL, mode: number): Promise<void>;

    /** Synchronously change owner of a regular file or directory. This functionality
     * is not available on Windows.
     *
     * ```ts
     * Deno.chownSync("myFile.txt", 1000, 1002);
     * ```
     *
     * Requires `allow-write` permission.
     *
     * Throws Error (not implemented) if executed on Windows
     *
     * @param path path to the file
     * @param uid user id (UID) of the new owner, or `null` for no change
     * @param gid group id (GID) of the new owner, or `null` for no change
     */
    export function chownSync(
      path: string | URL,
      uid: number | null,
      gid: number | null,
    ): void;

    /** Change owner of a regular file or directory. This functionality
     * is not available on Windows.
     *
     * ```ts
     * await Deno.chown("myFile.txt", 1000, 1002);
     * ```
     *
     * Requires `allow-write` permission.
     *
     * Throws Error (not implemented) if executed on Windows
     *
     * @param path path to the file
     * @param uid user id (UID) of the new owner, or `null` for no change
     * @param gid group id (GID) of the new owner, or `null` for no change
     */
    export function chown(
      path: string | URL,
      uid: number | null,
      gid: number | null,
    ): Promise<void>;

    export interface RemoveOptions {
      /** Defaults to `false`. If set to `true`, path will be removed even if
       * it's a non-empty directory. */
      recursive?: boolean;
    }

    /** Synchronously removes the named file or directory.
     *
     * ```ts
     * Deno.removeSync("/path/to/empty_dir/or/file");
     * Deno.removeSync("/path/to/populated_dir/or/file", { recursive: true });
     * ```
     *
     * Throws error if permission denied, path not found, or path is a non-empty
     * directory and the `recursive` option isn't set to `true`.
     *
     * Requires `allow-write` permission. */
    export function removeSync(path: string | URL, options?: RemoveOptions): void;

    /** Removes the named file or directory.
     *
     * ```ts
     * await Deno.remove("/path/to/empty_dir/or/file");
     * await Deno.remove("/path/to/populated_dir/or/file", { recursive: true });
     * ```
     *
     * Throws error if permission denied, path not found, or path is a non-empty
     * directory and the `recursive` option isn't set to `true`.
     *
     * Requires `allow-write` permission. */
    export function remove(
      path: string | URL,
      options?: RemoveOptions,
    ): Promise<void>;

    /** Synchronously renames (moves) `oldpath` to `newpath`. Paths may be files or
     * directories.  If `newpath` already exists and is not a directory,
     * `renameSync()` replaces it. OS-specific restrictions may apply when
     * `oldpath` and `newpath` are in different directories.
     *
     * ```ts
     * Deno.renameSync("old/path", "new/path");
     * ```
     *
     * On Unix, this operation does not follow symlinks at either path.
     *
     * It varies between platforms when the operation throws errors, and if so what
     * they are. It's always an error to rename anything to a non-empty directory.
     *
     * Requires `allow-read` and `allow-write` permissions. */
    export function renameSync(
      oldpath: string | URL,
      newpath: string | URL,
    ): void;

    /** Renames (moves) `oldpath` to `newpath`.  Paths may be files or directories.
     * If `newpath` already exists and is not a directory, `rename()` replaces it.
     * OS-specific restrictions may apply when `oldpath` and `newpath` are in
     * different directories.
     *
     * ```ts
     * await Deno.rename("old/path", "new/path");
     * ```
     *
     * On Unix, this operation does not follow symlinks at either path.
     *
     * It varies between platforms when the operation throws errors, and if so what
     * they are. It's always an error to rename anything to a non-empty directory.
     *
     * Requires `allow-read` and `allow-write` permission. */
    export function rename(
      oldpath: string | URL,
      newpath: string | URL,
    ): Promise<void>;

    /** Synchronously reads and returns the entire contents of a file as utf8
     *  encoded string. Reading a directory throws an error.
     *
     * ```ts
     * const data = Deno.readTextFileSync("hello.txt");
     * console.log(data);
     * ```
     *
     * Requires `allow-read` permission. */
    export function readTextFileSync(path: string | URL): string;

    /** Asynchronously reads and returns the entire contents of a file as utf8
     *  encoded string. Reading a directory throws an error.
     *
     * ```ts
     * const data = await Deno.readTextFile("hello.txt");
     * console.log(data);
     * ```
     *
     * Requires `allow-read` permission. */
    export function readTextFile(
      path: string | URL,
      options?: ReadFileOptions,
    ): Promise<string>;

    /** Synchronously reads and returns the entire contents of a file as an array
     * of bytes. `TextDecoder` can be used to transform the bytes to string if
     * required.  Reading a directory returns an empty data array.
     *
     * ```ts
     * const decoder = new TextDecoder("utf-8");
     * const data = Deno.readFileSync("hello.txt");
     * console.log(decoder.decode(data));
     * ```
     *
     * Requires `allow-read` permission. */
    export function readFileSync(path: string | URL): Uint8Array;

    /** Reads and resolves to the entire contents of a file as an array of bytes.
     * `TextDecoder` can be used to transform the bytes to string if required.
     * Reading a directory returns an empty data array.
     *
     * ```ts
     * const decoder = new TextDecoder("utf-8");
     * const data = await Deno.readFile("hello.txt");
     * console.log(decoder.decode(data));
     * ```
     *
     * Requires `allow-read` permission. */
    export function readFile(
      path: string | URL,
      options?: ReadFileOptions,
    ): Promise<Uint8Array>;

    /** A FileInfo describes a file and is returned by `stat`, `lstat`,
     * `statSync`, `lstatSync`. */
    export interface FileInfo {
      /** True if this is info for a regular file. Mutually exclusive to
       * `FileInfo.isDirectory` and `FileInfo.isSymlink`. */
      isFile: boolean;
      /** True if this is info for a regular directory. Mutually exclusive to
       * `FileInfo.isFile` and `FileInfo.isSymlink`. */
      isDirectory: boolean;
      /** True if this is info for a symlink. Mutually exclusive to
       * `FileInfo.isFile` and `FileInfo.isDirectory`. */
      isSymlink: boolean;
      /** The size of the file, in bytes. */
      size: number;
      /** The last modification time of the file. This corresponds to the `mtime`
       * field from `stat` on Linux/Mac OS and `ftLastWriteTime` on Windows. This
       * may not be available on all platforms. */
      mtime: Date | null;
      /** The last access time of the file. This corresponds to the `atime`
       * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
       * be available on all platforms. */
      atime: Date | null;
      /** The creation time of the file. This corresponds to the `birthtime`
       * field from `stat` on Mac/BSD and `ftCreationTime` on Windows. This may
       * not be available on all platforms. */
      birthtime: Date | null;
      /** ID of the device containing the file.
       *
       * _Linux/Mac OS only._ */
      dev: number | null;
      /** Inode number.
       *
       * _Linux/Mac OS only._ */
      ino: number | null;
      /** **UNSTABLE**: Match behavior with Go on Windows for `mode`.
       *
       * The underlying raw `st_mode` bits that contain the standard Unix
       * permissions for this file/directory. */
      mode: number | null;
      /** Number of hard links pointing to this file.
       *
       * _Linux/Mac OS only._ */
      nlink: number | null;
      /** User ID of the owner of this file.
       *
       * _Linux/Mac OS only._ */
      uid: number | null;
      /** Group ID of the owner of this file.
       *
       * _Linux/Mac OS only._ */
      gid: number | null;
      /** Device ID of this file.
       *
       * _Linux/Mac OS only._ */
      rdev: number | null;
      /** Blocksize for filesystem I/O.
       *
       * _Linux/Mac OS only._ */
      blksize: number | null;
      /** Number of blocks allocated to the file, in 512-byte units.
       *
       * _Linux/Mac OS only._ */
      blocks: number | null;
    }

    /** Returns absolute normalized path, with symbolic links resolved.
     *
     * ```ts
     * // e.g. given /home/alice/file.txt and current directory /home/alice
     * Deno.symlinkSync("file.txt", "symlink_file.txt");
     * const realPath = Deno.realPathSync("./file.txt");
     * const realSymLinkPath = Deno.realPathSync("./symlink_file.txt");
     * console.log(realPath);  // outputs "/home/alice/file.txt"
     * console.log(realSymLinkPath);  // outputs "/home/alice/file.txt"
     * ```
     *
     * Requires `allow-read` permission for the target path.
     * Also requires `allow-read` permission for the CWD if the target path is
     * relative. */
    export function realPathSync(path: string | URL): string;

    /** Resolves to the absolute normalized path, with symbolic links resolved.
     *
     * ```ts
     * // e.g. given /home/alice/file.txt and current directory /home/alice
     * await Deno.symlink("file.txt", "symlink_file.txt");
     * const realPath = await Deno.realPath("./file.txt");
     * const realSymLinkPath = await Deno.realPath("./symlink_file.txt");
     * console.log(realPath);  // outputs "/home/alice/file.txt"
     * console.log(realSymLinkPath);  // outputs "/home/alice/file.txt"
     * ```
     *
     * Requires `allow-read` permission for the target path.
     * Also requires `allow-read` permission for the CWD if the target path is
     * relative. */
    export function realPath(path: string | URL): Promise<string>;

    export interface DirEntry {
      name: string;
      isFile: boolean;
      isDirectory: boolean;
      isSymlink: boolean;
    }

    /** Synchronously reads the directory given by `path` and returns an iterable
     * of `Deno.DirEntry`.
     *
     * ```ts
     * for (const dirEntry of Deno.readDirSync("/")) {
     *   console.log(dirEntry.name);
     * }
     * ```
     *
     * Throws error if `path` is not a directory.
     *
     * Requires `allow-read` permission. */
    export function readDirSync(path: string | URL): Iterable<DirEntry>;

    /** Reads the directory given by `path` and returns an async iterable of
     * `Deno.DirEntry`.
     *
     * ```ts
     * for await (const dirEntry of Deno.readDir("/")) {
     *   console.log(dirEntry.name);
     * }
     * ```
     *
     * Throws error if `path` is not a directory.
     *
     * Requires `allow-read` permission. */
    export function readDir(path: string | URL): AsyncIterable<DirEntry>;

    /** Synchronously copies the contents and permissions of one file to another
     * specified path, by default creating a new file if needed, else overwriting.
     * Fails if target path is a directory or is unwritable.
     *
     * ```ts
     * Deno.copyFileSync("from.txt", "to.txt");
     * ```
     *
     * Requires `allow-read` permission on fromPath.
     * Requires `allow-write` permission on toPath. */
    export function copyFileSync(
      fromPath: string | URL,
      toPath: string | URL,
    ): void;

    /** Copies the contents and permissions of one file to another specified path,
     * by default creating a new file if needed, else overwriting. Fails if target
     * path is a directory or is unwritable.
     *
     * ```ts
     * await Deno.copyFile("from.txt", "to.txt");
     * ```
     *
     * Requires `allow-read` permission on fromPath.
     * Requires `allow-write` permission on toPath. */
    export function copyFile(
      fromPath: string | URL,
      toPath: string | URL,
    ): Promise<void>;

    /** Returns the full path destination of the named symbolic link.
     *
     * ```ts
     * Deno.symlinkSync("./test.txt", "./test_link.txt");
     * const target = Deno.readLinkSync("./test_link.txt"); // full path of ./test.txt
     * ```
     *
     * Throws TypeError if called with a hard link
     *
     * Requires `allow-read` permission. */
    export function readLinkSync(path: string | URL): string;

    /** Resolves to the full path destination of the named symbolic link.
     *
     * ```ts
     * await Deno.symlink("./test.txt", "./test_link.txt");
     * const target = await Deno.readLink("./test_link.txt"); // full path of ./test.txt
     * ```
     *
     * Throws TypeError if called with a hard link
     *
     * Requires `allow-read` permission. */
    export function readLink(path: string | URL): Promise<string>;

    /** Resolves to a `Deno.FileInfo` for the specified `path`. If `path` is a
     * symlink, information for the symlink will be returned instead of what it
     * points to.
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const fileInfo = await Deno.lstat("hello.txt");
     * assert(fileInfo.isFile);
     * ```
     *
     * Requires `allow-read` permission. */
    export function lstat(path: string | URL): Promise<FileInfo>;

    /** Synchronously returns a `Deno.FileInfo` for the specified `path`. If
     * `path` is a symlink, information for the symlink will be returned instead of
     * what it points to..
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const fileInfo = Deno.lstatSync("hello.txt");
     * assert(fileInfo.isFile);
     * ```
     *
     * Requires `allow-read` permission. */
    export function lstatSync(path: string | URL): FileInfo;

    /** Resolves to a `Deno.FileInfo` for the specified `path`. Will always
     * follow symlinks.
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const fileInfo = await Deno.stat("hello.txt");
     * assert(fileInfo.isFile);
     * ```
     *
     * Requires `allow-read` permission. */
    export function stat(path: string | URL): Promise<FileInfo>;

    /** Synchronously returns a `Deno.FileInfo` for the specified `path`. Will
     * always follow symlinks.
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const fileInfo = Deno.statSync("hello.txt");
     * assert(fileInfo.isFile);
     * ```
     *
     * Requires `allow-read` permission. */
    export function statSync(path: string | URL): FileInfo;

    /** Options for writing to a file. */
    export interface WriteFileOptions {
      /** Defaults to `false`. If set to `true`, will append to a file instead of
       * overwriting previous contents. */
      append?: boolean;
      /** Sets the option to allow creating a new file, if one doesn't already
       * exist at the specified path (defaults to `true`). */
      create?: boolean;
      /** Permissions always applied to file. */
      mode?: number;
      /**
       * An abort signal to allow cancellation of the file write operation.
       * If the signal becomes aborted the writeFile operation will be stopped
       * and the promise returned will be rejected with an AbortError.
       */
      signal?: AbortSignal;
    }

    /** Synchronously write `data` to the given `path`, by default creating a new
     * file if needed, else overwriting.
     *
     * ```ts
     * const encoder = new TextEncoder();
     * const data = encoder.encode("Hello world\n");
     * Deno.writeFileSync("hello1.txt", data);  // overwrite "hello1.txt" or create it
     * Deno.writeFileSync("hello2.txt", data, {create: false});  // only works if "hello2.txt" exists
     * Deno.writeFileSync("hello3.txt", data, {mode: 0o777});  // set permissions on new file
     * Deno.writeFileSync("hello4.txt", data, {append: true});  // add data to the end of the file
     * ```
     *
     * Requires `allow-write` permission, and `allow-read` if `options.create` is
     * `false`.
     */
    export function writeFileSync(
      path: string | URL,
      data: Uint8Array,
      options?: WriteFileOptions,
    ): void;

    /** Write `data` to the given `path`, by default creating a new file if needed,
     * else overwriting.
     *
     * ```ts
     * const encoder = new TextEncoder();
     * const data = encoder.encode("Hello world\n");
     * await Deno.writeFile("hello1.txt", data);  // overwrite "hello1.txt" or create it
     * await Deno.writeFile("hello2.txt", data, {create: false});  // only works if "hello2.txt" exists
     * await Deno.writeFile("hello3.txt", data, {mode: 0o777});  // set permissions on new file
     * await Deno.writeFile("hello4.txt", data, {append: true});  // add data to the end of the file
     * ```
     *
     * Requires `allow-write` permission, and `allow-read` if `options.create` is `false`.
     */
    export function writeFile(
      path: string | URL,
      data: Uint8Array,
      options?: WriteFileOptions,
    ): Promise<void>;

    /** Synchronously write string `data` to the given `path`, by default creating a new file if needed,
     * else overwriting.
     *
     * ```ts
     * Deno.writeTextFileSync("hello1.txt", "Hello world\n");  // overwrite "hello1.txt" or create it
     * ```
     *
     * Requires `allow-write` permission, and `allow-read` if `options.create` is `false`.
     */
    export function writeTextFileSync(
      path: string | URL,
      data: string,
      options?: WriteFileOptions,
    ): void;

    /** Asynchronously write string `data` to the given `path`, by default creating a new file if needed,
     * else overwriting.
     *
     * ```ts
     * await Deno.writeTextFile("hello1.txt", "Hello world\n");  // overwrite "hello1.txt" or create it
     * ```
     *
     * Requires `allow-write` permission, and `allow-read` if `options.create` is `false`.
     */
    export function writeTextFile(
      path: string | URL,
      data: string,
      options?: WriteFileOptions,
    ): Promise<void>;

    /** Synchronously truncates or extends the specified file, to reach the
     * specified `len`.  If `len` is not specified then the entire file contents
     * are truncated.
     *
     * ```ts
     * // truncate the entire file
     * Deno.truncateSync("my_file.txt");
     *
     * // truncate part of the file
     * const file = Deno.makeTempFileSync();
     * Deno.writeFileSync(file, new TextEncoder().encode("Hello World"));
     * Deno.truncateSync(file, 7);
     * const data = Deno.readFileSync(file);
     * console.log(new TextDecoder().decode(data));
     * ```
     *
     * Requires `allow-write` permission. */
    export function truncateSync(name: string, len?: number): void;

    /** Truncates or extends the specified file, to reach the specified `len`. If
     * `len` is not specified then the entire file contents are truncated.
     *
     * ```ts
     * // truncate the entire file
     * await Deno.truncate("my_file.txt");
     *
     * // truncate part of the file
     * const file = await Deno.makeTempFile();
     * await Deno.writeFile(file, new TextEncoder().encode("Hello World"));
     * await Deno.truncate(file, 7);
     * const data = await Deno.readFile(file);
     * console.log(new TextDecoder().decode(data));  // "Hello W"
     * ```
     *
     * Requires `allow-write` permission. */
    export function truncate(name: string, len?: number): Promise<void>;

    /**
     * Additional information for FsEvent objects with the "other" kind.
     *
     * - "rescan": rescan notices indicate either a lapse in the events or a
     *    change in the filesystem such that events received so far can no longer
     *    be relied on to represent the state of the filesystem now. An
     *    application that simply reacts to file changes may not care about this.
     *    An application that keeps an in-memory representation of the filesystem
     *    will need to care, and will need to refresh that representation directly
     *    from the filesystem.
     */
    export type FsEventFlag = "rescan";

    export interface FsEvent {
      kind: "any" | "access" | "create" | "modify" | "remove" | "other";
      paths: string[];
      flag?: FsEventFlag;
    }

    /**
     * FsWatcher is returned by `Deno.watchFs` function when you start watching
     * the file system. You can iterate over this interface to get the file
     * system events, and also you can stop watching the file system by calling
     * `.close()` method.
     */
    export interface FsWatcher extends AsyncIterable<FsEvent> {
      /** The resource id of the `FsWatcher`. */
      readonly rid: number;
      /** Stops watching the file system and closes the watcher resource. */
      close(): void;
      /**
       * Stops watching the file system and closes the watcher resource.
       *
       * - deprecated Will be removed at 2.0.
       */
      return?(value?: any): Promise<IteratorResult<FsEvent>>;
      [Symbol.asyncIterator](): AsyncIterableIterator<FsEvent>;
    }

    /** Watch for file system events against one or more `paths`, which can be files
     * or directories.  These paths must exist already.  One user action (e.g.
     * `touch test.file`) can  generate multiple file system events.  Likewise,
     * one user action can result in multiple file paths in one event (e.g. `mv
     * old_name.txt new_name.txt`).  Recursive option is `true` by default and,
     * for directories, will watch the specified directory and all sub directories.
     * Note that the exact ordering of the events can vary between operating systems.
     *
     * ```ts
     * const watcher = Deno.watchFs("/");
     * for await (const event of watcher) {
     *    console.log(">>>> event", event);
     *    // { kind: "create", paths: [ "/foo.txt" ] }
     * }
     * ```
     *
     * Requires `allow-read` permission.
     *
     * Call `watcher.close()` to stop watching.
     *
     * ```ts
     * const watcher = Deno.watchFs("/");
     *
     * setTimeout(() => {
     *   watcher.close();
     * }, 5000);
     *
     * for await (const event of watcher) {
     *    console.log(">>>> event", event);
     * }
     * ```
     */
    export function watchFs(
      paths: string | string[],
      options?: { recursive: boolean },
    ): FsWatcher;

    export interface InspectOptions {
      /** Stylize output with ANSI colors. Defaults to false. */
      colors?: boolean;
      /** Try to fit more than one entry of a collection on the same line.
       * Defaults to true. */
      compact?: boolean;
      /** Traversal depth for nested objects. Defaults to 4. */
      depth?: number;
      /** The maximum number of iterable entries to print. Defaults to 100. */
      iterableLimit?: number;
      /** Show a Proxy's target and handler. Defaults to false. */
      showProxy?: boolean;
      /** Sort Object, Set and Map entries by key. Defaults to false. */
      sorted?: boolean;
      /** Add a trailing comma for multiline collections. Defaults to false. */
      trailingComma?: boolean;
      /*** Evaluate the result of calling getters. Defaults to false. */
      getters?: boolean;
      /** Show an object's non-enumerable properties. Defaults to false. */
      showHidden?: boolean;
    }

    /** Converts the input into a string that has the same format as printed by
     * `console.log()`.
     *
     * ```ts
     * const obj = {
     *   a: 10,
     *   b: "hello",
     * };
     * const objAsString = Deno.inspect(obj); // { a: 10, b: "hello" }
     * console.log(obj);  // prints same value as objAsString, e.g. { a: 10, b: "hello" }
     * ```
     *
     * You can also register custom inspect functions, via the symbol `Symbol.for("Deno.customInspect")`,
     * on objects, to control and customize the output.
     *
     * ```ts
     * class A {
     *   x = 10;
     *   y = "hello";
     *   [Symbol.for("Deno.customInspect")](): string {
     *     return "x=" + this.x + ", y=" + this.y;
     *   }
     * }
     *
     * const inStringFormat = Deno.inspect(new A()); // "x=10, y=hello"
     * console.log(inStringFormat);  // prints "x=10, y=hello"
     * ```
     *
     * Finally, you can also specify the depth to which it will format.
     *
     * ```ts
     * Deno.inspect({a: {b: {c: {d: 'hello'}}}}, {depth: 2}); // { a: { b: [Object] } }
     * ```
     */
    export function inspect(value: unknown, options?: InspectOptions): string;



    /**
     * A symbol which can be used as a key for a custom method which will be
     * called when `Deno.inspect()` is called, or when the object is logged to
     * the console.
     *
     * - deprecated This symbol is deprecated since 1.9. Use
     * `Symbol.for("Deno.customInspect")` instead.
     */
    export const customInspect: unique symbol;

    export type SymlinkOptions = {
      type: "file" | "dir";
    };

    /**
     * Creates `newpath` as a symbolic link to `oldpath`.
     *
     * The options.type parameter can be set to `file` or `dir`. This argument is only
     * available on Windows and ignored on other platforms.
     *
     * ```ts
     * Deno.symlinkSync("old/name", "new/name");
     * ```
     *
     * Requires full `allow-read` and `allow-write` permissions. */
    export function symlinkSync(
      oldpath: string | URL,
      newpath: string | URL,
      options?: SymlinkOptions,
    ): void;

    /**
     * Creates `newpath` as a symbolic link to `oldpath`.
     *
     * The options.type parameter can be set to `file` or `dir`. This argument is only
     * available on Windows and ignored on other platforms.
     *
     * ```ts
     * await Deno.symlink("old/name", "new/name");
     * ```
     *
     * Requires full `allow-read` and `allow-write` permissions. */
    export function symlink(
      oldpath: string | URL,
      newpath: string | URL,
      options?: SymlinkOptions,
    ): Promise<void>;

    /**
     * Synchronously truncates or extends the specified file stream, to reach the
     * specified `len`.
     *
     * If `len` is not specified then the entire file contents are truncated as if len was set to 0.
     *
     * if the file previously was larger than this new length, the extra  data  is  lost.
     *
     * if  the  file  previously  was shorter, it is extended, and the extended part reads as null bytes ('\0').
     *
     * ```ts
     * // truncate the entire file
     * const file = Deno.openSync("my_file.txt", { read: true, write: true, truncate: true, create: true });
     * Deno.ftruncateSync(file.rid);
     * ```
     *
     * ```ts
     * // truncate part of the file
     * const file = Deno.openSync("my_file.txt", { read: true, write: true, create: true });
     * Deno.writeSync(file.rid, new TextEncoder().encode("Hello World"));
     * Deno.ftruncateSync(file.rid, 7);
     * Deno.seekSync(file.rid, 0, Deno.SeekMode.Start);
     * const data = new Uint8Array(32);
     * Deno.readSync(file.rid, data);
     * console.log(new TextDecoder().decode(data)); // Hello W
     * ```
     */
    export function ftruncateSync(rid: number, len?: number): void;

    /**
     * Truncates or extends the specified file stream, to reach the specified `len`.
     *
     * If `len` is not specified then the entire file contents are truncated as if len was set to 0.
     *
     * If the file previously was larger than this new length, the extra  data  is  lost.
     *
     * If  the  file  previously  was shorter, it is extended, and the extended part reads as null bytes ('\0').
     *
     * ```ts
     * // truncate the entire file
     * const file = await Deno.open("my_file.txt", { read: true, write: true, create: true });
     * await Deno.ftruncate(file.rid);
     * ```
     *
     * ```ts
     * // truncate part of the file
     * const file = await Deno.open("my_file.txt", { read: true, write: true, create: true });
     * await Deno.write(file.rid, new TextEncoder().encode("Hello World"));
     * await Deno.ftruncate(file.rid, 7);
     * const data = new Uint8Array(32);
     * await Deno.read(file.rid, data);
     * console.log(new TextDecoder().decode(data)); // Hello W
     * ```
     */
    export function ftruncate(rid: number, len?: number): Promise<void>;

    /**
     * Synchronously returns a `Deno.FileInfo` for the given file stream.
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const file = Deno.openSync("file.txt", { read: true });
     * const fileInfo = Deno.fstatSync(file.rid);
     * assert(fileInfo.isFile);
     * ```
     */
    export function fstatSync(rid: number): FileInfo;

    /**
     * Returns a `Deno.FileInfo` for the given file stream.
     *
     * ```ts
     * import { assert } from "https://deno.land/std/testing/asserts.ts";
     * const file = await Deno.open("file.txt", { read: true });
     * const fileInfo = await Deno.fstat(file.rid);
     * assert(fileInfo.isFile);
     * ```
     */
    export function fstat(rid: number): Promise<FileInfo>;

    /** Send a signal to process under given `pid`.
     *
     * If `pid` is negative, the signal will be sent to the process group
     * identified by `pid`.
     *
     *      const p = Deno.run({
     *        cmd: ["sleep", "10000"]
     *      });
     *
     *      Deno.kill(p.pid, "SIGINT");
     *
     * Requires `allow-run` permission. */
    export function kill(pid: number, signo: Signal): void;

  }
}