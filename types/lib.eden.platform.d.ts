declare namespace Eden {
  export namespace os {
    export class Platform {
      triple(): string
      arch(): string
      os(): string
      env(): string
      tier(): string
    }
  }
  
  export const platform: os.Platform
}