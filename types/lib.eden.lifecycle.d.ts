declare namespace Eden {
  export namespace Lifecycle {
    export type Events = 
      | "os-startup"
      | "user-drives-sorted"
      | "user-drives-found"
      | "os-init"
      | "user-config-loaded"
      | "os-load-shell"
      | "os-post-shell"
      | "user-before-localboost"
      | "user-before-load"
      | "user-loading"
      | "user-post-load"
      | "os-boot-finished"
  }

  export class Lifecycle {
    register(event: Lifecycle.Events, url: URL | string): Promise<boolean>
    list(event: Lifecycle.Events): Promise<string[]>
    unregister(event: Lifecycle.Events, url: URL | string): Promise<boolean>

    state(): Promise<Lifecycle.Events>
  }

  export const lifecycle: Lifecycle
}