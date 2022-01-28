declare namespace Eden {
  export namespace Plugin {
    export class Script {}

    export type PackageOptions = PackageBaseOptions;

    export interface PackageBaseOptions {
      name: string;
      type: PackageType;
      version: string;
      authors: string[];
      compat?: string[];
      tested: string[];
      license: string;
    }
    
    export enum PackageType {
      Software = "Software",
      Driver = "Driver",
      Manifest = "Manifest",
      Dependency = "Dependency",
      Theme = "Theme"
    }
    
    export interface PackageLoadOptions {
      readonly userPolt?: string;
      readonly dest: string;
      readonly localboost: boolean;
      readonly type: PackageType;
    }

    export interface ExecuteContext {
      readonly env: System.Env;
      readonly bootstrap: System.BoostrapData;
      readonly package: PackageOptions;
      readonly opts: PackageLoadOptions;
      readonly utils: typeof Utils;
    }

    export type HandlerFn<T extends ([unknown] | unknown[]) = [], R = unknown> = (ctx: ExecuteContext, ...args: T[]) => Promise<R>

    export function useEntry(f: HandlerFn): void;

    export function useReady(f: HandlerFn): void;
  }

  export namespace System {
    export interface Env extends Iterable<[string, string]> {
      get(name: string): string;
      set(name: string, val: string): void;
      keys(): Iterable<string>;
      values(): Iterable<string>;
      entires(): Iterable<[string, string]>;
      globalSet(name: string, val: string): void;
      [Symbol.iterator](): Iterator<[string, string]>;
    }

    export enum BootPolicy {
      Legacy = "Legacy",
      UEFI = "UEFI",
    }
    
    export interface BoostrapData {
      drive?: string;
      drives: string[];
      location: string;
      desktop: string;
      version: string;
      bootPolicy: BootPolicy;
    }
  }

  export namespace Utils {
    export namespace fs {
      export function exist(path: string): Promise<boolean>;

      export interface Stat {
        isFile(): boolean;
        isDirectory(): boolean;
        name: string;
      }

      export function stat(path: string): Promise<Stat>;
    }

    export namespace auto {
      export function isAlive(name: string): Promise<boolean>;
      export function isVisible(name: string): Promise<boolean>
    }
  }

  export const fs: typeof Utils.fs;
  export const auto: typeof Utils.auto;
}

const { Plugin } = Eden