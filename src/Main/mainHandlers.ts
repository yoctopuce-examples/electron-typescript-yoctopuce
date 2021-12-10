//
// This file is generated automatically during the build process
//
// ==================>>>   DO NOT MODIFY IT MANUALLY <<<====================
//
// This content is created by parsing mainAPI.ts and looking for
// method and properties marked with a comment "Safe API:"
//
import { ipcMain } from 'electron';
import { MainAPI } from './mainAPI.js';

type UnsubscribeFn = () => void;
type SensorValueCallback = (serialNumber: string, functionId: string, value: number) => void;
type DeviceArrivalCallback = (serialNumber: string) => void;
type DeviceRemovalCallback = (serialNumber: string) => void;

// Note: the use of "this" below is not a parameter but a type annotation!
function registerIpcHandlers(this: MainAPI): void
{
    //  Retrieve current device list
    ipcMain.handle('invoke-getKnownSerialNumbers', (event: any): Promise<string[]> => {
        return this.getKnownSerialNumbers();
    });
    //  Change the first two leds of any ColorLedCluster found to the specified color
    ipcMain.on('send-setColor', (event: any, rgb: number): void => {
        this.setColor(rgb);
    });
    //  notify new sensor value
    //  notify device arrival
    //  notify device removal
}

export function registerIpcMainHandlers(api: MainAPI): void
{
    (registerIpcHandlers.bind(api))();
}