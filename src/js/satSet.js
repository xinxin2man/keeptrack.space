/* */
/**
 * /* /////////////////////////////////////////////////////////////////////////////
 *
 * satSet.js is the primary interface between sat-cruncher and the main application.
 * It manages all interaction with the satellite catalogue.
 * http://keeptrack.space
 *
 * Copyright (C) 2016-2020 Theodore Kruczek
 * Copyright (C) 2020 Heather Kruczek
 * Copyright (C) 2015-2016, James Yoder
 *
 * Original source code released by James Yoder at https://github.com/jeyoder/ThingsInSpace/
 * under the MIT License. Please reference http://keeptrack.space/license/thingsinspace.txt
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * /////////////////////////////////////////////////////////////////////////////
 */
/* eslint-disable no-useless-escape */

import '@app/js/lib/numeric.js';
import * as $ from 'jquery';
import * as glm from '@app/js/lib/gl-matrix.js';
import { db, settingsManager } from '@app/js/settings.js';
import { helpers, mathValue, saveCsv } from '@app/js/helpers.js';
import { RAD2DEG } from '@app/js/constants.js';
import { adviceList } from '@app/js/advice-module.js';
import { jsTLEfile } from '@app/offline/tle.js';
import { nextLaunchManager } from '@app/modules/nextLaunchManager.js';
import { objectManager } from '@app/js/objectManager.js';
import { orbitManager } from '@app/js/orbitManager.js';
import { radarDataManager } from '@app/js/radarDataManager.js';
import { satVmagManager } from '@app/modules/satVmagManager.js';
import { satellite } from '@app/js/lookangles.js';
import { saveAs } from '@app/js/lib/file-saver.min.js';
import { searchBox } from '@app/js/search-box.js';
import { sensorManager } from '@app/modules/sensorManager.js';
import { sun } from '@app/js/sceneManager/sceneManager.js';
import { timeManager } from '@app/js/timeManager.js';
import { uiManager } from '@app/js/uiManager/uiManager.js';

// 'use strict';
var satSet = {};
var gl;

var satCruncher;
var limitSats = settingsManager.limitSats;

var satData;
var satExtraData;

var checkInc = (possibles, minInc, maxInc) => {
  var incRes = [];
  for (var i = 0; i < possibles.length; i++) {
    if ((possibles[i].inclination * RAD2DEG).toFixed(2) < maxInc && (possibles[i].inclination * RAD2DEG).toFixed(2) > minInc) {
      incRes.push(possibles[i]);
    }
  }
  return incRes;
};
var checkPeriod = (possibles, minPeriod, maxPeriod) => {
  var periodRes = [];
  for (var i = 0; i < possibles.length; i++) {
    if (possibles[i].period < maxPeriod && possibles[i].period > minPeriod && periodRes.length <= 200) {
      // Don't display more than 200 results - this is because LEO and GEO belt have a lot of satellites
      periodRes.push(possibles[i]);
    }
  }
  if (periodRes.length >= 200) {
    $('#findByLooks-results').text('Limited to 200 Results!');
  }
  return periodRes;
};
var checkRcs = (possibles, minRcs, maxRcs) => {
  var rcsRes = [];
  for (var i = 0; i < possibles.length; i++) {
    if (parseFloat(possibles[i].R) < maxRcs && parseFloat(possibles[i].R) > minRcs && rcsRes.length <= 200) {
      // Don't display more than 200 results - this is because LEO and GEO belt have a lot of satellites
      rcsRes.push(possibles[i]);
    }
  }
  if (rcsRes.length >= 200) {
    $('#findByLooks-results').text('Limited to 200 Results!');
  }
  return rcsRes;
};

var satelliteList;
if (settingsManager.offline) {
  import('../offline/extra.js').then((resp) => {
    satelliteList = resp;
    console.debug(resp);
  });
}

/**
 * These variables are here rather inside the function because as they
 * loop each iteration it was causing the jsHeap to grow. This isn't noticeable
 * on faster computers because the garbage collector takes care of it, but on
 * slower computers it would noticeably lag when the garbage collector ran.
 *
 * The arbitrary convention used is to put the name of the loop/function the
 * variable is part of at the front of what the name used to be
 * (ex: now --> drawNow) (ex: i --> satCrunchIndex)
 */
var satCrunchIndex;
var satCrunchNow = 0;
var gotExtraData = false;

var parseFromGETVariables = () => {
  var queryStr = window.location.search.substring(1);
  var params = queryStr.split('&');
  for (var i = 0; i < params.length; i++) {
    var key = params[i].split('=')[0];
    if (key === 'vertShadersSize') {
      settingsManager.vertShadersSize = 6;
      document.getElementById('settings-shaders').checked = true;
    }
  }
};

var dotManager;
satSet.init = async (glRef, dotManagerRef, cameraManager) => {
  gl = glRef;
  dotManager = dotManagerRef;
  /** Parses GET variables for Possible sharperShaders */
  parseFromGETVariables();

  settingsManager.loadStr('elsets');
  // Webpack will place this IN ./js not in ./js/webworker like in the source code
  satCruncher = new Worker(settingsManager.installDirectory + 'js/positionCruncher.js');
  addSatCruncherOnMessage(cameraManager);

  satSet.satCruncher = satCruncher;
};

var addSatCruncherOnMessage = (cameraManager) => {
  satCruncher.onmessage = (m) => {
    if (!gotExtraData) {
      // store extra data that comes from crunching
      // Only do this once

      satExtraData = JSON.parse(m.data.extraData);

      for (satCrunchIndex = 0; satCrunchIndex < satSet.numSats; satCrunchIndex++) {
        satData[satCrunchIndex].inclination = satExtraData[satCrunchIndex].inclination;
        satData[satCrunchIndex].eccentricity = satExtraData[satCrunchIndex].eccentricity;
        satData[satCrunchIndex].raan = satExtraData[satCrunchIndex].raan;
        satData[satCrunchIndex].argPe = satExtraData[satCrunchIndex].argPe;
        satData[satCrunchIndex].meanMotion = satExtraData[satCrunchIndex].meanMotion;

        satData[satCrunchIndex].semiMajorAxis = satExtraData[satCrunchIndex].semiMajorAxis;
        satData[satCrunchIndex].semiMinorAxis = satExtraData[satCrunchIndex].semiMinorAxis;
        satData[satCrunchIndex].apogee = satExtraData[satCrunchIndex].apogee;
        satData[satCrunchIndex].perigee = satExtraData[satCrunchIndex].perigee;
        satData[satCrunchIndex].period = satExtraData[satCrunchIndex].period;
        satData[satCrunchIndex].velocity = {};
      }

      gotExtraData = true;
      satExtraData = null;
      return;
    }

    if (m.data.extraUpdate) {
      satExtraData = JSON.parse(m.data.extraData);
      satCrunchIndex = m.data.satId;

      satData[satCrunchIndex].inclination = satExtraData[0].inclination;
      satData[satCrunchIndex].eccentricity = satExtraData[0].eccentricity;
      satData[satCrunchIndex].raan = satExtraData[0].raan;
      satData[satCrunchIndex].argPe = satExtraData[0].argPe;
      satData[satCrunchIndex].meanMotion = satExtraData[0].meanMotion;

      satData[satCrunchIndex].semiMajorAxis = satExtraData[0].semiMajorAxis;
      satData[satCrunchIndex].semiMinorAxis = satExtraData[0].semiMinorAxis;
      satData[satCrunchIndex].apogee = satExtraData[0].apogee;
      satData[satCrunchIndex].perigee = satExtraData[0].perigee;
      satData[satCrunchIndex].period = satExtraData[0].period;
      satData[satCrunchIndex].TLE1 = satExtraData[0].TLE1;
      satData[satCrunchIndex].TLE2 = satExtraData[0].TLE2;
      satExtraData = null;
      return;
    }

    if (typeof dotManager.positionData == 'undefined') {
      dotManager.positionData = new Float32Array(m.data.satPos);
    } else {
      dotManager.positionData.set(m.data.satPos, 0);
    }

    if (typeof dotManager.velocityData == 'undefined') {
      dotManager.velocityData = new Float32Array(m.data.satVel);
    } else {
      dotManager.velocityData.set(m.data.satVel, 0);
    }

    if (typeof m.data.satInView != 'undefined') {
      if (typeof dotManager.inViewData == 'undefined') {
        dotManager.inViewData = new Int8Array(m.data.satInView);
      } else {
        dotManager.inViewData.set(m.data.satInView, 0);
      }
    }

    if (typeof m.data.satInSun != 'undefined') {
      if (typeof dotManager.inSunData == 'undefined') {
        dotManager.inSunData = new Int8Array(m.data.satInSun);
      } else {
        dotManager.inSunData.set(m.data.satInSun, 0);
      }
    }

    if (typeof m.data.sensorMarkerArray != 'undefined') {
      satSet.satSensorMarkerArray = m.data.sensorMarkerArray;
    }

    if (settingsManager.isMapMenuOpen || settingsManager.isMapUpdateOverride) {
      satCrunchNow = Date.now();
      if (satCrunchNow > settingsManager.lastMapUpdateTime + 30000) {
        uiManager.updateMap();
        settingsManager.lastMapUpdateTime = satCrunchNow;
        settingsManager.isMapUpdateOverride = false;
      } else if (settingsManager.isMapUpdateOverride) {
        uiManager.updateMap();
        settingsManager.lastMapUpdateTime = satCrunchNow;
        settingsManager.isMapUpdateOverride = false;
      }
    }

    if (settingsManager.socratesOnSatCruncher) {
      objectManager.setSelectedSat(settingsManager.socratesOnSatCruncher);
      settingsManager.socratesOnSatCruncher = null;
    }

    // Don't force color recalc if default colors and no sensor for inview color
    if ((objectManager.isSensorManagerLoaded && sensorManager.currentSensor.lat != null) || settingsManager.isForceColorScheme) {
      // Don't change colors while dragging
      if (!cameraManager.isDragging) {
        satSet.setColorScheme(settingsManager.currentColorScheme, true); // force color recalc
      }
    }

    if (!settingsManager.cruncherReady) {
      /** Hide SOCRATES menu if not all the satellites are currently available to view */
      if (limitSats !== '') {
        $('#menu-satellite-collision').hide();
      }

      satSet.onCruncherReady();
      if (!settingsManager.disableUI) {
        uiManager.reloadLastSensor();
        (function _watchlistInit() {
          let watchlistJSON;
          try {
            watchlistJSON = localStorage.getItem('watchlistList');
          } catch (e) {
            watchlistJSON = null;
          }
          if (watchlistJSON !== null) {
            let newWatchlist = JSON.parse(watchlistJSON);
            let watchlistInViewList = [];
            for (let i = 0; i < newWatchlist.length; i++) {
              let sat = satSet.getSatExtraOnly(satSet.getIdFromObjNum(newWatchlist[i]));
              if (sat !== null) {
                newWatchlist[i] = sat.id;
                watchlistInViewList.push(false);
              } else {
                console.error('Watchlist File Format Incorret');
                return;
              }
            }
            uiManager.updateWatchlist(newWatchlist, watchlistInViewList);
          }
        })();
      }

      try {
        nextLaunchManager.init();
      } catch (e) {
        // Might not have this module
      }

      (function _parseGetParameters() {
        // do querystring stuff
        let params = satSet.queryStr.split('&');

        // Do Searches First
        for (let i = 0; i < params.length; i++) {
          let key = params[i].split('=')[0];
          let val = params[i].split('=')[1];
          if (key == 'search') {
            if (!settingsManager.disableUI) {
              uiManager.doSearch(val);
              if (settingsManager.lastSearchResults.length == 0) {
                uiManager.toast(`Search for "${val}" found nothing!`, 'caution', true);
                searchBox.hideResults();
              }
            }
          }
        }

        // Then Do Other Stuff
        for (let i = 0; i < params.length; i++) {
          let key = params[i].split('=')[0];
          let val = params[i].split('=')[1];
          let urlSatId;
          switch (key) {
            case 'intldes':
              urlSatId = satSet.getIdFromIntlDes(val.toUpperCase());
              if (urlSatId !== null) {
                objectManager.setSelectedSat(urlSatId);
              } else {
                uiManager.toast(`International Designator "${val.toUpperCase()}" was not found!`, 'caution', true);
              }
              break;
            case 'sat':
              urlSatId = satSet.getIdFromObjNum(val.toUpperCase());
              if (urlSatId !== null) {
                objectManager.setSelectedSat(urlSatId);
              } else {
                uiManager.toast(`Satellite "${val.toUpperCase()}" was not found!`, 'caution', true);
              }
              break;
            case 'misl':
              var subVal = val.split(',');
              $('#ms-type').val(subVal[0].toString());
              $('#ms-attacker').val(subVal[1].toString());
              // $('#ms-lat-lau').val() * 1;
              // ('#ms-lon-lau').val() * 1;
              $('#ms-target').val(subVal[2].toString());
              // $('#ms-lat').val() * 1;
              // $('#ms-lon').val() * 1;
              $('#missile').trigger('submit');
              break;
            case 'date':
              if (isNaN(parseInt(val))) {
                uiManager.toast(`Date value of "${val}" is not a proper unix timestamp!`, 'caution', true);
                break;
              }
              timeManager.propOffset = Number(val) - Date.now();
              $('#datetime-input-tb').datepicker('setDate', new Date(timeManager.propRealTime + timeManager.propOffset));
              satCruncher.postMessage({
                typ: 'offset',
                dat: timeManager.propOffset.toString() + ' ' + timeManager.propRate.toString(),
              });
              break;
            case 'rate':
              if (isNaN(parseFloat(val))) {
                uiManager.toast(`Propagation rate of "${val}" is not a valid float!`, 'caution', true);
                break;
              }
              val = Math.min(val, 1000);
              // could run time backwards, but let's not!
              val = Math.max(val, 0.0);
              timeManager.propRate = Number(val);
              satCruncher.postMessage({
                typ: 'offset',
                dat: timeManager.propOffset.toString() + ' ' + timeManager.propRate.toString(),
              });
              break;
          }
        }
      })();

      // Load ALl The Images Now
      setTimeout(function () {
        $('img').each(function () {
          $(this).attr('src', $(this).attr('delayedsrc'));
        });
      }, 0);

      settingsManager.cruncherReady = true;
    }
  };
};

// This is a wrapper that tries various combinations to figure out which file to use for the satellites
// It should be cleaned up later
// It returns the result of satSet.parseCatalog (they are chained together)
satSet.loadCatalog = async () => {
  settingsManager.isCatalogPreloaded = true;
  if (typeof settingsManager.tleSource == 'undefined') {
    settingsManager.tleSource = `${settingsManager.installDirectory}tle/TLE.json`;
  }
  if (settingsManager.offline) {
    satSet.parseCatalog(jsTLEfile);
    // jsTLEfile = null;
  } else {
    try {
      var tleSource = settingsManager.tleSource;
      // $.get('' + tleSource + '?v=' + settingsManager.versionNumber)
      await $.get({
        url: '' + tleSource,
        cache: false,
      })
        .done(function (resp) {
          // if the .json loads then use it
          return satSet.parseCatalog(resp);
        })
        .fail(function () {
          // Disable Caching
          // Try using a cached version - mainly for serviceWorker
          $.get({
            url: '' + tleSource,
            cache: true,
          })
            .done(function (resp) {
              // if the .json loads then use it
              return satSet.parseCatalog(resp);
            })
            .fail(function () {
              // Try the js file without caching
              $.getScript(
                `${settingsManager.installDirectory}offline/tle.js`,
                function () {
                  return satSet.parseCatalog(jsTLEfile);
                },
                true
              );
            });
        });
    } catch (e) {
      console.log(e);
      return satSet.parseCatalog(jsTLEfile);
    }
  }
};

// Parse the Catalog from satSet.loadCatalog and then return it back -- they are chained together!
satSet.parseCatalog = (resp) => {
  // Get TruSat TLEs if in TruSat Mode
  if (typeof trusatList == 'undefined' && settingsManager.trusatMode && !settingsManager.trusatOnly) {
    $.getScript('/tle/trusat.js', function (resp) {
      satSet.parseCatalog(resp); // Try again when you have all TLEs
    });
    return; // Stop and Wait for the TruSat TLEs to Load
  }

  let limitSatsArray = satSet.setupGetVariables();

  satData = satSet.filterTLEDatabase(resp, limitSatsArray);
  satSet.satData = satData; // Expose this to everyone
  resp = null; // is this needed?

  /** Send satDataString to satCruncher to begin propagation loop */
  satCruncher.postMessage({
    typ: 'satdata',
    dat: JSON.stringify(satData),
    fieldOfViewSetLength: objectManager.fieldOfViewSet.length,
    isLowPerf: settingsManager.lowPerf,
  });

  delete objectManager.fieldOfViewSet;

  if (!settingsManager.trusatOnly) {
    // If No Visual Magnitudes, Add The VMag Database
    try {
      if (typeof satSet.getSat(satSet.getIdFromObjNum(44235)).vmag == 'undefined') {
        satVmagManager.init(satSet);
      }
    } catch (e) {
      console.debug('satVmagManager Not Loaded');
    }
  }

  satSet.numSats = satData.length;
  satSet.isInitDone = true;
  return satData;
};

satSet.setupGetVariables = () => {
  var obslatitude;
  var obslongitude;
  var obsheight;
  var obsminaz;
  var obsmaxaz;
  var obsminel;
  var obsmaxel;
  var obsminrange;
  var obsmaxrange;
  var limitSatsArray = [];
  /** Parses GET variables for SatCruncher initialization */
  // This should be somewhere else!!
  var queryStr = window.location.search.substring(1);
  var params = queryStr.split('&');
  for (var i = 0; i < params.length; i++) {
    var key = params[i].split('=')[0];
    var val = params[i].split('=')[1];
    switch (key) {
      case 'limitSats':
        limitSats = val;
        $('#limitSats').val(val);
        // document.getElementById('settings-limitSats-enabled').checked = true;
        $('#limitSats-Label').addClass('active');
        limitSatsArray = val.split(',');
        break;
      case 'lat':
        if (val >= -90 && val <= 90) obslatitude = val;
        break;
      case 'long':
        if (val >= -180 && val <= 360) obslongitude = val;
        break;
      case 'hei':
        if (val >= -20 && val <= 20) obsheight = val;
        break;
      case 'minaz':
        if (val >= 0 && val <= 360) obsminaz = val;
        break;
      case 'maxaz':
        if (val >= 0 && val <= 360) obsmaxaz = val;
        break;
      case 'minel':
        if (val >= -10 && val <= 180) obsminel = val;
        break;
      case 'maxel':
        if (val >= -10 && val <= 180) obsmaxel = val;
        break;
      case 'minrange':
        if (val >= 0) obsminrange = val;
        break;
      case 'maxrange':
        if (val <= 10000000) obsmaxrange = val;
        break;
    }
  }

  /** If custom sensor set then send parameters to lookangles and satCruncher */
  if (
    typeof obslatitude !== 'undefined' &&
    typeof obslongitude !== 'undefined' &&
    typeof obsheight !== 'undefined' &&
    typeof obsminaz !== 'undefined' &&
    typeof obsmaxaz !== 'undefined' &&
    typeof obsminel !== 'undefined' &&
    typeof obsmaxel !== 'undefined' &&
    typeof obsminrange !== 'undefined' &&
    typeof obsmaxrange !== 'undefined'
  ) {
    satellite.setobs({
      lat: obslatitude,
      long: obslongitude,
      obshei: obsheight,
      obsminaz: obsminaz,
      obsmaxaz: obsmaxaz,
      obsminel: obsminel,
      obsmaxel: obsmaxel,
      obsminrange: obsminrange,
      obsmaxrange: obsmaxrange,
    });

    satCruncher.postMessage({
      typ: 'offset',
      dat: timeManager.propOffset.toString() + ' ' + timeManager.propRate.toString(),
      setlatlong: true,
      lat: obslatitude,
      long: obslongitude,
      obshei: obsheight,
      obsminaz: obsminaz,
      obsmaxaz: obsmaxaz,
      obsminel: obsminel,
      obsmaxel: obsmaxel,
      obsminrange: obsminrange,
      obsmaxrange: obsmaxrange,
    });
  }

  return limitSatsArray;
};

satSet.filterTLEDatabase = (resp, limitSatsArray) => {
  var tempSatData = [];
  satSet.sccIndex = {};
  satSet.cosparIndex = {};
  if (limitSatsArray[0] == null) {
    // If there are no limits then just process like normal
    limitSats = '';
  }

  var year;
  var prefix;
  var rest;

  // if (settingsManager.offline) {
  //   resp = JSON.parse(resp);
  // }

  let i = 0;
  for (i = 0; i < resp.length; i++) {
    resp[i].SCC_NUM = helpers.pad0(resp[i].TLE1.substr(2, 5).trim(), 5);
    if (limitSats === '') {
      // If there are no limits then just process like normal
      year = resp[i].TLE1.substr(9, 8).trim().substring(0, 2); // clean up intl des for display
      if (year === '') {
        resp[i].intlDes = 'none';
      } else {
        prefix = year > 50 ? '19' : '20';
        year = prefix + year;
        rest = resp[i].TLE1.substr(9, 8).trim().substring(2);
        resp[i].intlDes = year + '-' + rest;
      }
      resp[i].id = i;
      satSet.sccIndex[`${resp[i].SCC_NUM}`] = resp[i].id;
      satSet.cosparIndex[`${resp[i].intlDes}`] = resp[i].id;
      resp[i].active = true;
      tempSatData.push(resp[i]);
      continue;
    } else {
      // If there are limited satellites
      for (var x = 0; x < limitSatsArray.length; x++) {
        if (resp[i].SCC_NUM === limitSatsArray[x]) {
          year = resp[i].TLE1.substr(9, 8).trim().substring(0, 2); // clean up intl des for display
          if (year === '') {
            resp[i].intlDes = 'none';
          } else {
            prefix = year > 50 ? '19' : '20';
            year = prefix + year;
            rest = resp[i].TLE1.substr(9, 8).trim().substring(2);
            resp[i].intlDes = year + '-' + rest;
          }
          resp[i].id = i;
          satSet.sccIndex[`${resp[i].SCC_NUM}`] = resp[i].id;
          satSet.cosparIndex[`${resp[i].intlDes}`] = resp[i].id;
          resp[i].active = true;
          tempSatData.push(resp[i]);
        }
      }
    }
  }
  let isMatchFound = false;
  let extrasSatInfo;
  if (typeof satelliteList !== 'undefined' && settingsManager.offline) {
    // If extra catalogue
    for (let s = 0; s < satelliteList.length; s++) {
      isMatchFound = false;
      if (typeof satelliteList[s].SCC == 'undefined') continue;
      if (typeof satelliteList[s].TLE1 == 'undefined') continue; // Don't Process Bad Satellite Information
      if (typeof satelliteList[s].TLE2 == 'undefined') continue; // Don't Process Bad Satellite Information
      if (typeof satSet.sccIndex[`${satelliteList[s].SCC}`] !== 'undefined') {
        i = satSet.sccIndex[`${satelliteList[s].SCC}`];
        tempSatData[i].ON = satelliteList[s].ON;
        tempSatData[i].OT = typeof satelliteList[s].OT != 'undefined' ? satelliteList[s].OT : null;
        tempSatData[i].TLE1 = satelliteList[s].TLE1;
        tempSatData[i].TLE2 = satelliteList[s].TLE2;
        isMatchFound = true;
        break;
      }
      if (!isMatchFound) {
        if (typeof satelliteList[s].TLE1 == 'undefined') continue; // Don't Process Bad Satellite Information
        if (typeof satelliteList[s].TLE2 == 'undefined') continue; // Don't Process Bad Satellite Information
        settingsManager.isExtraSatellitesAdded = true;

        if (typeof satelliteList[s].ON == 'undefined') {
          satelliteList[s].ON = 'Unknown';
        }
        if (typeof satelliteList[s].OT == 'undefined') {
          satelliteList[s].OT = null;
        }
        year = satelliteList[s].TLE1.substr(9, 8).trim().substring(0, 2); // clean up intl des for display
        prefix = year > 50 ? '19' : '20';
        year = prefix + year;
        rest = satelliteList[s].TLE1.substr(9, 8).trim().substring(2);
        extrasSatInfo = {
          static: false,
          missile: false,
          active: true,
          ON: satelliteList[s].ON,
          OT: satelliteList[s].OT,
          C: 'Unknown',
          LV: 'Unknown',
          LS: 'Unknown',
          SCC_NUM: satelliteList[s].SCC.toString(),
          TLE1: satelliteList[s].TLE1,
          TLE2: satelliteList[s].TLE2,
          intlDes: year + '-' + rest,
          type: 'sat',
          id: tempSatData.length,
          vmag: satelliteList[s].vmag,
        };
        satSet.sccIndex[`${satelliteList[s].SCC.toString()}`] = tempSatData.length;
        satSet.cosparIndex[`${year}-${rest}`] = tempSatData.length;
        tempSatData.push(extrasSatInfo);
      }
    }
    satelliteList = null;
  }
  // if (
  //   typeof satInfoList !== 'undefined' &&
  //   settingsManager.offline
  // ) {
  //   // If extra catalogue
  //   for (let s = 0; s < satInfoList.length; s++) {
  //     settingsManager.isExtraSatellitesAdded = true;
  //     isMatchFound = false;
  //     // NOTE i=s may need to be i=0, but this should be more effecient.
  //     // There should be some sorting done earlier
  //     for (i = s; i < tempSatData.length; i++) {
  //       if (satInfoList[s].SCC === tempSatData[i].SCC_NUM) {
  //         tempSatData[i].ON = satInfoList[s].ON;
  //         tempSatData[i].C = satInfoList[s].C;
  //         tempSatData[i].LV = satInfoList[s].LV;
  //         tempSatData[i].LS = satInfoList[s].LS;
  //         tempSatData[i].URL = satInfoList[s].URL;
  //         isMatchFound = true;
  //         break;
  //       }
  //     }
  //   }
  //   satInfoList = null;
  // }
  // console.log(`${Date.now()} - Merging TruSat TLEs`);
  // if (
  //   typeof trusatList !== 'undefined' &&
  //   settingsManager.trusatMode
  // ) {
  //   // If extra catalogue
  //   for (let s = 0; s < trusatList.length; s++) {
  //     if (typeof trusatList[s].TLE1 == 'undefined') continue; // Don't Process Bad Satellite Information
  //     if (typeof trusatList[s].TLE2 == 'undefined') continue; // Don't Process Bad Satellite Information
  //     if (typeof trusatList[s].ON == 'undefined') {
  //       trusatList[s].ON = 'Unknown';
  //     }
  //     if (typeof trusatList[s].OT == 'undefined') {
  //       trusatList[s].OT = null;
  //     }
  //     year = trusatList[s].TLE1.substr(9, 8)
  //     .trim()
  //     .substring(0, 2); // clean up intl des for display
  //     prefix = year > 50 ? '19' : '20';
  //     year = prefix + year;
  //     rest = trusatList[s].TLE1.substr(9, 8)
  //     .trim()
  //     .substring(2);
  //     scc = pad0(
  //       parseInt(
  //         trusatList[s].TLE1.substr(2, 5).trim()
  //       ).toString(),
  //       5
  //     );
  //     extrasSatInfo = {
  //       static: false,
  //       missile: false,
  //       active: true,
  //       trusat: true,
  //       ON: trusatList[s].ON,
  //       OT: 4, // Amateur Report
  //       C: 'Unknown',
  //       LV: 'Unknown',
  //       LS: 'Unknown',
  //       SCC_NUM: `T${scc.toString()}`,
  //       TLE1: trusatList[s].TLE1,
  //       TLE2: trusatList[s].TLE2,
  //       intlDes: year + '-' + rest,
  //       type: 'sat',
  //       id: tempSatData.length,
  //     };
  //     tempSatData.push(extrasSatInfo);
  //   }
  //   trusatList = null;
  // }

  if (settingsManager.isExtraSatellitesAdded) {
    $('.legend-pink-box').show();
    $('.legend-trusat-box')[1].parentElement.style.display = '';
    $('.legend-trusat-box')[2].parentElement.style.display = '';
    $('.legend-trusat-box')[3].parentElement.style.display = '';
    $('.legend-trusat-box')[1].parentElement.innerHTML = `<div class="Square-Box legend-trusat-box"></div>${settingsManager.nameOfSpecialSats}`;
    $('.legend-trusat-box')[2].parentElement.innerHTML = `<div class="Square-Box legend-trusat-box"></div>${settingsManager.nameOfSpecialSats}`;
    $('.legend-trusat-box')[3].parentElement.innerHTML = `<div class="Square-Box legend-trusat-box"></div>${settingsManager.nameOfSpecialSats}`;
  }

  satSet.orbitalSats = tempSatData.length;
  dotManager.starIndex1 = objectManager.starIndex1 + satSet.orbitalSats;
  dotManager.starIndex2 = objectManager.starIndex2 + satSet.orbitalSats;

  if (settingsManager.isEnableGsCatalog) satSet.initGsData();

  for (i = 0; i < objectManager.staticSet.length; i++) {
    tempSatData.push(objectManager.staticSet[i]);
  }
  for (i = 0; i < objectManager.analSatSet.length; i++) {
    objectManager.analSatSet[i].id = tempSatData.length;
    tempSatData.push(objectManager.analSatSet[i]);
  }

  radarDataManager.satDataStartIndex = tempSatData.length + 1;

  for (let i = 0; i < objectManager.radarDataSet.length; i++) {
    tempSatData.push(objectManager.radarDataSet[i]);
  }

  for (i = 0; i < objectManager.missileSet.length; i++) {
    tempSatData.push(objectManager.missileSet[i]);
  }

  satSet.missileSats = tempSatData.length;

  for (i = 0; i < objectManager.fieldOfViewSet.length; i++) {
    objectManager.fieldOfViewSet[i].id = tempSatData.length;
    tempSatData.push(objectManager.fieldOfViewSet[i]);
  }
  // console.log(tempSatData.length);
  return tempSatData;
};

satSet.getSatData = () => satData;

satSet.getSatInView = () => {
  if (typeof dotManager.inViewData == 'undefined') return false;
  return dotManager.inViewData;
};
satSet.getSatInSun = () => {
  if (typeof dotManager.inSunData == 'undefined') return false;
  return dotManager.inSunData;
};
satSet.getSatVel = () => {
  if (typeof dotManager.velocityData == 'undefined') return false;
  return dotManager.velocityData;
};

satSet.resetSatInView = () => {
  dotManager.inViewData = new Int8Array(dotManager.inViewData.length);
  dotManager.inViewData.fill(0);
};

satSet.resetSatInSun = () => {
  dotManager.inSunData = new Int8Array(dotManager.inSunData.length);
  dotManager.inSunData.fill(0);
};

satSet.setColorScheme = (scheme, isForceRecolor) => {
  settingsManager.setCurrentColorScheme(scheme);

  scheme.calculateColorBuffers(isForceRecolor);
  dotManager.colorBuffer = scheme.colorBuf;
  dotManager.pickingBuffer = scheme.pickableBuf;
};

satSet.convertIdArrayToSatnumArray = (satIdArray) => {
  let satnumArray = [];
  for (let i = 0; i < satIdArray.length; i++) {
    satnumArray.push(parseInt(satSet.getSat(satIdArray[i]).SCC_NUM));
  }
  return satnumArray;
};

satSet.convertSatnumArrayToIdArray = (satnumArray) => {
  let satIdArray = [];
  for (let i = 0; i < satnumArray.length; i++) {
    try {
      satIdArray.push(satSet.getSatFromObjNum(satnumArray[i]).id);
    } catch (e) {
      // console.log(`Missing Sat: ${satnumArray[i]}`);
    }
  }
  return satIdArray;
};

satSet.initGsData = () => {
  $.getScript('satData/gs.json', function (resp) {
    settingsManager.loadStr('satIntel');
    $('#loading-screen').fadeIn(1000, function loadGsInfo() {
      satSet.gsInfo = JSON.parse(resp);
      for (let gsI = 0; gsI < satSet.gsInfo.length; gsI++) {
        let gsSatType = satSet.gsInfo[gsI];
        let satSetFirstI = 0;
        let satSetI = 0;
        for (let gsI2 = 0; gsI2 < gsSatType[1].length; gsI2++) {
          let gsSat = gsSatType[1][gsI2];
          satSetFirstI = Math.max(satSetFirstI - 200, 0);
          if (typeof satSet.cosparIndex[`${gsSat.cospar}`] !== 'undefined') {
            satSetI = satSet.cosparIndex[`${gsSat.cospar}`];
            if (typeof gsSat.name != 'undefined') {
              if (typeof satData[satSetI].ON == 'undefined' || satData[satSetI].ON == 'TBA' || satData[satSetI].ON == 'Unknown' || satData[satSetI].ON.slice(0, 7) == 'PAYLOAD' || satData[satSetI].ON.slice(0, 6) == 'OBJECT') {
                satData[satSetI].ON = gsSat.name;
              }
            }
            if (typeof gsSat.lv != 'undefined') {
              if (typeof satData[satSetI].LV == 'undefined' || satData[satSetI].LV == 'U') {
                satData[satSetI].LV = gsSat.lv;
              }
            }
            if (typeof gsSat.ls != 'undefined') {
              if (typeof satData[satSetI].LS == 'undefined' || satData[satSetI].LS == 'U') {
                satData[satSetI].LS = gsSat.ls;
              }
            }
            if (typeof gsSatType[0].gsurl != 'undefined') satData[satSetI].URL = gsSatType[0].gsurl;
            if (typeof gsSatType[0].sdpow != 'undefined') satData[satSetI].Pw = gsSatType[0].sdpow;
            if (typeof gsSatType[0].sdtyp != 'undefined') satData[satSetI].P = gsSatType[0].sdtyp;
            if (typeof gsSatType[0].sdcon != 'undefined') satData[satSetI].Con = gsSatType[0].sdcon;
            if (typeof gsSatType[0].sdmas != 'undefined') satData[satSetI].DM = gsSatType[0].sdmas;
            if (typeof gsSatType[0].sdope != 'undefined') satData[satSetI].U = gsSatType[0].sdope;
            if (typeof gsSatType[0].sdlif != 'undefined') satData[satSetI].Li = gsSatType[0].sdlif;
          }
        }
      }
      uiManager.hideLoadingScreen();
    });
  });
};

satSet.searchCelestrak = (satNum, analsat) => {
  // If no Analyst Satellite specified find the first unused one
  if (typeof analsat == 'undefined') {
    for (var i = 15000; i < satData.length; i++) {
      if (satData[i].SCC_NUM >= 80000 && !satData[i].active) {
        analsat = i;
        break;
      }
    }
  } else {
    // Satnum to Id
    analsat = satSet.getIdFromObjNum(analsat);
  }

  let request = new XMLHttpRequest();
  request.open('GET', `php/get_data.php?type=c&sat=${satNum}`, true);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      let tles = JSON.parse(this.response).split('\n');
      let TLE1 = tles[1];
      let TLE2 = tles[2];
      satSet.insertNewAnalystSatellite(TLE1, TLE2, analsat);
    } else {
      // We reached our target server, but it returned an error
      console.warn('Celestrack request returned an error!');
    }
  };

  request.onerror = function () {
    console.warn('Celestrack request failed!');
  };

  request.send();

  // $.ajax({
  //     async:true,
  //     // dataType : 'jsonp',   //you may use jsonp for cross origin request
  //     crossDomain:true,
  //     url: `php/get_data.php?type=c&sat=${satNum}`,
  //     success: function(data) {
  //         let tles = data.split('\n');
  //         let TLE1 = tles[1];
  //         let TLE2 = tles[2];
  //         satSet.insertNewAnalystSatellite(TLE1, TLE2, analsat);
  //     }
  // });
};

satSet.searchN2yo = (satNum, analsat) => {
  // If no Analyst Satellite specified find the first unused one
  if (typeof analsat == 'undefined') {
    for (var i = 15000; i < satData.length; i++) {
      if (satData[i].SCC_NUM >= 80000 && !satData[i].active) {
        analsat = i;
        break;
      }
    }
  } else {
    // Satnum to Id
    analsat = satSet.getIdFromObjNum(analsat);
  }

  let request = new XMLHttpRequest();
  request.open('GET', `php/get_data.php?type=n&sat=${satNum}`, true);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      // Success!
      let tles = this.response.split('<div id="tle">')[1].split('<pre>')[1].split('\n');
      let TLE1 = tles[0];
      let TLE2 = tles[1];
      satSet.insertNewAnalystSatellite(TLE1, TLE2, analsat);
    } else {
      // We reached our target server, but it returned an error
      console.warn('N2YO request returned an error!');
    }
  };

  request.onerror = function () {
    console.warn('N2YO request failed!');
  };

  request.send();

  // $.ajax({
  //     async:true,
  //     // dataType : 'jsonp',   //you may use jsonp for cross origin request
  //     crossDomain:true,
  //     url: `php/get_data.php?type=n&sat=${satNum}`,
  //     success: function(data) {
  //         let tles = data.split('<div id="tle">')[1].split('\n');
  //         let TLE1 = tles[2];
  //         let TLE2 = tles[3];
  //         satSet.insertNewAnalystSatellite(TLE1, TLE2, analsat);
  //     }
  // });
};

satSet.insertNewAnalystSatellite = (TLE1, TLE2, analsat) => {
  if (satellite.altitudeCheck(TLE1, TLE2, timeManager.propOffset) > 1) {
    satCruncher.postMessage({
      typ: 'satEdit',
      id: analsat,
      active: true,
      TLE1: TLE1,
      TLE2: TLE2,
    });
    orbitManager.updateOrbitBuffer(analsat, true, TLE1, TLE2);
    let sat = satSet.getSat(analsat);
    sat.active = true;
    sat.OT = 1; // Default to Satellite
    uiManager.doSearch(sat.SCC_NUM.toString());
  } else {
    console.debug(TLE1);
    console.debug(TLE2);
    uiManager.toast(`New Analyst Satellite is Invalid!`, 'critical');
  }
};

satSet.updateRadarData = () => {
  for (let i = 0; i < radarDataManager.radarData.length; i++) {
    try {
      satData[radarDataManager.satDataStartIndex + i].isRadarData = true;
      satData[radarDataManager.satDataStartIndex + i].mId = parseInt(radarDataManager.radarData[i].m);
      satData[radarDataManager.satDataStartIndex + i].t = radarDataManager.radarData[i].t;
      satData[radarDataManager.satDataStartIndex + i].rcs = parseInt(radarDataManager.radarData[i].rc);
      satData[radarDataManager.satDataStartIndex + i].trackId = parseInt(radarDataManager.radarData[i].ti);
      satData[radarDataManager.satDataStartIndex + i].objectId = parseInt(radarDataManager.radarData[i].oi);
      satData[radarDataManager.satDataStartIndex + i].satId = parseInt(radarDataManager.radarData[i].si);
      satData[radarDataManager.satDataStartIndex + i].missileComplex = parseInt(radarDataManager.radarData[i].mc);
      satData[radarDataManager.satDataStartIndex + i].missileObject = parseInt(radarDataManager.radarData[i].mo);
      satData[radarDataManager.satDataStartIndex + i].azError = radarDataManager.radarData[i].ae;
      satData[radarDataManager.satDataStartIndex + i].elError = radarDataManager.radarData[i].ee;
      satData[radarDataManager.satDataStartIndex + i].dataType = radarDataManager.radarData[i].dataType;
    } catch (e) {
      // console.log(radarDataManager.radarData[i]);
    }
  }
  satSet.setColorScheme(settingsManager.currentColorScheme, true);
};

satSet.setSat = (i, satObject) => {
  if (!satData) return null;
  satData[i] = satObject;
  satData[i].velocity = satData[i].velocity == 0 ? {} : satData[i].velocity;
};
satSet.mergeSat = (satObject) => {
  if (!satData) return null;
  var i = satSet.getIdFromObjNum(satObject.SCC);
  satData[i].ON = satObject.ON;
  satData[i].C = satObject.C;
  satData[i].LV = satObject.LV;
  satData[i].LS = satObject.LS;
  satData[i].R = satObject.R;
  satData[i].URL = satObject.URL;
  satData[i].NOTES = satObject.NOTES;
  satData[i].TTP = satObject.TTP;
  satData[i].FMISSED = satObject.FMISSED;
  satData[i].ORPO = satObject.ORPO;
  satData[i].constellation = satObject.constellation;
  satData[i].associates = satObject.associates;
  satData[i].maneuver = satObject.maneuver;
};
satSet.vmagUpdate = (vmagObject) => {
  if (!satData) return null;
  var i = satSet.getIdFromObjNum(vmagObject.satid);
  try {
    satData[i].vmag = vmagObject.vmag;
  } catch (e) {
    // console.warn('Old Satellite in vmagManager: ' + vmagObject.satid);
  }
};

satSet.getSat = (i) => {
  db.log('satSet.getSat', true);
  if (!satData) return null;
  if (!satData[i]) return null;
  if (gotExtraData) {
    satData[i].inViewChange = false;
    if (typeof dotManager.inViewData != 'undefined' && typeof dotManager.inViewData[i] != 'undefined') {
      if (satData[i].inview !== dotManager.inViewData[i]) satData[i].inViewChange = true;
      satData[i].inview = dotManager.inViewData[i];
    } else {
      satData[i].inview = false;
      satData[i].inViewChange = false;
    }

    if (typeof dotManager.inSunData != 'undefined' && typeof dotManager.inSunData[i] != 'undefined') {
      if (satData[i].inSun !== dotManager.inSunData[i]) satData[i].inSunChange = true;
      satData[i].inSun = dotManager.inSunData[i];
    }

    // if (satData[i].velocity == 0) debugger;

    satData[i].velocity = typeof satData[i].velocity == 'undefined' ? {} : satData[i].velocity;
    satData[i].velocity.total = Math.sqrt(
      dotManager.velocityData[i * 3] * dotManager.velocityData[i * 3] + dotManager.velocityData[i * 3 + 1] * dotManager.velocityData[i * 3 + 1] + dotManager.velocityData[i * 3 + 2] * dotManager.velocityData[i * 3 + 2]
    );
    satData[i].velocity.x = dotManager.velocityData[i * 3];
    satData[i].velocity.y = dotManager.velocityData[i * 3 + 1];
    satData[i].velocity.z = dotManager.velocityData[i * 3 + 2];
    satData[i].position = {
      x: dotManager.positionData[i * 3],
      y: dotManager.positionData[i * 3 + 1],
      z: dotManager.positionData[i * 3 + 2],
    };
  }

  // Add Functions One Time
  if (typeof satData[i].isInSun == 'undefined') {
    satData[i].isInSun = () => {
      // Distances all in km
      let sunECI = sun.realXyz;

      // NOTE: Code is mashed to save memory when used on the whole catalog

      // Position needs to be relative to satellite NOT ECI
      // var distSatEarthX = Math.pow(-satData[i].position.x, 2);
      // var distSatEarthY = Math.pow(-satData[i].position.y, 2);
      // var distSatEarthZ = Math.pow(-satData[i].position.z, 2);
      // var distSatEarth = Math.sqrt(distSatEarthX + distSatEarthY + distSatEarthZ);
      // var semiDiamEarth = Math.asin(RADIUS_OF_EARTH/distSatEarth) * RAD2DEG;
      let semiDiamEarth = Math.asin(mathValue.RADIUS_OF_EARTH / Math.sqrt(Math.pow(-satData[i].position.x, 2) + Math.pow(-satData[i].position.y, 2) + Math.pow(-satData[i].position.z, 2))) * RAD2DEG;

      // Position needs to be relative to satellite NOT ECI
      // var distSatSunX = Math.pow(-satData[i].position.x + sunECI.x, 2);
      // var distSatSunY = Math.pow(-satData[i].position.y + sunECI.y, 2);
      // var distSatSunZ = Math.pow(-satData[i].position.z + sunECI.z, 2);
      // var distSatSun = Math.sqrt(distSatSunX + distSatSunY + distSatSunZ);
      // var semiDiamSun = Math.asin(RADIUS_OF_SUN/distSatSun) * RAD2DEG;
      let semiDiamSun = Math.asin(mathValue.RADIUS_OF_SUN / Math.sqrt(Math.pow(-satData[i].position.x + sunECI.x, 2) + Math.pow(-satData[i].position.y + sunECI.y, 2) + Math.pow(-satData[i].position.z + sunECI.z, 2))) * RAD2DEG;

      // Angle between earth and sun
      let theta =
        Math.acos(
          window.numeric.dot([-satData[i].position.x, -satData[i].position.y, -satData[i].position.z], [-satData[i].position.x + sunECI.x, -satData[i].position.y + sunECI.y, -satData[i].position.z + sunECI.z]) /
            (Math.sqrt(Math.pow(-satData[i].position.x, 2) + Math.pow(-satData[i].position.y, 2) + Math.pow(-satData[i].position.z, 2)) *
              Math.sqrt(Math.pow(-satData[i].position.x + sunECI.x, 2) + Math.pow(-satData[i].position.y + sunECI.y, 2) + Math.pow(-satData[i].position.z + sunECI.z, 2)))
        ) * RAD2DEG;

      // var isSun = false;

      // var isUmbral = false;
      if (semiDiamEarth > semiDiamSun && theta < semiDiamEarth - semiDiamSun) {
        // isUmbral = true;
        return 0;
      }

      // var isPenumbral = false;
      if (Math.abs(semiDiamEarth - semiDiamSun) < theta && theta < semiDiamEarth + semiDiamSun) {
        // isPenumbral = true;
        return 1;
      }

      if (semiDiamSun > semiDiamEarth) {
        // isPenumbral = true;
        return 1;
      }

      if (theta < semiDiamSun - semiDiamEarth) {
        // isPenumbral = true;
        return 1;
      }

      // if (!isUmbral && !isPenumbral) isSun = true;
      return 2;
    };
  }
  if (typeof satData[i].setRAE == 'undefined') {
    satData[i].setRAE = (rae) => {
      satData[i].rae = rae;
    };
  }
  if (typeof satData[i].getAltitude == 'undefined') {
    satData[i].getAltitude = () => {
      if (satData[i].missile) {
        return satellite.eci2ll(satData[i].position.x, satData[i].position.y, satData[i].position.z).height;
      } else {
        return satellite.altitudeCheck(satData[i].TLE1, satData[i].TLE2, timeManager.propOffset);
      }
    };
  }
  if (objectManager.isSensorManagerLoaded && typeof satData[i].getTEARR == 'undefined') {
    satData[i].getTEARR = (propTime, sensor) => {
      if (satData[i].missile) {
        return {
          inview: satData[i].inView,
        };
      }

      let currentTEARR = {}; // Most current TEARR data that is set in satellite object and returned.

      if (typeof sensor == 'undefined') {
        sensor = sensorManager.currentSensor;
      }
      // If sensor's observerGd is not set try to set it using it parameters
      if (typeof sensor.observerGd == 'undefined') {
        try {
          sensor.observerGd = {
            height: sensor.obshei,
            latitude: sensor.lat,
            longitude: sensor.long,
          };
        } catch (e) {
          throw 'observerGd is not set and could not be guessed.';
        }
        // If it didn't work, try again
        if (typeof sensor.observerGd.longitude == 'undefined') {
          try {
            sensor.observerGd = {
              height: sensor.alt,
              latitude: sensor.lat * mathValue.DEG2RAD,
              longitude: sensor.lon * mathValue.DEG2RAD,
            };
          } catch (e) {
            throw 'observerGd is not set and could not be guessed.';
          }
        }
      }

      // Set default timing settings. These will be changed to find look angles at different times in future.
      let satrec = satellite.twoline2satrec(satData[i].TLE1, satData[i].TLE2); // perform and store sat init calcs
      let now;
      if (typeof propTime != 'undefined') {
        now = propTime;
      } else {
        now = timeManager.propTime();
      }
      let j = timeManager.jday(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1, // NOTE:, satData[i] function requires months in range 1-12.
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      ); // Converts time to jday (TLEs use epoch year/day)
      j += now.getUTCMilliseconds() * mathValue.MILLISECONDS_PER_DAY;
      let gmst = satellite.gstime(j);

      let m = (j - satrec.jdsatepoch) * mathValue.MINUTES_PER_DAY;
      let positionEci = satellite.sgp4(satrec, m);

      try {
        let gpos = satellite.eciToGeodetic(positionEci.position, gmst);
        currentTEARR.alt = gpos.height;
        currentTEARR.lon = gpos.longitude;
        currentTEARR.lat = gpos.latitude;
        let positionEcf = satellite.eciToEcf(positionEci.position, gmst);
        let lookAngles = satellite.ecfToLookAngles(sensor.observerGd, positionEcf);
        currentTEARR.azimuth = lookAngles.azimuth * RAD2DEG;
        currentTEARR.elevation = lookAngles.elevation * RAD2DEG;
        currentTEARR.range = lookAngles.rangeSat;
      } catch (e) {
        currentTEARR.alt = 0;
        currentTEARR.lon = 0;
        currentTEARR.lat = 0;
        currentTEARR.azimuth = 0;
        currentTEARR.elevation = 0;
        currentTEARR.range = 0;
      }

      currentTEARR.inview = satellite.checkIsInFOV(sensor, {
        az: currentTEARR.azimuth,
        el: currentTEARR.elevation,
        range: currentTEARR.range,
      });

      satellite.setTEARR(currentTEARR);
      return currentTEARR;
    };
  }
  if (typeof satData[i].getDirection == 'undefined') {
    satData[i].getDirection = () => {
      let nowLat = satData[i].getTEARR().lat * RAD2DEG;
      let futureTime = timeManager.propTimeCheck(5000, timeManager.propTime());
      let futLat = satData[i].getTEARR(futureTime).lat * RAD2DEG;

      // TODO: Remove getTEARR References
      // let nowLat = satellite.eci2ll(satData[i].position.x,satData[i].position.y,satData[i].position.z).latitude;
      // let futureTime = timeManager.propTimeCheck(5000, timeManager.propTime());
      // let futureEci = satellite.getEci(satData[i], futureTime);
      // let futLat = satellite.eci2ll(futureEci.x,futureEci.y,futureEci.z).latitude;

      if (nowLat < futLat) return 'N';
      if (nowLat > futLat) return 'S';
      if (nowLat === futLat) {
        futureTime = timeManager.propTimeCheck(20000, timeManager.propTime());
        // futureTEARR = satData[i].getTEARR(futureTime);
        if (nowLat < futLat) return 'N';
        if (nowLat > futLat) return 'S';
      }
      console.warn('Sat Direction Calculation Error - By Pole?');
      return 'Error';
    };
  }

  return satData[i];
};
satSet.getSatInViewOnly = (i) => {
  if (!satData) return null;
  if (!satData[i]) return null;

  satData[i].inview = dotManager.inViewData[i];
  return satData[i];
};
satSet.getSatPosOnly = (i) => {
  if (!satData) return null;
  if (!satData[i]) return null;

  if (gotExtraData) {
    satData[i].position = {
      x: dotManager.positionData[i * 3],
      y: dotManager.positionData[i * 3 + 1],
      z: dotManager.positionData[i * 3 + 2],
    };
  }

  let sat = satData[i];
  return sat;
};
satSet.getSatExtraOnly = (i) => {
  if (!satData) return null;
  if (!satData[i]) return null;
  return satData[i];
};
satSet.getSatFromObjNum = (objNum) => {
  let satIndex = satSet.getIdFromObjNum(objNum);
  return satSet.getSat(satIndex);
};

satSet.getIdFromObjNum = (objNum) => {
  if (typeof satSet.sccIndex[`${objNum}`] !== 'undefined') {
    return satSet.sccIndex[`${objNum}`];
  } else {
    for (let i = 0; i < satData.length; i++) {
      if (parseInt(satData[i].SCC_NUM) == objNum) return i;
    }
    return null;
  }
};
satSet.getIdFromIntlDes = (intlDes) => {
  if (typeof satSet.cosparIndex[`${intlDes}`] !== 'undefined') {
    return satSet.cosparIndex[`${intlDes}`];
  } else {
    return null;
  }
};
satSet.getIdFromStarName = (starName) => {
  for (var i = 0; i < satData.length; i++) {
    if (satData[i].type === 'Star') {
      if (satData[i].name === starName) {
        return i;
      }
    }
  }
  return null;
};
satSet.getIdFromSensorName = (sensorName) => {
  if (typeof sensorName != 'undefined') {
    for (var i = 0; i < satData.length; i++) {
      if (satData[i].static === true && satData[i].missile !== true && satData[i].type !== 'Star') {
        if (satData[i].name === sensorName) {
          return i;
        }
      }
    }
  }
  try {
    var now = timeManager.propTime();

    var j = timeManager.jday(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    );
    j += now.getUTCMilliseconds() * 1.15741e-8; // days per millisecond

    var gmst = satellite.gstime(j);
    let cosLat = Math.cos(sensorManager.currentSensor.lat * mathValue.DEG2RAD);
    let sinLat = Math.sin(sensorManager.currentSensor.lat * mathValue.DEG2RAD);
    let cosLon = Math.cos(sensorManager.currentSensor.long * mathValue.DEG2RAD + gmst);
    let sinLon = Math.sin(sensorManager.currentSensor.long * mathValue.DEG2RAD + gmst);
    let sensor = {};
    sensor.position = {};
    sensor.name = 'Custom Sensor';
    sensor.position.x = (6371 + 0.25 + sensorManager.currentSensor.obshei) * cosLat * cosLon; // 6371 is radius of earth
    sensor.position.y = (6371 + 0.25 + sensorManager.currentSensor.obshei) * cosLat * sinLon;
    sensor.position.z = (6371 + 0.25 + sensorManager.currentSensor.obshei) * sinLat;
    // console.log('No Sensor Found. Using Current Sensor');
    // console.log(sensor);
    return sensor;
  } catch (e) {
    console.log(e);
    return null;
  }
};

var posVec4;
var satScreenPositionArray = {};
satSet.getScreenCoords = (i, pMatrix, camMatrix, pos) => {
  satScreenPositionArray.error = false;
  if (!pos) pos = satSet.getSatPosOnly(i).position;
  posVec4 = glm.vec4.fromValues(pos.x, pos.y, pos.z, 1);

  glm.vec4.transformMat4(posVec4, posVec4, camMatrix);
  glm.vec4.transformMat4(posVec4, posVec4, pMatrix);

  satScreenPositionArray.x = posVec4[0] / posVec4[3];
  satScreenPositionArray.y = posVec4[1] / posVec4[3];
  satScreenPositionArray.z = posVec4[2] / posVec4[3];

  satScreenPositionArray.x = (satScreenPositionArray.x + 1) * 0.5 * window.innerWidth;
  satScreenPositionArray.y = (-satScreenPositionArray.y + 1) * 0.5 * window.innerHeight;

  if (satScreenPositionArray.x >= 0 && satScreenPositionArray.y >= 0 && satScreenPositionArray.z >= 0 && satScreenPositionArray.z <= 1) {
    // Passed Test
  } else {
    satScreenPositionArray.error = true;
  }
};

satSet.searchYear = (year) => {
  var res = [];
  for (var i = 0; i < satData.length; i++) {
    if (typeof satData[i].TLE1 == 'undefined') continue;
    if (satData[i].TLE1.substring(9, 11) == year) {
      res.push(i);
    }
  }
  return res;
};

satSet.searchYearOrLess = (year) => {
  var res = [];
  for (var i = 0; i < satData.length; i++) {
    if (typeof satData[i].TLE1 == 'undefined') continue;
    if (year >= 59 && year < 100) {
      if (satData[i].TLE1.substring(9, 11) <= year && satData[i].TLE1.substring(9, 11) >= 59) {
        res.push(i);
      }
    } else {
      if (satData[i].TLE1.substring(9, 11) <= year || satData[i].TLE1.substring(9, 11) >= 59) {
        res.push(i);
      }
    }
  }
  return res;
};

satSet.searchNameRegex = (regex) => {
  var res = [];
  for (var i = 0; i < satData.length; i++) {
    if (regex.test(satData[i].ON)) {
      res.push(i);
    }
  }
  return res;
};
satSet.searchCountryRegex = (regex) => {
  var res = [];
  for (var i = 0; i < satData.length; i++) {
    if (regex.test(satData[i].C)) {
      res.push(i);
    }
  }
  return res;
};
satSet.searchAzElRange = (azimuth, elevation, range, inclination, azMarg, elMarg, rangeMarg, incMarg, period, periodMarg, rcs, rcsMarg, objtype) => {
  var isCheckAz = !isNaN(parseFloat(azimuth)) && isFinite(azimuth);
  var isCheckEl = !isNaN(parseFloat(elevation)) && isFinite(elevation);
  var isCheckRange = !isNaN(parseFloat(range)) && isFinite(range);
  var isCheckInclination = !isNaN(parseFloat(inclination)) && isFinite(inclination);
  var isCheckPeriod = !isNaN(parseFloat(period)) && isFinite(period);
  var isCheckRcs = !isNaN(parseFloat(rcs)) && isFinite(rcs);
  var isCheckAzMarg = !isNaN(parseFloat(azMarg)) && isFinite(azMarg);
  var isCheckElMarg = !isNaN(parseFloat(elMarg)) && isFinite(elMarg);
  var isCheckRangeMarg = !isNaN(parseFloat(rangeMarg)) && isFinite(rangeMarg);
  var isCheckIncMarg = !isNaN(parseFloat(incMarg)) && isFinite(incMarg);
  var isCheckPeriodMarg = !isNaN(parseFloat(periodMarg)) && isFinite(periodMarg);
  var isCheckRcsMarg = !isNaN(parseFloat(rcsMarg)) && isFinite(rcsMarg);
  objtype *= 1; // String to Number

  if (!isCheckEl && !isCheckRange && !isCheckAz && !isCheckInclination && !isCheckPeriod && !isCheckRcs) return; // Ensure there is a number typed.

  if (!isCheckAzMarg) {
    azMarg = 5;
  }
  if (!isCheckElMarg) {
    elMarg = 5;
  }
  if (!isCheckRangeMarg) {
    rangeMarg = 200;
  }
  if (!isCheckIncMarg) {
    incMarg = 1;
  }
  if (!isCheckPeriodMarg) {
    periodMarg = 0.5;
  }
  if (!isCheckRcsMarg) {
    rcsMarg = rcs / 10;
  }
  var res = [];

  var s = 0;
  for (var i = 0; i < satData.length; i++) {
    if (satData[i].static || satData[i].missile || !satData[i].active) {
      continue;
    }
    res.push(satData[i]);
    satellite.getTEARR(res[s]);
    res[s].azimuth = satellite.currentTEARR.azimuth;
    res[s].elevation = satellite.currentTEARR.elevation;
    res[s].range = satellite.currentTEARR.range;
    res[s].inview = satellite.currentTEARR.inview;
    s++;
  }

  if (!isCheckInclination && !isCheckPeriod) {
    res = checkInview(res);
  }

  if (objtype !== 0) {
    res = checkObjtype(res);
  }

  if (isCheckAz) {
    azimuth = azimuth * 1; // Convert azimuth to int
    azMarg = azMarg * 1;
    var minaz = azimuth - azMarg;
    var maxaz = azimuth + azMarg;
    res = checkAz(res, minaz, maxaz);
  }

  if (isCheckEl) {
    elevation = elevation * 1; // Convert elevation to int
    elMarg = elMarg * 1;
    var minel = elevation - elMarg;
    var maxel = elevation + elMarg;
    res = checkEl(res, minel, maxel);
  }

  if (isCheckRange) {
    range = range * 1; // Convert range to int
    rangeMarg = rangeMarg * 1;
    var minrange = range - rangeMarg;
    var maxrange = range + rangeMarg;
    res = checkRange(res, minrange, maxrange);
  }

  if (isCheckInclination) {
    inclination = inclination * 1; // Convert inclination to int
    incMarg = incMarg * 1;
    var minInc = inclination - incMarg;
    var maxInc = inclination + incMarg;
    res = checkInc(res, minInc, maxInc);
  }

  if (isCheckPeriod) {
    period = period * 1; // Convert period to int
    periodMarg = periodMarg * 1;
    var minPeriod = period - periodMarg;
    var maxPeriod = period + periodMarg;
    res = checkPeriod(res, minPeriod, maxPeriod);
  }

  if (isCheckRcs) {
    rcs = rcs * 1; // Convert period to int
    rcsMarg = rcsMarg * 1;
    var minRcs = rcs - rcsMarg;
    var maxRcs = rcs + rcsMarg;
    res = checkRcs(res, minRcs, maxRcs);
  }

  var checkInview = (possibles) => {
    var inviewRes = [];
    for (var i = 0; i < possibles.length; i++) {
      if (possibles[i].inview) {
        inviewRes.push(possibles[i]);
      }
    }
    return inviewRes;
  };

  var checkObjtype = (possibles) => {
    var objtypeRes = [];
    for (var i = 0; i < possibles.length; i++) {
      if (possibles[i].OT === objtype) {
        objtypeRes.push(possibles[i]);
      }
    }
    return objtypeRes;
  };

  var checkAz = (possibles, minaz, maxaz) => {
    var azRes = [];
    for (var i = 0; i < possibles.length; i++) {
      if (possibles[i].azimuth < maxaz && possibles[i].azimuth > minaz) {
        azRes.push(possibles[i]);
      }
    }
    return azRes;
  };
  var checkEl = (possibles, minel, maxel) => {
    var elRes = [];
    for (var i = 0; i < possibles.length; i++) {
      if (possibles[i].elevation < maxel && possibles[i].elevation > minel) {
        elRes.push(possibles[i]);
      }
    }
    return elRes;
  };
  var checkRange = (possibles, minrange, maxrange) => {
    var rangeRes = [];
    for (var i = 0; i < possibles.length; i++) {
      if (possibles[i].range < maxrange && possibles[i].range > minrange) {
        rangeRes.push(possibles[i]);
      }
    }
    return rangeRes;
  };
  // $('#findByLooks-results').text('');
  // IDEA: Intentionally doesn't clear previous searches. Could be an option later.
  var sccList = [];
  for (let i = 0; i < res.length; i++) {
    // $('#findByLooks-results').append(res[i].SCC_NUM + '<br />');
    if (i < res.length - 1) {
      $('#search').val($('#search').val() + res[i].SCC_NUM + ',');
    } else {
      $('#search').val($('#search').val() + res[i].SCC_NUM);
    }
    sccList.push(res[i].SCC_NUM);
  }
  uiManager.doSearch($('#search').val());
  // console.log(sccList);
  return res;
};

satSet.exportTle2Csv = () => {
  let catalogTLE2 = [];
  let satCat = satSet.getSatData();
  satCat.sort((a, b) => parseInt(a.SCC_NUM) - parseInt(b.SCC_NUM));
  for (let s = 0; s < satCat.length; s++) {
    let sat = satCat[s];
    if (typeof sat.TLE1 == 'undefined' || typeof sat.TLE2 == 'undefined') {
      continue;
    }
    if (sat.C == 'ANALSAT') continue;
    catalogTLE2.push({
      satId: sat.SCC_NUM,
      TLE1: sat.TLE1,
      TLE2: sat.TLE2,
      inclination: sat.inclination * RAD2DEG,
      eccentricity: sat.eccentricity,
      period: sat.period,
      raan: sat.raan * RAD2DEG,
      apogee: sat.apogee,
      perigee: sat.perigee,
      site: sat.LS,
      country: sat.C,
      name: sat.ON,
      mission: sat.M,
      purpose: sat.P,
      user: sat.U,
      rocket: sat.LV,
      contractor: sat.Con,
      dryMass: sat.DM,
      liftMass: sat.LM,
      lifeExpected: sat.Li,
      power: sat.Pw,
      visualMagnitude: sat.vmag,
      source1: sat.S1,
      source2: sat.S2,
      source3: sat.S3,
      source4: sat.S4,
      source5: sat.S5,
      source6: sat.S6,
      source7: sat.S7,
      source8: sat.URL,
    });
  }
  saveCsv(catalogTLE2, 'catalogInfo');
};
satSet.exportTle2Txt = () => {
  let catalogTLE2 = [];
  let satCat = satSet.getSatData();
  satCat.sort((a, b) => parseInt(a.SCC_NUM) - parseInt(b.SCC_NUM));
  for (let s = 0; s < satCat.length; s++) {
    let sat = satCat[s];
    if (typeof sat.TLE1 == 'undefined' || typeof sat.TLE2 == 'undefined') {
      continue;
    }
    if (sat.C == 'ANALSAT') continue;
    catalogTLE2.push(sat.TLE1);
    catalogTLE2.push(sat.TLE2);
  }
  catalogTLE2 = catalogTLE2.join('\n');
  var blob = new Blob([catalogTLE2], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(blob, 'TLE.txt');
};

satSet.setHover = (i) => {
  if (i === objectManager.hoveringSat) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, settingsManager.currentColorScheme.colorBuffer);
  // If Old Select Sat Picked Color it Correct Color
  if (objectManager.hoveringSat !== -1 && objectManager.hoveringSat !== objectManager.selectedSat) {
    gl.bufferSubData(gl.ARRAY_BUFFER, objectManager.hoveringSat * 4 * 4, new Float32Array(settingsManager.currentColorScheme.colorRuleSet(satSet.getSat(objectManager.hoveringSat)).color));
  }
  // If New Select Sat Picked Color it
  if (i !== -1 && i !== objectManager.selectedSat) {
    gl.bufferSubData(gl.ARRAY_BUFFER, i * 4 * 4, new Float32Array(settingsManager.hoverColor));
  }
  objectManager.setHoveringSat(i);

  satSet.setColorScheme(settingsManager.currentColorScheme, true);
};

satSet.selectSat = (i) => {
  if (i === objectManager.selectedSat) return;
  if (uiManager.isAnalysisMenuOpen && i != -1) {
    $('#anal-sat').val(satSet.getSat(i).SCC_NUM);
  }
  adviceList.satelliteSelected();
  satCruncher.postMessage({
    satelliteSelected: [i],
  });
  if (settingsManager.isMobileModeEnabled) uiManager.searchToggle(false);

  if (typeof meshManager !== 'undefined') {
    gl.bindBuffer(gl.ARRAY_BUFFER, settingsManager.currentColorScheme.colorBuffer);
    // If Old Select Sat Picked Color it Correct Color
    if (objectManager.selectedSat !== -1) {
      gl.bufferSubData(gl.ARRAY_BUFFER, objectManager.selectedSat * 4 * 4, new Float32Array(settingsManager.currentColorScheme.colorRuleSet(satSet.getSat(objectManager.selectedSat)).color));
    }
    // If New Select Sat Picked Color it
    if (i !== -1) {
      gl.bufferSubData(gl.ARRAY_BUFFER, i * 4 * 4, new Float32Array(settingsManager.selectedColor));
    }
  }

  objectManager.setSelectedSat(i);

  satSet.setColorScheme(settingsManager.currentColorScheme, true);

  if (objectManager.isSensorManagerLoaded && sensorManager.currentSensor.lat != null) {
    $('#menu-lookangles').removeClass('bmenu-item-disabled');
  }
  $('#menu-lookanglesmultisite').removeClass('bmenu-item-disabled');
  $('#menu-satview').removeClass('bmenu-item-disabled');
  $('#menu-map').removeClass('bmenu-item-disabled');
  $('#menu-editSat').removeClass('bmenu-item-disabled');
  $('#menu-sat-fov').removeClass('bmenu-item-disabled');
  $('#menu-newLaunch').removeClass('bmenu-item-disabled');
  $('#menu-breakup').removeClass('bmenu-item-disabled');
};

satSet.onCruncherReady = () => {
  satSet.queryStr = window.location.search.substring(1);
  // Anything else?
};

let getIdFromStarName = (starName) => satSet.getIdFromStarName(starName);
let getIdFromSensorName = (sensorName) => satSet.getIdFromSensorName(sensorName);
let getStar = (starName) => satSet.getSat(satSet.getIdFromStarName(starName));
let getSat = (id) => satSet.getSat(id);
let getSatData = () => satSet.getSatData();
let getMissileSatsLen = () => satSet.missileSats;
let setSat = (i, satObject) => satSet.setSat(i, satObject);
let getSatPosOnly = (id) => satSet.getSatPosOnly(id);

export { getIdFromSensorName, getIdFromStarName, getMissileSatsLen, getSat, getSatPosOnly, getSatData, getStar, satSet, satScreenPositionArray, setSat };
