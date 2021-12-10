//
// This file is generated automatically during the build process
//
// ==================>>>   DO NOT MODIFY IT MANUALLY <<<====================
//
// This content is created by parsing mainAPI.ts and looking for
// method and properties marked with a comment "Safe API:"
//
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { PreloadAPI, UnsubscribeFn, SensorValueCallback, DeviceArrivalCallback, DeviceRemovalCallback } from './preloadAPI.js';

const preloadAPI: PreloadAPI = {
    //  Retrieve current device list
    getKnownSerialNumbers: ((): Promise<string[]> => {
        return ipcRenderer.invoke('invoke-getKnownSerialNumbers');
    }),
    //  Change the first two leds of any ColorLedCluster found to the specified color
    setColor: ((rgb: number): void => {
        ipcRenderer.send('send-setColor',rgb);
    }),
    //  notify new sensor value
    registerSensorValueCallback: ((sensorValueCallback: SensorValueCallback): UnsubscribeFn => {
        let subscription = (event: IpcRendererEvent, serialNumber: string, functionId: string, value: number) => { sensorValueCallback(serialNumber, functionId, value); };
        let unsubscribe = () => { ipcRenderer.removeListener('sensorValue', subscription); };
        ipcRenderer.on('sensorValue', subscription);
        return unsubscribe;
    }),
    //  notify device arrival
    registerDeviceArrivalCallback: ((deviceArrivalCallback: DeviceArrivalCallback): UnsubscribeFn => {
        let subscription = (event: IpcRendererEvent, serialNumber: string) => { deviceArrivalCallback(serialNumber); };
        let unsubscribe = () => { ipcRenderer.removeListener('deviceArrival', subscription); };
        ipcRenderer.on('deviceArrival', subscription);
        return unsubscribe;
    }),
    //  notify device removal
    registerDeviceRemovalCallback: ((deviceRemovalCallback: DeviceRemovalCallback): UnsubscribeFn => {
        let subscription = (event: IpcRendererEvent, serialNumber: string) => { deviceRemovalCallback(serialNumber); };
        let unsubscribe = () => { ipcRenderer.removeListener('deviceRemoval', subscription); };
        ipcRenderer.on('deviceRemoval', subscription);
        return unsubscribe;
    })
};

contextBridge.exposeInMainWorld('preloadAPI', preloadAPI);