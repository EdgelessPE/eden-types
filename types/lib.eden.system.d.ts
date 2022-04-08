declare namespace Eden {


  export namespace os {
    export enum BootPolicy {
      Legacy = "Legacy",
      UEFI = "UEFI",
    }

    export class System {
      refresh(): boolean
      disks(): Disk[]
      processors(): Processor[]
      physicalCoreCount(): number | null
      totalMemory(): number
      freeMemory(): number
      usedMemory(): number
      totalSwap(): number
      freeSwap(): number
      usedSwap(): number
      bootTime(): number
      loadAvg(): [number, number, number]
      kernelVersion(): string | null
      version(): string | null
      hostname(): string | null
      longVersion(): string | null
      bootpolicy(): BootPolicy
    }

    export class Disk {
      type(): number
      name(): string
      fileSystem(): string
      mountPoint(): string
      totalSpace(): number
      availableSpace(): number
      isRemovable(): boolean
      refresh(): boolean
    }

    export class Processor {
      usage(): number
      name(): string
      vendorId(): string
      brand(): string
      frequency(): number
    }

  }
  
  export const system: os.System

}