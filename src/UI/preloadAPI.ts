//
// This file is generated automatically during the build process
//
// ==================>>>   DO NOT MODIFY IT MANUALLY <<<====================
//
// This content is created by parsing mainAPI.ts and looking for
// method and properties marked with a comment "Safe API:"
//
export type UnsubscribeFn = () => void;
export type SensorValueCallback = (serialNumber: string, functionId: string, value: number) => void;
export type DeviceArrivalCallback = (serialNumber: string) => void;
export type DeviceRemovalCallback = (serialNumber: string) => void;

export interface PreloadAPI {
    //  Retrieve current device list
    getKnownSerialNumbers(): Promise<string[]>,
    //  Change the first two leds of any ColorLedCluster found to the specified color
    setColor(rgb: number): void,
    //  notify new sensor value
    registerSensorValueCallback(sensorValueCallback: SensorValueCallback): UnsubscribeFn,
    //  notify device arrival
    registerDeviceArrivalCallback(deviceArrivalCallback: DeviceArrivalCallback): UnsubscribeFn,
    //  notify device removal
    registerDeviceRemovalCallback(deviceRemovalCallback: DeviceRemovalCallback): UnsubscribeFn
}

export const preloadAPI = (window as any)?.preloadAPI as PreloadAPI;