import { keepTrackApi } from '@app/js/api/keepTrackApi';
import { SatObject } from '@app/js/api/keepTrackTypes';
import { SpaceObjectType } from '@app/js/api/SpaceObjectType';
import { MINUTES_PER_DAY, RAD2DEG } from '@app/js/lib/constants';
import { SunCalc } from '@app/js/lib/suncalc.js';
import $ from 'jquery';
import './satInfoboxCore.css';

const satInfoboxCore = {
  sensorInfo: {
    isLoaded: false,
  },
  launchData: {
    isLoaded: false,
  },
  orbitalData: {
    isLoaded: false,
  },
  secondaryData: {
    isLoaded: false,
  },
  satMissionData: {
    isLoaded: false,
  },
  intelData: {
    isLoaded: false,
  },
};

export const sensorInfo = (sat: SatObject): void => {
  if (sat === null || typeof sat === 'undefined') return;

  if (!satInfoboxCore.sensorInfo.isLoaded && settingsManager.plugins.sensor) {
    document.getElementById('sat-infobox').innerHTML += keepTrackApi.html`
        <div id="sensor-sat-info">
        <div class="sat-info-section-header">Sensor Data</div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Distance from the Sensor">
              Range
            </div>
            <div class="sat-info-value" id="sat-range">xxxx km</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Angle (Left/Right) from the Sensor">
              Azimuth
            </div>
            <div class="sat-info-value" id="sat-azimuth">XX deg</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Angle (Up/Down) from the Sensor">
              Elevation
            </div>
            <div class="sat-info-value" id="sat-elevation">XX deg</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Linear Width at Target's Range">
              Beam Width
            </div>
            <div class="sat-info-value" id="sat-beamwidth">xxxx km</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Time for RF/Light to Reach Target">
              Max Tmx Time
            </div>
            <div class="sat-info-value" id="sat-maxTmx">xxxx ms</div>
          </div>
          <div class="sat-info-row sat-only-info">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Is the Sun Affected the Sensor">
              Sun
            </div>
            <div class="sat-info-value" id="sat-sun">Sun Stuff</div>
          </div>
          <div id="sat-info-nextpass-row" class="sat-info-row sat-only-info">
            <div id="sat-info-nextpass" class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Next Time in Coverage">
              Next Pass
            </div>
            <div id="sat-nextpass" class="sat-info-value">00:00:00z</div>
          </div>
        </div> 
        `;
    satInfoboxCore.sensorInfo.isLoaded = true;
  }

  // If we are using the sensor manager plugin then we should hide the sensor to satellite
  // info when there is no sensor selected
  if (settingsManager.plugins.sensor) {
    if (keepTrackApi.programs.sensorManager.checkSensorSelected()) {
      document.getElementById('sensor-sat-info').style.display = 'block';
    } else {
      document.getElementById('sensor-sat-info').style.display = 'none';
    }
  }

  if (!sat.missile) {
    (<HTMLElement>document.querySelector('.sat-only-info')).style.display = 'block';
  } else {
    (<HTMLElement>document.querySelector('.sat-only-info')).style.display = 'none';
  }
};
export const launchData = (sat: SatObject): void => {
  if (sat === null || typeof sat === 'undefined') return;

  if (!satInfoboxCore.launchData.isLoaded) {
    document.getElementById('sat-infobox').innerHTML += keepTrackApi.html`
          <div class="sat-info-section-header">Object Data</div>
          <div class="sat-info-row">
            <div class="sat-info-key">Type</div>
            <div class="sat-info-value" id="sat-type">PAYLOAD</div>
          </div>
          <div class="sat-info-row sat-only-info">
            <div class="sat-info-key">Country</div>
            <div class="sat-info-value" id="sat-country">COUNTRY</div>
          </div>
          <div class="sat-info-row" id="sat-site-row">
            <div class="sat-info-key">Site</div>
            <div class="sat-info-value" id="sat-site">SITE</div>
            </div>
          <div class="sat-info-row">
            <div class="sat-info-key"></div>
            <div class="sat-info-value" id="sat-sitec">LAUNCH COUNTRY</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key">Rocket</div>
            <div class="sat-info-value" id="sat-vehicle">VEHICLE</div>
          </div>
          <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Configuration of the Rocket">
            Configuration
          </div>
          <div class="sat-info-value" id="sat-configuration">
            NO DATA
          </div>
        </div>
          <div class="sat-info-row sat-only-info">
            <div class="sat-info-key">RCS</div>
            <div class="sat-info-value" id="sat-rcs">NO DATA</div>
          </div>  
        `;
    satInfoboxCore.launchData.isLoaded = true;
  }

  // /////////////////////////////////////////////////////////////////////////
  // Country Correlation Table
  // /////////////////////////////////////////////////////////////////////////
  const country = keepTrackApi.programs.objectManager.extractCountry(sat.country);
  document.getElementById('sat-country').innerHTML = country;

  // /////////////////////////////////////////////////////////////////////////
  // Launch Site Correlation Table
  // /////////////////////////////////////////////////////////////////////////
  let siteArr = [];
  let site = {} as any;
  let missileLV: any;
  let missileOrigin: any;
  let satLvString: any;
  if (sat.missile) {
    siteArr = sat.desc.split('(');
    missileOrigin = siteArr[0].substr(0, siteArr[0].length - 1);
    missileLV = sat.desc.split('(')[1].split(')')[0]; // Remove the () from the booster type

    site.site = missileOrigin;
    site.sitec = sat.country;
  } else {
    site = keepTrackApi.programs.objectManager.extractLaunchSite(sat.launchSite);
  }

  document.getElementById('sat-site').innerHTML = site.site;
  document.getElementById('sat-sitec').innerHTML = site.sitec;

  // /////////////////////////////////////////////////////////////////////////
  // Launch Vehicle Correlation Table
  // /////////////////////////////////////////////////////////////////////////
  if (sat.missile) {
    sat.launchVehicle = missileLV;
    document.getElementById('sat-vehicle').innerHTML = sat.launchVehicle;
  } else {
    document.getElementById('sat-vehicle').innerHTML = sat.launchVehicle; // Set to JSON record
    if (sat.launchVehicle === 'U') {
      document.getElementById('sat-vehicle').innerHTML = 'Unknown';
    } // Replace with Unknown if necessary
    satLvString = keepTrackApi.programs.objectManager.extractLiftVehicle(sat.launchVehicle); // Replace with link if available
    document.getElementById('sat-vehicle').innerHTML = satLvString;
  }

  document.getElementById('sat-configuration').innerHTML = sat.configuration !== '' ? sat.configuration : 'Unknown';

  $('a.iframe').colorbox({
    iframe: true,
    width: '80%',
    height: '80%',
    fastIframe: false,
    closeButton: false,
  });
};
export const nearObjectsLinkClick = (distance: number = 100): void => {
  const { uiManager, satSet, objectManager } = keepTrackApi.programs;
  if (objectManager.selectedSat === -1) {
    return;
  }
  const sat = objectManager.selectedSat;
  const SCCs = [];
  let pos = satSet.getSatPosOnly(sat).position;
  const posXmin = pos.x - distance;
  const posXmax = pos.x + distance;
  const posYmin = pos.y - distance;
  const posYmax = pos.y + distance;
  const posZmin = pos.z - distance;
  const posZmax = pos.z + distance;
  (<HTMLInputElement>document.getElementById('search')).value = '';
  for (let i = 0; i < satSet.numSats; i++) {
    pos = satSet.getSatPosOnly(i).position;
    if (pos.x < posXmax && pos.x > posXmin && pos.y < posYmax && pos.y > posYmin && pos.z < posZmax && pos.z > posZmin) {
      SCCs.push(satSet.getSatExtraOnly(i).sccNum);
    }
  }

  for (let i = 0; i < SCCs.length; i++) {
    (<HTMLInputElement>document.getElementById('search')).value += i < SCCs.length - 1 ? SCCs[i] + ',' : SCCs[i];
  }

  uiManager.doSearch((<HTMLInputElement>document.getElementById('search')).value.toString());
};
export const nearOrbitsLink = () => {
  const { satSet, searchBox, satellite } = keepTrackApi.programs;
  const searchStr = searchBox.doArraySearch(satellite.findNearbyObjectsByOrbit(satSet.getSat(keepTrackApi.programs.objectManager.selectedSat)));
  searchBox.doSearch(searchStr, false);
};
export const allObjectsLink = (): void => {
  const { uiManager, satSet, objectManager } = keepTrackApi.programs;
  if (objectManager.selectedSat === -1) {
    return;
  }
  const intldes = satSet.getSatExtraOnly(objectManager.selectedSat).intlDes;
  const searchStr = intldes.slice(0, 8);
  uiManager.doSearch(searchStr);
  (<HTMLInputElement>document.getElementById('search')).value = searchStr;
};
export const orbitalData = (sat: SatObject): void => {
  // NOSONAR
  // Only show orbital data if it is available
  if (sat === null || typeof sat === 'undefined') return;

  if (!satInfoboxCore.orbitalData.isLoaded) {
    document.getElementById('ui-wrapper').innerHTML += keepTrackApi.html`
          <div id="sat-infobox" class="text-select satinfo-fixed">
            <div id="sat-info-top-links">
              <div id="sat-info-title" class="center-text sat-info-section-header sat-info-title-header">This is a title</div>
              <div id="all-objects-link" class="link sat-infobox-links sat-only-info">Find all objects from this launch...</div>
              <div id="near-orbits-link" class="link sat-infobox-links sat-only-info">Find all objects near this orbit...</div>
              <div id="near-objects-link1" class="link sat-infobox-links">Find all objects within 100km...</div>
              <div id="near-objects-link2" class="link sat-infobox-links">Find all objects within 200km...</div>
              <div id="near-objects-link4" class="link sat-infobox-links">Find all objects within 400km...</div>
              <div id="sun-angle-link" class="link sat-infobox-links">Draw sat to sun line...</div>
              <div id="nadir-angle-link" class="link sat-infobox-links">Draw sat to nadir line...</div>
              <div id="sec-angle-link" class="link sat-infobox-links">Draw sat to second sat line...</div>
            </div>
            <div class="sat-info-section-header">Identifiers</div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key">COSPAR</div>
              <div class="sat-info-value" id="sat-intl-des">xxxx-xxxA</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key">NORAD</div>
              <div class="sat-info-value" id="sat-objnum">99999</div>
            </div>          
            <div class="sat-info-section-header">Orbit Data</div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key tooltipped" data-position="left" data-delay="50"
                data-tooltip="Highest Point in the Orbit">
                Apogee
              </div>
              <div class="sat-info-value" id="sat-apogee">xxx km</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key tooltipped" data-position="left" data-delay="50"
                data-tooltip="Lowest Point in the Orbit">
                Perigee
              </div>
              <div class="sat-info-value" id="sat-perigee">xxx km</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key tooltipped" data-position="left" data-delay="50"
                data-tooltip="Angle Measured from Equator on the Ascending Node">
                Inclination
              </div>
              <div class="sat-info-value" id="sat-inclination">xxx.xx</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="How Circular the Orbit Is (0 is a Circle)">
                Eccentricity
              </div>
              <div class="sat-info-value" id="sat-eccentricity">x.xx</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Where it Rises Above the Equator">
                Right Asc.
              </div>
              <div class="sat-info-value" id="sat-raan">x.xx</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Where the Lowest Part of the Orbit Is">
                Arg of Perigee
              </div>
              <div class="sat-info-value" id="sat-argPe">x.xx</div>
            </div>
            <div class="sat-info-row">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Current Latitude Over Earth">
                Latitude
              </div>
              <div class="sat-info-value" id="sat-latitude">x.xx</div>
            </div>
            <div class="sat-info-row">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Current Longitude Over Earth">
                Longitude
              </div>
              <div class="sat-info-value" id="sat-longitude">x.xx</div>
            </div>
            <div class="sat-info-row">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Current Altitude Above Sea Level">
                Altitude
              </div>
              <div class="sat-info-value" id="sat-altitude">xxx km</div>
            </div> 
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Time for One Complete Revolution Around Earth">
                Period
              </div>
              <div class="sat-info-value" id="sat-period">xxx min</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Current Velocity of the Satellite (Higher the Closer to Earth it Is)">
                Velocity
              </div>
              <div class="sat-info-value" id="sat-velocity">xxx km/s</div>
            </div>
            <div class="sat-info-row sat-only-info">
              <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
                data-tooltip="Time Since Official Orbit Calculated (Older ELSETs are Less Accuarate Usually)">
                Age of ELSET
              </div>
              <div class="sat-info-value" id="sat-elset-age">xxx.xxxx</div>
            </div>
          </div>
        `;

    // Create a Sat Info Box Initializing Script
    $('#sat-infobox').draggable({
      containment: 'window',
      drag: () => {
        $('#sat-infobox').height(600);
        document.getElementById('sat-infobox').classList.remove('satinfo-fixed');
      },
    });

    // If right click kill and reinit
    $('#sat-infobox').on('mousedown', (e: any) => {
      if (e.button === 2) {
        $('#sat-infobox').removeClass().removeAttr('style');
        document.getElementById('sat-infobox').classList.add('satinfo-fixed');
      }
    });

    satInfoboxCore.orbitalData.isLoaded = true;

    // Give the DOM time load and then redo
    setTimeout(() => {
      orbitalData(sat);
    }, 500);
    return;
  }

  if (!sat.missile) {
    try {
      $('a.iframe').colorbox({
        iframe: true,
        width: '80%',
        height: '80%',
        fastIframe: false,
        closeButton: false,
      });
    } catch (error) {
      // Intentionally left blank
    }

    document.getElementById('sat-apogee').innerHTML = sat.apogee.toFixed(0) + ' km';
    document.getElementById('sat-perigee').innerHTML = sat.perigee.toFixed(0) + ' km';
    document.getElementById('sat-inclination').innerHTML = (sat.inclination * RAD2DEG).toFixed(2) + '°';
    document.getElementById('sat-eccentricity').innerHTML = sat.eccentricity.toFixed(3);
    document.getElementById('sat-raan').innerHTML = (sat.raan * RAD2DEG).toFixed(2) + '°';
    document.getElementById('sat-argPe').innerHTML = (sat.argPe * RAD2DEG).toFixed(2) + '°';

    document.getElementById('sat-period').innerHTML = sat.period.toFixed(2) + ' min';
    $('#sat-period').tooltip({
      // delay: 50,
      html: 'Mean Motion: ' + (MINUTES_PER_DAY / sat.period).toFixed(2),
      position: 'left',
    });

    // TODO: Error checking on Iframe
    let now: Date | number | string = new Date();
    const jday = keepTrackApi.programs.timeManager.getDayOfYear(now);
    now = now.getUTCFullYear();
    now = now.toString().substr(2, 2);
    let daysold;
    if (sat.TLE1.substr(18, 2) === now) {
      daysold = jday - parseInt(sat.TLE1.substr(20, 3));
    } else {
      daysold = jday + parseInt(now) * 365 - (parseInt(sat.TLE1.substr(18, 2)) * 365 + parseInt(sat.TLE1.substr(20, 3)));
    }
    document.getElementById('sat-elset-age').innerHTML = daysold + ' Days';
    $('#sat-elset-age').tooltip({
      // delay: 50,
      html: 'Epoch Year: ' + sat.TLE1.substr(18, 2).toString() + ' Day: ' + sat.TLE1.substr(20, 8).toString(),
      position: 'left',
    });

    if (!keepTrackApi.programs.objectManager.isSensorManagerLoaded) {
      document.getElementById('sat-sun').parentElement.style.display = 'none';
    } else {
      now = new Date(keepTrackApi.programs.timeManager.dynamicOffsetEpoch + keepTrackApi.programs.timeManager.propOffset);
      const sunTime: any = SunCalc.getTimes(now, keepTrackApi.programs.sensorManager.currentSensor[0].lat, keepTrackApi.programs.sensorManager.currentSensor[0].lon);

      let satInSun = -1;
      if (typeof sat.isInSun !== 'undefined') {
        satInSun = sat.isInSun();
      }

      // If No Sensor, then Ignore Sun Exclusion
      if (keepTrackApi.programs.sensorManager.currentSensor[0].lat === null) {
        document.getElementById('sat-sun').style.display = 'none';
        return;
      } else {
        document.getElementById('sat-sun').style.display = 'block';
      }

      // If Radar Selected, then Say the Sun Doesn't Matter
      if (
        keepTrackApi.programs.sensorManager.currentSensor[0].type !== SpaceObjectType.OPTICAL &&
        keepTrackApi.programs.sensorManager.currentSensor[0].type !== SpaceObjectType.OBSERVER
      ) {
        document.getElementById('sat-sun').innerHTML = 'No Effect';
        // If Dawn Dusk Can be Calculated then show if the satellite is in the sun
      } else if (sunTime.dawn.getTime() - now.getTime() > 0 || sunTime.dusk.getTime() - now.getTime() < 0) {
        if (satInSun == 0) document.getElementById('sat-sun').innerHTML = 'No Sunlight';
        if (satInSun == 1) document.getElementById('sat-sun').innerHTML = 'Limited Sunlight';
        if (satInSun == 2) document.getElementById('sat-sun').innerHTML = 'Direct Sunlight';
        // If Optical Sesnor but Dawn Dusk Can't Be Calculated, then you are at a
        // high latitude and we need to figure that out
      } else if (sunTime.night != 'Invalid Date' && (sunTime.dawn == 'Invalid Date' || sunTime.dusk == 'Invalid Date')) {
        // TODO: Figure out how to calculate this
        console.debug('No Dawn or Dusk');
        if (satInSun == 0) document.getElementById('sat-sun').innerHTML = 'No Sunlight';
        if (satInSun == 1) document.getElementById('sat-sun').innerHTML = 'Limited Sunlight';
        if (satInSun == 2) document.getElementById('sat-sun').innerHTML = 'Direct Sunlight';
      } else {
        // Unless you are in sun exclusion
        document.getElementById('sat-sun').innerHTML = 'Sun Exclusion';
      }
      if (satInSun == -1) document.getElementById('sat-sun').innerHTML = 'Unable to Calculate';
    }
  }

  document.getElementById('all-objects-link').addEventListener('click', allObjectsLink);
  document.getElementById('near-orbits-link').addEventListener('click', nearOrbitsLink);
  document.getElementById('near-objects-link1').addEventListener('click', () => nearObjectsLinkClick(100));
  document.getElementById('near-objects-link2').addEventListener('click', () => nearObjectsLinkClick(200));
  document.getElementById('near-objects-link4').addEventListener('click', () => nearObjectsLinkClick(400));
  document.getElementById('sun-angle-link').addEventListener('click', drawLineToSun);
  document.getElementById('nadir-angle-link').addEventListener('click', drawLineToEarth);
  document.getElementById('sec-angle-link').addEventListener('click', drawLineToSat);
};

const drawLineToSun = () => {
  const { lineManager, objectManager, drawManager } = keepTrackApi.programs;
  lineManager.create('sat2', [objectManager.selectedSat, drawManager.sceneManager.sun.pos[0], drawManager.sceneManager.sun.pos[1], drawManager.sceneManager.sun.pos[2]], 'o');
};

const drawLineToEarth = () => {
  const { lineManager, objectManager } = keepTrackApi.programs;
  lineManager.create('sat', objectManager.selectedSat, 'p');
};

const drawLineToSat = () => {
  const { lineManager, objectManager } = keepTrackApi.programs;
  lineManager.create('sat5', [objectManager.selectedSat, objectManager.secondarySat], 'b');
};

export const secondaryData = (sat: SatObject): void => {
  if (sat === null || typeof sat === 'undefined') return;

  if (!satInfoboxCore.secondaryData.isLoaded) {
    document.getElementById('sat-infobox').innerHTML += keepTrackApi.html`
        <div id="secondary-sat-info">
          <div class="sat-info-section-header">Secondary Satellite</div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Linear Distance from Secondary Satellite">
              Linear
            </div>
            <div class="sat-info-value" id="sat-sec-dist">xxxx km</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Radial Distance">
              Radial
            </div>
            <div class="sat-info-value" id="sat-sec-rad">XX deg</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="In-Track Distance from Secondary Satellite">
              In-Track
            </div>
            <div class="sat-info-value" id="sat-sec-intrack">XX deg</div>
          </div>
          <div class="sat-info-row">
            <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
              data-tooltip="Cross-Track Distance from Secondary Satellite">
              Cross-Track
            </div>
            <div class="sat-info-value" id="sat-sec-crosstrack">xxxx km</div>
          </div>
        </div> 
        `;
    satInfoboxCore.secondaryData.isLoaded = true;
  }
};
export const satMissionData = (sat: SatObject): void => {
  // NOSONAR
  if (sat === null || typeof sat === 'undefined') return;

  if (!satInfoboxCore.satMissionData.isLoaded) {
    document.getElementById('sat-infobox').innerHTML += keepTrackApi.html`
      <div class="sat-info-section-header">Mission</div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Visual Magnitude - Smaller Numbers Are Brighter">
            Visual Mag
          </div>
          <div class="sat-info-value" id="sat-vmag">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Primary User of the Satellite">
            User
          </div>
          <div class="sat-info-value" id="sat-user">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Main Function of the Satellite">
            Purpose
          </div>
          <div class="sat-info-value" id="sat-purpose">
            NO DATA
          </div>
        </div>        
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Contractor Who Built the Satellite">
            Contractor
          </div>
          <div class="sat-info-value" id="sat-contractor">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Mass at Lift Off">
            Lift Mass
          </div>
          <div class="sat-info-value" id="sat-launchMass">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50" data-tooltip="Unfueled Mass">
            Dry Mass
          </div>
          <div class="sat-info-value" id="sat-dryMass">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="How Long the Satellite was Expected to be Operational">
            Life Expectancy
          </div>
          <div class="sat-info-value" id="sat-lifetime">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Satellite Bus">
            Bus
          </div>
          <div class="sat-info-value" id="sat-bus">
            NO DATA
          </div>
        </div>
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Primary Payload">
            Payload
          </div>
          <div class="sat-info-value" id="sat-payload">
            NO DATA
          </div>
        </div>    
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Primary Motor">
            Motor
          </div>
          <div class="sat-info-value" id="sat-motor">
            NO DATA
          </div>
        </div>      
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Length in Meters">
            Length
          </div>
          <div class="sat-info-value" id="sat-length">
            NO DATA
          </div>
        </div>      
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Diameter in Meters">
            Diameter
          </div>
          <div class="sat-info-value" id="sat-diameter">
            NO DATA
          </div>
        </div>   
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Span in Meters">
            Span
          </div>
          <div class="sat-info-value" id="sat-span">
            NO DATA
          </div>
        </div>         
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Description of Shape">
            Shape
          </div>
          <div class="sat-info-value" id="sat-shape">
            NO DATA
          </div>
        </div>      
        <div class="sat-info-row sat-only-info">
          <div class="sat-info-key  tooltipped" data-position="left" data-delay="50"
            data-tooltip="Power of the Satellite">
            Power
          </div>
          <div class="sat-info-value" id="sat-power">
            NO DATA
          </div>
        </div>
        `;
    satInfoboxCore.satMissionData.isLoaded = true;
  }

  if (!sat.missile) {
    (<HTMLElement>document.querySelector('.sat-only-info')).style.display = 'block';
  } else {
    (<HTMLElement>document.querySelector('.sat-only-info')).style.display = 'none';
  }

  if (!sat.missile) {
    document.getElementById('sat-user').innerHTML = sat?.owner && sat?.owner !== '' ? sat?.owner : 'Unknown';
    document.getElementById('sat-purpose').innerHTML = sat?.purpose && sat?.purpose !== '' ? sat?.purpose : 'Unknown';
    document.getElementById('sat-contractor').innerHTML = sat?.manufacturer && sat?.manufacturer !== '' ? sat?.manufacturer : 'Unknown';
    // Update with other mass options
    document.getElementById('sat-launchMass').innerHTML = sat?.launchMass && sat?.launchMass !== '' ? sat?.launchMass + ' kg' : 'Unknown';
    document.getElementById('sat-dryMass').innerHTML = sat?.dryMass && sat?.dryMass !== '' ? sat?.dryMass + ' kg' : 'Unknown';
    document.getElementById('sat-lifetime').innerHTML = sat?.lifetime && sat?.lifetime !== '' ? sat?.lifetime + ' yrs' : 'Unknown';
    document.getElementById('sat-power').innerHTML = sat?.power && sat?.power !== '' ? sat?.power + ' w' : 'Unknown';
    document.getElementById('sat-vmag').innerHTML = sat?.vmag && sat?.vmag?.toString() !== '' ? sat?.vmag?.toString() : 'Unknown';
    document.getElementById('sat-bus').innerHTML = sat?.bus && sat?.bus !== '' ? sat?.bus : 'Unknown';
    document.getElementById('sat-configuration').innerHTML = sat?.configuration && sat?.configuration !== '' ? sat?.configuration : 'Unknown';
    document.getElementById('sat-payload').innerHTML = sat?.payload && sat?.payload !== '' ? sat?.payload : 'Unknown';
    document.getElementById('sat-motor').innerHTML = sat?.motor && sat?.motor !== '' ? sat?.motor : 'Unknown';
    document.getElementById('sat-length').innerHTML = sat?.length && sat?.length !== '' ? sat?.length + ' m' : 'Unknown';
    document.getElementById('sat-diameter').innerHTML = sat?.diameter && sat?.diameter !== '' ? sat?.diameter + ' m' : 'Unknown';
    document.getElementById('sat-span').innerHTML = sat?.span && sat?.span !== '' ? sat?.span + ' m' : 'Unknown';
    document.getElementById('sat-shape').innerHTML = sat?.shape && sat?.shape !== '' ? sat?.shape : 'Unknown';
    document.getElementById('sat-configuration').innerHTML = sat?.configuration && sat?.configuration !== '' ? sat?.configuration : 'Unknown';
    $('a.iframe').colorbox({
      iframe: true,
      width: '80%',
      height: '80%',
      fastIframe: false,
      closeButton: false,
    });
  }
};
export const intelData = (sat: SatObject, satId?: number): void => {
  // NOSONAR
  if (satId !== -1) {
    if (!satInfoboxCore.intelData.isLoaded) {
      document.getElementById('sat-infobox').innerHTML += keepTrackApi.html`
        <div id="intel-data-section" class="sat-info-section-header">Intel Data</div>
          <div class="sat-info-row sat-only-info" id="sat-ttp-wrapper">
            <div class="sat-info-key">
              TTPs
            </div>
            <div class="sat-info-value" id="sat-ttp">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-notes-wrapper">
            <div class="sat-info-key">
              Notes
            </div>
            <div class="sat-info-value" id="sat-notes">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-fmissed-wrapper">
            <div class="sat-info-key">
              Freq. Missed
            </div>
            <div class="sat-info-value" id="sat-fmissed">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-oRPO-wrapper">
            <div class="sat-info-key">
              Sec. Obj
            </div>
            <div class="sat-info-value" id="sat-oRPO">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-constellation-wrapper">
            <div class="sat-info-key">
              Constellation
            </div>
            <div class="sat-info-value" id="sat-constellation">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-maneuver-wrapper">
            <div class="sat-info-key">
              Maneuver
            </div>
            <div class="sat-info-value" id="sat-maneuver">
              NO DATA
            </div>
          </div>
          <div class="sat-info-row sat-only-info" id="sat-associates-wrapper">
            <div class="sat-info-key">
              Associates
            </div>
            <div class="sat-info-value" id="sat-associates">
              NO DATA
            </div>
          </div>
        </div>`;
      satInfoboxCore.intelData.isLoaded = true;
    }

    if (typeof sat.TTP != 'undefined') {
      document.getElementById('sat-ttp-wrapper').style.display = 'block';
      document.getElementById('sat-ttp').innerHTML = sat.TTP;
    } else {
      document.getElementById('sat-ttp-wrapper').style.display = 'none';
    }
    if (typeof sat.NOTES != 'undefined') {
      document.getElementById('sat-notes-wrapper').style.display = 'block';
      document.getElementById('sat-notes').innerHTML = sat.NOTES;
    } else {
      document.getElementById('sat-notes-wrapper').style.display = 'none';
    }
    if (typeof sat.FMISSED != 'undefined') {
      document.getElementById('sat-fmissed-wrapper').style.display = 'block';
      document.getElementById('sat-fmissed').innerHTML = sat.FMISSED;
    } else {
      document.getElementById('sat-fmissed-wrapper').style.display = 'none';
    }
    if (typeof sat.ORPO != 'undefined') {
      document.getElementById('sat-oRPO-wrapper').style.display = 'block';
      document.getElementById('sat-oRPO').innerHTML = sat.ORPO;
    } else {
      document.getElementById('sat-oRPO-wrapper').style.display = 'none';
    }
    if (typeof sat.constellation != 'undefined') {
      document.getElementById('sat-constellation-wrapper').style.display = 'block';
      document.getElementById('sat-constellation').innerHTML = sat.constellation;
    } else {
      document.getElementById('sat-constellation-wrapper').style.display = 'none';
    }
    if (typeof sat.maneuver != 'undefined') {
      document.getElementById('sat-maneuver-wrapper').style.display = 'block';
      document.getElementById('sat-maneuver').innerHTML = sat.maneuver;
    } else {
      document.getElementById('sat-maneuver-wrapper').style.display = 'none';
    }
    if (typeof sat.associates != 'undefined') {
      document.getElementById('sat-associates-wrapper').style.display = 'block';
      document.getElementById('sat-associates').innerHTML = sat.associates;
    } else {
      document.getElementById('sat-associates-wrapper').style.display = 'none';
    }

    if (
      typeof sat.TTP === 'undefined' &&
      typeof sat.NOTES === 'undefined' &&
      typeof sat.FMISSED === 'undefined' &&
      typeof sat.ORPO === 'undefined' &&
      typeof sat.constellation === 'undefined' &&
      typeof sat.maneuver === 'undefined' &&
      typeof sat.associates === 'undefined'
    ) {
      document.getElementById('intel-data-section').style.display = 'none';
    }
  }
};
export const objectData = (sat: SatObject): void => {
  if (sat === null || typeof sat === 'undefined') return;

  document.getElementById('sat-info-title').innerHTML = sat.name;

  switch (sat.type) {
    case SpaceObjectType.UNKNOWN:
      document.getElementById('sat-type').innerHTML = 'TBA';
      break;
    case SpaceObjectType.PAYLOAD:
      document.getElementById('sat-type').innerHTML = 'Payload';
      break;
    case SpaceObjectType.ROCKET_BODY:
      document.getElementById('sat-type').innerHTML = 'Rocket Body';
      break;
    case SpaceObjectType.DEBRIS:
      document.getElementById('sat-type').innerHTML = 'Debris';
      break;
    case SpaceObjectType.SPECIAL:
      document.getElementById('sat-type').innerHTML = 'Special';
      break;
    case SpaceObjectType.RADAR_MEASUREMENT:
      document.getElementById('sat-type').innerHTML = 'Radar Measurement';
      break;
    case SpaceObjectType.RADAR_TRACK:
      document.getElementById('sat-type').innerHTML = 'Radar Track';
      break;
    case SpaceObjectType.RADAR_OBJECT:
      document.getElementById('sat-type').innerHTML = 'Radar Object';
      break;
    default:
      if (sat.missile) document.getElementById('sat-type').innerHTML = 'Ballistic Missile';
  }

  // TODO:
  // document.getElementById('edit-satinfo-link').innerHTML = "<a class='iframe' href='editor.htm?scc=" + sat.sccNum + "&popup=true'>Edit Satellite Info</a>";

  $('a.iframe').colorbox({
    iframe: true,
    width: '80%',
    height: '80%',
    fastIframe: false,
    closeButton: false,
  });

  document.getElementById('sat-intl-des').innerHTML = sat.intlDes;
  if (sat.type > 4) {
    document.getElementById('sat-objnum').innerHTML = 1 + sat.TLE2.substr(2, 7).toString();
  } else {
    document.getElementById('sat-objnum').innerHTML = sat.sccNum;
  }

  // /////////////////////////////////////////////////////////////////////////
  // RCS Correlation Table
  // /////////////////////////////////////////////////////////////////////////
  if (sat.rcs === null || typeof sat.rcs == 'undefined' || sat.rcs === '') {
    document.getElementById('sat-rcs').innerHTML = 'Unknown';
  } else {
    document.getElementById('sat-rcs').innerHTML = sat.rcs;
  }
};
export const init = (): void => {
  // NOTE: This has to go first.
  // Register orbital element data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'orbitalData',
    cb: orbitalData,
  });

  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'secondaryData',
    cb: secondaryData,
  });

  // Register sensor data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'sensorInfo',
    cb: sensorInfo,
  });

  // Register launch data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'launchData',
    cb: launchData,
  });

  // Register mission data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'satMissionData',
    cb: satMissionData,
  });

  // Register intel data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'intelData',
    cb: intelData,
  });

  // Register object data
  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'objectData',
    cb: objectData,
  });
};
