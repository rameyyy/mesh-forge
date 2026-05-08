import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveCoords: (coords: { x: number; y: number; z: number }) => Promise<any>
      runCoords: () => Promise<any>
      allCoords: () => Promise<any>
      delCoord: (coordID: number) => Promise<any>
    }
  }
}