/* eslint-disable @typescript-eslint/no-explicit-any */
import { SettingsManager } from '@app/settings/settings';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface JQuery<HTMLElement> {
  effect: any;
}

interface HTMLDivElement {
  addClass: (classStr: string) => void;
  removeClass: (classStr: string) => void;
  hide: () => void;
  on: (type: string, cb: any) => void;
  off: (type?: string, cb?: any) => void;
  scrollTop: (y?: number) => number;
  draggable: (options: any) => void;
  css: any;
  text: any;
  show: any;
  effect: any;
  is: any;
}

declare global {
  module '*.css';
  module '*.jpg';
  module '*.png';
  module '*.svg';
  declare module '*.mp3';
  declare module '*.wav';
  declare module '*.flac';
  interface Window {
    settingsManager: SettingsManager;
    settingsOverride: any;
  }
  interface Global {
    settingsManager: SettingsManager;
    settingsOverride: any;
  }
  let settingsManager: SettingsManager;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQuery<HTMLElement> {
    datapicker: any;
    datepicker: any;
  }
}

interface JQueryStatic {
  colorbox: any;
}
