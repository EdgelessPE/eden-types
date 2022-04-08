// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// Copyright 2020-2022 Edgeless Team. All rights reserved.

declare namespace Eden {
  export type PermissionDescriptor = 
    | RunPermissionDescriptor
    | ReadPermissionDescriptor
    | WritePermissionDescriptor
    | EnvPermissionDescriptor
    | QueryPackagesPermissionDescriptor
    | LoadPackagesPermissionDescriptor
    | SystemCtlPermissionDescriptor
    | LifecycleHookPermissionDescriptor
    | QueryPackagesPermissionDescriptor
    | LogPermissionDescriptor
    | DynamicMsgboxPermissionDescriptor
    | DynamicTipPermissionDescriptor
    | NetPermissionDescriptor

  export interface RunPermissionDescriptor {
    command?: string | URL
    name: "run"
  }

  export interface ReadPermissionDescriptor {
    path?: string | URL
    name: "read"
  }

  export interface WritePermissionDescriptor {
    path?: string | URL
    name: "write"
  }

  export interface EnvPermissionDescriptor {
    variable?: string
    name: "env"
  }

  export interface QuerySystemInfoPermissionDescriptor {
    name: "query-system-info"
  }

  export interface LoadPackagesPermissionDescriptor {
    name: "load-packages"
  }

  export interface SystemCtlPermissionDescriptor {
    name: "system-ctl"
  }

  export interface LifecycleHookPermissionDescriptor {
    path?: string | URL
    name: "lifecycle-hook"
  }

  export interface QueryPackagesPermissionDescriptor {
    name: "query-packages"
  }

  export interface LogPermissionDescriptor {
    name: "log"
  }

  export interface DynamicTipPermissionDescriptor {
    name: "dynamic-tip"
  }

  export interface DynamicMsgboxPermissionDescriptor {
    name: "dynamic-msgbox"
  }
  
  export interface NetPermissionDescriptor {
    host?: string
    name: "net"
  }

  type PermissionState = "granted" | "denied" | "prompt"

  export interface PermissionStatusEventMap {
    "change": Event;
  }

  export interface PermissionStatus extends EventTarget {
      onchange: ((this: PermissionStatus, ev: Event) => any) | null;
      readonly state: PermissionState;
      addEventListener<K extends keyof PermissionStatusEventMap>(type: K, listener: (this: PermissionStatus, ev: PermissionStatusEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
      removeEventListener<K extends keyof PermissionStatusEventMap>(type: K, listener: (this: PermissionStatus, ev: PermissionStatusEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }

  export var PermissionStatus: {
    prototype: PermissionStatus;
    new(): PermissionStatus;
  }

  export class Permission {
    query(descriptor: PermissionDescriptor): Promise<PermissionStatus>
    request(descriptor: PermissionDescriptor): Promise<PermissionStatus>
    revoke(descriptor: PermissionDescriptor): Promise<PermissionStatus>
  }

  export const permission: Permission

  
}