declare namespace Eden {
  export interface Version {
    readonly deno: string
    readonly v8: string
    readonly eden: string
    readonly edgeless: string
  }

  export const version: Version
}