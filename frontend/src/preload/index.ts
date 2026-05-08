import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  saveCoords: (coords) => ipcRenderer.invoke('save-coords', coords),
  runCoords: () => ipcRenderer.invoke('run-coords'),
  allCoords: () => ipcRenderer.invoke('all-coords'),
  delCoord: (coordID) => ipcRenderer.invoke('del-coord', coordID)
}
contextBridge.exposeInMainWorld('api', api) // windows.api avail

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
