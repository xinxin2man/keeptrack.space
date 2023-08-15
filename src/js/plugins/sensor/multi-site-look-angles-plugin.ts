import multiSitePng from '@app/img/icons/multi-site.png';
import { GetSatType, SatObject, SensorObject } from '@app/js/interfaces';
import { keepTrackApi, KeepTrackApiMethods } from '@app/js/keepTrackApi';
import { MINUTES_PER_DAY, TAU } from '@app/js/lib/constants';
import { dateFormat } from '@app/js/lib/dateFormat';
import { getEl } from '@app/js/lib/get-el';
import { saveCsv } from '@app/js/lib/saveVariable';
import { showLoading } from '@app/js/lib/showLoading';
import { SatMath } from '@app/js/static/sat-math';
import { TearrData } from '@app/js/static/sensor-math';
import { Degrees, Kilometers, SatelliteRecord, Seconds } from 'ootk';
import { clickDragOptions, KeepTrackPlugin } from '../KeepTrackPlugin';
import { StandardSensorManager } from './sensorManager';
export class MultiSiteLookAnglesPlugin extends KeepTrackPlugin {
  isRequireSatelliteSelected: boolean = true;
  isRequireSensorSelected: boolean = true;

  bottomIconCallback: () => void = () => {
    this.refreshSideMenuData();
  };

  bottomIconElementName = 'multi-site-look-angles-icon';
  bottomIconLabel = 'Multi-Site Looks';
  bottomIconImg = multiSitePng;
  isIconDisabledOnLoad = true;
  isIconDisabled = true;

  dragOptions: clickDragOptions = {
    isDraggable: true,
    minWidth: 350,
    maxWidth: 500,
  };

  helpTitle = `Multi-Site Look Angles Menu`;
  helpBody = keepTrackApi.html`
    The Multi-Site Look Angles menu allows you to calculate the range, azimuth, and elevation angles between a satellite and multiple sensors.
    A satellite must first be selected before the menu can be used.
    <br><br>
    By default the menu will calculate the look angles for all sensors in the Space Surveillance Netowrk.
    If you would like to calculate the look angles for additional sensors, you can export a csv file at the bottom of the menu.
    The csv file will contain look angles for all sensors.
    <br><br>
    Clicking on a row in the table will select the sensor and change the simulation time to the time of the look angle.`;

  static PLUGIN_NAME = 'Multi Site Look Angles';
  constructor() {
    super(MultiSiteLookAnglesPlugin.PLUGIN_NAME);
  }

  sideMenuElementName: string = 'multi-site-look-angles-menu';
  sideMenuElementHtml: string = keepTrackApi.html`
    <div id="${this.sideMenuElementName}" class="side-menu-parent start-hidden text-select">
        <div id="multi-site-look-angles-content" class="side-menu">
        <div class="row">
            <h5 class="center-align">Multi-Sensor Look Angles</h5>
            <div id="multi-site-look-angles-sensor-list">
            </div>
            <table id="multi-site-look-angles-table" class="center-align striped-light centered"></table>
            <br />
            <center>
            <button id="multi-site-look-angles-export" class="btn btn-ui waves-effect waves-light">Export &#9658;</button>
            </center>
        </div>
        </div>
    </div>`;

  addHtml(): void {
    super.addHtml();

    keepTrackApi.register({
      method: KeepTrackApiMethods.uiManagerFinal,
      cbName: this.PLUGIN_NAME,
      cb: () => {
        getEl('multi-site-look-angles-export')?.addEventListener('click', () => {
          const exportData = keepTrackApi.getSensorManager().lastMultiSiteArray.map((look) => ({
            time: look.time,
            sensor: look.name,
            az: look.az.toFixed(2),
            el: look.el.toFixed(2),
            rng: look.rng.toFixed(2),
          }));
          saveCsv(exportData, 'multiSiteLooks');
        });
      },
    });

    keepTrackApi.register({
      method: KeepTrackApiMethods.selectSatData,
      cbName: this.PLUGIN_NAME,
      cb: (sat: SatObject) => {
        if (!this.isMenuButtonEnabled && (!sat?.sccNum || !keepTrackApi.getSensorManager().isSensorSelected())) {
          this.setBottomIconToDisabled();
          this.hideSideMenus();
          return;
        } else {
          this.setBottomIconToEnabled();
          if (this.isMenuButtonEnabled) {
            this.refreshSideMenuData();
          }
        }
      },
    });
  }

  refreshSideMenuData() {
    if (this.isMenuButtonEnabled) {
      if (keepTrackApi.getCatalogManager().selectedSat !== -1) {
        showLoading(() => {
          const catalogManagerInstance = keepTrackApi.getCatalogManager();

          const sensorListDom = getEl('multi-site-look-angles-sensor-list');
          sensorListDom.innerHTML = ''; // TODO: This should be a class property that persists between refreshes

          const allSensors = [];
          const disabledSensors = [];
          for (const sensor of keepTrackApi.getSensorManager().sensorListUS) {
            const sensorButton = document.createElement('button');
            sensorButton.classList.add('btn', 'btn-ui', 'waves-effect', 'waves-light');

            allSensors.push(sensor);

            sensorButton.innerText = sensor.shortName;
            sensorButton.addEventListener('click', () => {
              if (sensorButton.classList.contains('btn-red')) {
                sensorButton.classList.remove('btn-red');
                disabledSensors.splice(disabledSensors.indexOf(sensor), 1);
              } else {
                sensorButton.classList.add('btn-red');
                disabledSensors.push(sensor);
              }

              const sat = catalogManagerInstance.getSat(catalogManagerInstance.selectedSat, GetSatType.EXTRA_ONLY);
              this.getlookanglesMultiSite(
                sat,
                allSensors.filter((s) => !disabledSensors.includes(s))
              );
            });
            sensorListDom.appendChild(sensorButton);
            sensorListDom.appendChild(document.createTextNode(' '));
          }

          const sat = catalogManagerInstance.getSat(catalogManagerInstance.selectedSat, GetSatType.EXTRA_ONLY);
          this.getlookanglesMultiSite(
            sat,
            allSensors.filter((s) => !disabledSensors.includes(s))
          );
        });
      }
    }
  }

  lookanglesLength = 1; // Days
  lookanglesInterval = <Seconds>30;

  public getlookanglesMultiSite(sat: SatObject, sensors?: SensorObject[]): void {
    const timeManagerInstance = keepTrackApi.getTimeManager();
    const sensorManagerInstance = keepTrackApi.getSensorManager();

    if (!sensors) {
      sensors = [];
      for (const sensorName in sensorManagerInstance.sensors) {
        const sensor = sensorManagerInstance.sensors[sensorName];
        sensors.push(sensor);
      }
    }

    const isResetToDefault = !sensorManagerInstance.isSensorSelected();

    // Save Current Sensor as a new array
    const tempSensor = [...sensorManagerInstance.currentSensors];

    const orbitalPeriod = MINUTES_PER_DAY / ((sat.satrec.no * MINUTES_PER_DAY) / TAU); // Seconds in a day divided by mean motion

    const multiSiteArray = <TearrData[]>[];
    for (const sensor of sensors) {
      // Skip if satellite is above the max range of the sensor
      if (sensor.obsmaxrange < sat.perigee && (!sensor.obsmaxrange2 || sensor.obsmaxrange2 < sat.perigee)) continue;

      StandardSensorManager.updateSensorUiStyling([sensor]);
      let offset = 0;
      for (let i = 0; i < this.lookanglesLength * 24 * 60 * 60; i += this.lookanglesInterval) {
        // 5second Looks
        offset = i * 1000; // Offset in seconds (msec * 1000)
        let now = timeManagerInstance.getOffsetTimeObj(offset);
        let multiSitePass = MultiSiteLookAnglesPlugin.propagateMultiSite_(now, sat.satrec, sensor);
        if (multiSitePass.time !== '') {
          multiSiteArray.push(multiSitePass); // Update the table with looks for this 5 second chunk and then increase table counter by 1

          // Jump 3/4th to the next orbit
          i = i + orbitalPeriod * 60 * 0.75; // NOSONAR
        }
      }
    }

    multiSiteArray.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    sensorManagerInstance.lastMultiSiteArray = multiSiteArray;

    isResetToDefault ? sensorManagerInstance.setCurrentSensor(sensorManagerInstance.defaultSensor) : sensorManagerInstance.setCurrentSensor(tempSensor);

    MultiSiteLookAnglesPlugin.populateMultiSiteTable(multiSiteArray);
  }

  private static propagateMultiSite_(now: Date, satrec: SatelliteRecord, sensor: SensorObject): TearrData {
    // Setup Realtime and Offset Time
    const aer = SatMath.getRae(now, satrec, sensor);

    if (SatMath.checkIsInView(sensor, aer)) {
      return {
        time: now.toISOString(),
        el: aer.el,
        az: aer.az,
        rng: aer.rng,
        name: sensor.shortName,
      };
    } else {
      return {
        time: '',
        el: <Degrees>0,
        az: <Degrees>0,
        rng: <Kilometers>0,
        name: '',
      };
    }
  }

  static populateMultiSiteTable(multiSiteArray: TearrData[]) {
    const sensorManagerInstance = keepTrackApi.getSensorManager();

    const tbl = <HTMLTableElement>getEl('multi-site-look-angles-table'); // Identify the table to update
    tbl.innerHTML = ''; // Clear the table from old object data
    let tr = tbl.insertRow();
    let tdT = tr.insertCell();
    tdT.appendChild(document.createTextNode('Time'));
    tdT.setAttribute('style', 'text-decoration: underline');
    let tdE = tr.insertCell();
    tdE.appendChild(document.createTextNode('El'));
    tdE.setAttribute('style', 'text-decoration: underline');
    let tdA = tr.insertCell();
    tdA.appendChild(document.createTextNode('Az'));
    tdA.setAttribute('style', 'text-decoration: underline');
    let tdR = tr.insertCell();
    tdR.appendChild(document.createTextNode('Rng'));
    tdR.setAttribute('style', 'text-decoration: underline');
    let tdS = tr.insertCell();
    tdS.appendChild(document.createTextNode('Sensor'));
    tdS.setAttribute('style', 'text-decoration: underline');

    const timeManagerInstance = keepTrackApi.getTimeManager();
    for (let i = 0; i < multiSiteArray.length; i++) {
      if (sensorManagerInstance.sensorListUS.includes(sensorManagerInstance.sensors[multiSiteArray[i].name])) {
        tr = tbl.insertRow();
        tr.setAttribute('class', 'link');
        tdT = tr.insertCell();
        tdT.appendChild(document.createTextNode(dateFormat(multiSiteArray[i].time, 'isoDateTime', true)));
        tdE = tr.insertCell();
        tdE.appendChild(document.createTextNode(multiSiteArray[i].el.toFixed(1)));
        tdA = tr.insertCell();
        tdA.appendChild(document.createTextNode(multiSiteArray[i].az.toFixed(0)));
        tdR = tr.insertCell();
        tdR.appendChild(document.createTextNode(multiSiteArray[i].rng.toFixed(0)));
        tdS = tr.insertCell();
        tdS.appendChild(document.createTextNode(multiSiteArray[i].name));
        // TODO: Future feature
        tr.addEventListener('click', () => {
          timeManagerInstance.changeStaticOffset(new Date(multiSiteArray[i].time).getTime() - new Date().getTime());
          const sensor = sensorManagerInstance.sensors[multiSiteArray[i].name];
          sensorManagerInstance.setSensor(sensor, sensor.staticNum);
        });
      }
    }
  }
}

export const multiSiteLookAnglesPlugin = new MultiSiteLookAnglesPlugin();
