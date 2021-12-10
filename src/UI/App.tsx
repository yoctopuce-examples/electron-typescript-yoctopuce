import { h, render, Component, ComponentChild, RefObject, createRef } from 'preact';
import { preloadAPI, UnsubscribeFn } from './preloadAPI.js';

import tempIcon from './icons/temp_96.png';
import humIcon from './icons/hum_96.png';
import cloudIcon from './icons/cloud_96.png';
import './App.css';

interface AppProps {
    title: string;
}

interface AppState {
    serialNumbers: string[];
    noYoctoColor: boolean;
    temperature: string,
    humidity: string,
    pressure: string
}

class App extends Component<AppProps, AppState>
{
    state: AppState = {
        serialNumbers: [],
        noYoctoColor: true,
        temperature: '(offline)',
        humidity: '(offline)',
        pressure: '(offline)'
    };
    unsubscribes: UnsubscribeFn[] = [];

    setColor(rgb: number) {
        preloadAPI.setColor(rgb);
    }

    async checkDevices(): Promise<void> {
        let serials: string[] = await preloadAPI.getKnownSerialNumbers();
        this.setState({
            serialNumbers: serials,
            noYoctoColor: (','+serials.join(',')).indexOf(',YRGBLED2') < 0,
        });
    }

    sensorCallback = (serialNumber: string, functionId: string, value: number) =>
    {
        if(functionId == 'temperature') this.setState({ temperature: value.toString() });
        if(functionId == 'humidity') this.setState({ humidity: value.toString() });
        if(functionId == 'pressure') this.setState({ pressure: value.toString() });
    }

    async componentDidMount(): Promise<void> {
        await this.checkDevices();
        this.unsubscribes.push(preloadAPI.registerDeviceArrivalCallback((serial: string) => this.checkDevices()));
        this.unsubscribes.push(preloadAPI.registerDeviceRemovalCallback((serial: string) => this.checkDevices()));
        this.unsubscribes.push(preloadAPI.registerSensorValueCallback(this.sensorCallback));
    }

    async componentDidUnmount(): Promise<void> {
        while(this.unsubscribes.length > 0) {
            (this.unsubscribes.pop() as UnsubscribeFn)();
        }
    }

    render(): ComponentChild
    {
        document.title = this.props.title;
        return <div>
            <h1>{this.props.title}</h1>
            <h2 class="section_title">Module inventory:</h2>
            <div class="section">
                <ul id="module_list">
                    { this.state.serialNumbers.map((serial: string) => <li>{serial}</li>) }
                </ul>
            </div>
            <h2 class="section_title">Yocto-Color-V2:</h2>
            { (this.state.noYoctoColor ?
                <div class="section">Plug a Yocto-Color-V2 to see that part of the demo...</div> :
                <div class="section">
                    <button id="red" onClick={()=>this.setColor(0xff0000)}>Red</button>
                    <button id="green" onClick={()=>this.setColor(0xff00)}>Green</button>
                    <button id="blue" onClick={()=>this.setColor(0xff)}>Blue</button>
                    <button id="off" onClick={()=>this.setColor(0)}>Off</button>
                </div> )
            }
            <h2 class="section_title">Yocto-Meteo:</h2>
            <div class="section">
                <table>
                    <tr class="element">
                        <td class="icon"><img src={tempIcon} alt="Temperature"/></td>
                        <td>{this.state.temperature}</td>
                        <td class="icon"><img src={humIcon} alt="Humidity"/></td>
                        <td>{this.state.humidity}</td>
                        <td class="icon"><img src={cloudIcon} alt="Pressure"/></td>
                        <td>{this.state.pressure}</td>
                    </tr>
                </table>
            </div>
        </div>;
    }
}

render(<App title="Yoctopuce Demo Application" />, document.body);
