import { app, BrowserWindow } from 'electron';
import * as fs from 'fs';

import { YAPI, YModule, YErrorMsg, YSensor, YMeasure } from 'yoctolib-esm/yocto_api_nodejs.js';
import { YColorLedCluster } from 'yoctolib-esm/yocto_colorledcluster.js';

export class MainAPI
{
    protected connectedDevices: YModule[] = [];

    // Safe API: Retrieve current device list
    public async getKnownSerialNumbers(): Promise<string[]>
    {
        return Promise.all(this.connectedDevices.map(
            (module: YModule) => module.get_serialNumber()
        ));
    }

    // Safe API: Change the first two leds of any ColorLedCluster found to the specified color
    public setColor(rgb: number): void
    {
        let ledCluster: YColorLedCluster | null = YColorLedCluster.FirstColorLedCluster();
        while(ledCluster) {
            ledCluster.rgb_move(0, 2, rgb, 500);
            ledCluster = ledCluster.nextColorLedCluster();
        }
    }

    protected timedReportCallback = async (sensor: YSensor, measure: YMeasure) =>
    {
        let serialNumber: string = await sensor.get_serialNumber();
        let functionId: string = await sensor.get_functionId();
        let value: number = await measure.get_averageValue();

        // Safe API: notify new sensor value
        this.send('sensorValue', serialNumber, functionId, value);
    }

    protected async deviceArrival(module: YModule)
    {
        let serialNumber: string = await module.get_serialNumber()
        this.connectedDevices.push(module);
        // Register callback for sensor values
        let sensor: YSensor | null = YSensor.FirstSensor();
        while(sensor) {
            if(await sensor.get_serialNumber() == serialNumber) {
                await sensor.set_reportFrequency("60/m");
                await sensor.registerTimedReportCallback(this.timedReportCallback);
            }
            sensor = sensor.nextSensor();
        }
        // Safe API: notify device arrival
        this.send('deviceArrival', serialNumber);
    }

    protected async deviceRemoval(module: YModule)
    {
        let serialNumber: string = await module.get_serialNumber()
        let idx = this.connectedDevices.indexOf(module);
        this.connectedDevices.splice(idx, 1);
        // Unregister callback for sensor values
        let sensor: YSensor | null = YSensor.FirstSensor();
        while(sensor) {
            if(await sensor.get_serialNumber() == serialNumber) {
                await sensor.registerTimedReportCallback(null);
            }
            sensor = sensor.nextSensor();
        }
        // Safe API: notify device removal
        this.send('deviceRemoval', serialNumber);
    }

    protected async handleHotPlug(): Promise<void>
    {
        let errmsg = new YErrorMsg();
        await YAPI.UpdateDeviceList();
        setTimeout(() => this.handleHotPlug(), 500);
    }

    /**
     * Application start/stop API
     */
    public async startBackgroundTasks(): Promise<void>
    {
        // start monitoring Yoctopuce devices
        let errmsg = new YErrorMsg();
        await YAPI.RegisterDeviceArrivalCallback((module: YModule) => this.deviceArrival(module));
        await YAPI.RegisterDeviceRemovalCallback((module: YModule) => this.deviceRemoval(module));
        await YAPI.PreregisterHub('127.0.0.1', errmsg);
        this.handleHotPlug();
    }

    public async stopBackgroundTasks(): Promise<void>
    {
        await YAPI.FreeAPI();
    }

    public restartUI(): void
    {
        for(let bw of BrowserWindow.getAllWindows()) {
            bw.webContents.reloadIgnoringCache();
        }
    }

    // Internal IPC helper: emit an event to any renderer process
    send(channel: string, ...args: any[]): void
    {
        for(let bw of BrowserWindow.getAllWindows()) {
            bw.webContents.send(channel, ...args);
        }
    }
}

export const mainAPI: MainAPI = new MainAPI();
