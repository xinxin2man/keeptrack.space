import { SatObject, SensorObject } from './keepTrack';
declare const jest: any;

export const defaultSat: SatObject = {
  id: 0,
  active: true,
  SCC_NUM: '00005',
  intlDes: '1998-AEF',
  C: 'ISS',
  LS: 'TTMTR',
  LV: 'Proton-K',
  ON: 'ISS (ZARYA)',
  OT: 1,
  TLE1: '1 25544U 98067A   21203.40407588  .00003453  00000-0  71172-4 0  9991',
  TLE2: '2 25544  51.6423 168.5744 0001475 184.3976 313.3642 15.48839820294053',
  R: '99.0524',
  URL: 'http://www.esa.int/export/esaHS/ESAI2X0VMOC_iss_0.html',
  O: 'National Aeronautics and Space Administration (NASA)/Multinational',
  U: 'Government',
  P: 'Space Science',
  LM: '',
  DM: '',
  Pw: '',
  Li: 30,
  Con: 'Boeing Satellite Systems (prime)/Multinational',
  M: 'Final size of a Boeing 747; first component.',
  S1: 'http://www.esa.int/export/esaHS/ESAI2X0VMOC_iss_0.html',
  S2: '',
  S3: 'http://www.boeing.com/defense-space/space/spacestation/overview/',
  S4: '',
  S5: '',
  S6: '',
  S7: '',
  inclination: 51.6423,
  lon: 168.5744,
  perigee: 1475,
  apogee: 184.3976,
  period: 313.3642,
  meanMotion: 15.48839820294053,
  semimajorAxis: 21203.40407588,
  eccentricity: 0.00003453,
  raan: 0,
  argPe: 0,
  inView: 1,
  velocity: {
    total: 0,
    x: 0,
    y: 0,
    z: 0,
  },
  getTEARR: () => ({
    lon: 168.5744,
    lat: 51.6423,
    alt: 1475,
  }),
  getAltitude: () => 0,
  isInSun: () => true,
  getDirection: () => 'N',
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  static: false,
};

export const defaultSensor: SensorObject = {
  alt: 0.060966,
  beamwidth: 2,
  changeObjectInterval: 1000,
  country: 'United States',
  lat: 41.754785,
  linkAehf: true,
  linkWgs: true,
  lon: -70.539151,
  name: 'Cape Cod AFS, Massachusetts',
  observerGd: { lat: 0.7287584767123405, lon: -1.2311404365114507, alt: 0.060966 },
  obsmaxaz: 227,
  obsmaxel: 85,
  obsmaxrange: 5556,
  obsminaz: 347,
  obsminel: 3,
  obsminrange: 200,
  shortName: 'COD',
  staticNum: 0,
  sun: 'No Impact',
  type: 'Phased Array Radar',
  url: 'http://www.radartutorial.eu/19.kartei/01.oth/karte004.en.html',
  volume: false,
  zoom: 'leo',
};

export const useMockWorkers = (): void => {
  class Worker {
    url: any;
    // eslint-disable-next-line no-unused-vars
    onmessage: (msg: any) => { data: {} };
    constructor(stringUrl: any) {
      this.url = stringUrl;
      this.onmessage = (msg: any) => {
        console.debug(msg);
        return {
          data: {},
        };
      };
    }

    postMessage(msg: any) {
      if (msg.dat) {
        this.onmessage({
          data: {
            extraData: JSON.stringify([defaultSat, defaultSensor]),
            satPos: [0, 0, 0, 0, 0, 0],
            satVel: [0, 0, 0, 0, 0, 0],
          },
        });
      }
      this.onmessage({
        data: {
          satPos: [0, 0, 0, 0, 0, 0],
          satVel: [0, 0, 0, 0, 0, 0],
        },
      });
    }
  }

  (<any>window).Worker = Worker;
};

export const keepTrackApiStubs = {
  programs: {
    adviceManager: {
      adviceList: {
        satViewDisabled: jest.fn(),
        editSatDisabled: jest.fn(),
        survFenceDisabled: jest.fn(),
        bubbleDisabled: jest.fn(),
        satFovDisabled: jest.fn(),
        planetariumDisabled: jest.fn(),
        mapDisabled: jest.fn(),
        breakupDisabled: jest.fn(),
        ssnLookanglesDisabled: jest.fn(),
        sensorInfoDisabled: jest.fn(),
        lookanglesDisabled: jest.fn(),
        satelliteSelected: jest.fn(),
      },
      adviceCount: {
        socrates: 0,
      },
      showAdvice: jest.fn(),
      adviceArray: <any[]>[],
    },
    mainCamera: {
      camMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      cameraType: {
        current: 1,
        Default: 0,
        Offset: 1,
        FixedToSat: 2,
        Fps: 3,
        Planetarium: 4,
        Satellite: 5,
        Astronomy: 6,
      },
      camSnap: jest.fn(),
      changeZoom: jest.fn(),
      latToPitch: jest.fn(),
      longToYaw: jest.fn(),
      calculate: jest.fn(),
      update: jest.fn(),
      getCamDist: jest.fn(),
      localRotateDif: {
        pitch: 0,
        yaw: 0,
      },
      zoomLevel: () => 0,
      zoomTarget: () => 0,
      autoRotate: jest.fn(),
      fts2default: jest.fn(),
      panCurrent: {
        x: 0,
        y: 0,
        z: 0,
      },
      getForwardVector: jest.fn(),
    },
    ColorScheme: {
      objectTypeFlags: {
        payload: true,
        rocketBody: true,
        debris: true,
        inFOV: true,
      },
      reloadColors: jest.fn(),
    },
    drawManager: {
      pMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      resizeCanvas: jest.fn(),
      glInit: jest.fn(),
      gl: global.mocks.glMock,
      selectSatManager: {
        selectSat: jest.fn(),
      },
      postProcessingManager: {
        init: jest.fn(),
        programs: {
          occlusion: {
            attrSetup: jest.fn(),
            attrOff: jest.fn(),
            uniformSetup: jest.fn(),
          },
        },
      },
      sceneManager: {
        sun: {
          initGodrays: jest.fn(),
          pos: [0, 0, 0],
          sunvar: {
            gmst: 0,
          },
          godrays: {
            frameBuffer: {},
          },
        },
        earth: {
          init: jest.fn(),
          loadHiRes: jest.fn(),
          loadHiResNight: jest.fn(),
          lightDirection: [0, 0, 0],
        },
      },
    },
    dotsManager: {
      inSunData: new Float32Array([0, 0, 0]),
      inViewData: new Float32Array([0, 0, 0]),
      init: jest.fn(),
      starIndex1: 0,
      pickReadPixelBuffer: [0, 0, 0],
      pickingDotSize: '1.0',
      gl: null,
      emptyMat4: null,
      positionBuffer: null,
      sizeBuffer: null,
      loaded: true,
      pMvCamMatrix: null,
      drawProgram: null,
      positionBufferOneTime: null,
      positionData: new Float32Array([0, 0, 0]),
      pickingProgram: {
        aPos: null,
      },
      pickingColorBuffer: null,
      drawShaderCode: { frag: null, vert: null },
      pickingShaderCode: { vert: null, frag: null },
      pickingTexture: null,
      pickingRenderBuffer: null,
      velocityData: new Float32Array([0, 0, 0]),
      drawDivisor: null,
      satDataLenInDraw: null,
      satDataLenInDraw3: null,
      orbitalSats3: null,
      drawI: null,
      draw: jest.fn(),
      drawGpuPickingFrameBuffer: jest.fn(),
      updatePositionBuffer: jest.fn(),
      updatePMvCamMatrix: jest.fn(),
      sizeBufferOneTime: null,
      sizeData: null,
      starIndex2: null,
      pickingColorData: null,
      pickingFrameBuffer: null,
      createPickingProgram: jest.fn(),
      sensorMarkerArray: new Float32Array([0, 0, 0]),
    },
    groups: null,
    groupsManager: {
      Canada: null,
      Japan: null,
      France: null,
      China: null,
      India: null,
      Israel: null,
      Russia: null,
      UnitedKingdom: null,
      UnitedStates: null,
      SpaceStations: {
        sats: [
          { satId: 1, SCC_NUM: '25544' },
          { satId: 1, SCC_NUM: '25544' },
        ],
        updateOrbits: jest.fn(),
      },
      clearSelect: jest.fn(),
      createGroup: () => ({
        sats: [
          { satId: 1, SCC_NUM: '25544' },
          { satId: 1, SCC_NUM: '25544' },
        ],
        updateOrbits: jest.fn(),
      }),
      selectGroup: jest.fn(),
      selectedGroup: [1, 2, 3],
    },
    lineManager: {
      draw: jest.fn(),
      create: jest.fn(),
      clear: jest.fn(),
      removeStars: jest.fn(),
      getLineListLen: jest.fn(),
      drawWhenSelected: jest.fn(),
    },
    missileManager: {
      getMissileTEARR: jest.fn(),
    },
    objectManager: {
      isLaunchSiteManagerLoaded: true,
      lastSelectedSat: jest.fn(),
      extractCountry: jest.fn(),
      setHoveringSat: jest.fn(),
      setLasthoveringSat: jest.fn(),
      extractLaunchSite: () => ({ site: 'test', sitec: 'test' }),
      extractLiftVehicle: jest.fn(),
      launchSiteManager: {
        launchSiteList: ['AFWTR'],
      },
      selectedSat: -1,
      setSelectedSat: jest.fn(),
      staticSet: {
        id: 0,
      },
      analSatSet: [defaultSat],
      radarDataSet: {
        id: 0,
      },
      missileSet: {
        id: 0,
      },
      fieldOfViewSet: {
        id: 0,
      },
      satLinkManager: {
        showLinks: jest.fn(),
        aehf: [25544],
        dscs: [25544],
        wgs: [25544],
        starlink: [25544],
        sbirs: [25544],
      },
    },
    meshManager: {
      draw: jest.fn(),
    },
    orbitManager: {
      orbitWorker: {
        postMessage: jest.fn(),
      },
      setSelectOrbit: jest.fn(),
      draw: jest.fn(),
      clearSelectOrbit: jest.fn(),
      updateOrbitBuffer: jest.fn(),
      clearInViewOrbit: jest.fn(),
      removeInViewOrbit: jest.fn(),
      historyOfSatellitesPlay: jest.fn(),
      shader: {
        uColor: 1,
      },
    },
    satellite: {
      currentTEARR: {
        az: 0,
        el: 0,
        rng: 0,
      },
      sgp4: () => [0, 0, 0],
      setobs: jest.fn(),
      distance: jest.fn(),
      setTEARR: jest.fn(),
      eci2ll: () => ({ lat: 0, lon: 0 }),
      altitudeCheck: jest.fn(),
      calculateSensorPos: jest.fn(),
      createTle: jest.fn(),
      degreesLong: (num: number) => num,
      degreesLat: (num: number) => num,
      currentEpoch: () => ['21', '150'],
      getOrbitByLatLon: () => ['1 25544U 98067A   21203.40407588  .00003453  00000-0  71172-4 0  9991', '2 25544  51.6423 168.5744 0001475 184.3976 313.3642 15.48839820294053'],
      nextpassList: () => [new Date().getTime(), new Date().getTime() + 1],
      twoline2satrec: () => ({ jdsatepoch: 2458000.5 }),
      getRae: () => [0, 0, 0],
      checkIsInFOV: () => true,
      findCloseObjects: () => '',
      eci2Rae: jest.fn(),
      findBestPasses: () => jest.fn(),
      findNearbyObjectsByOrbit: () => jest.fn(),
      nextpass: () => '2021-09-21 20:00:00Z',
      getDops: () => ({
        HDOP: 0,
        VDOP: 0,
        TDOP: 0,
        GDOP: 0,
        PDOP: 0,
      }),
      updateDopsTable: jest.fn(),
      map: () => ({ lat: 0, lon: 0 }),
      getTEARR: jest.fn(),
    },
    satSet: {
      satCruncher: {
        postMessage: jest.fn(),
        onmessage: jest.fn(),
      },
      getIdFromEci: jest.fn(),
      selectSat: jest.fn(),
      satData: [defaultSat, defaultSat, { type: 'Star', name: 'test' }, { type: 'Phased Array Radar', static: true, name: 'test' }],
      convertIdArrayToSatnumArray: jest.fn(),
      getIdFromObjNum: () => 0,
      getSensorFromSensorName: () => 0,
      getSatExtraOnly: () => defaultSat,
      getSatFromObjNum: () => defaultSat,
      getSat: () => defaultSat,
      getIdFromStarName: jest.fn(),
      initGsData: jest.fn(),
      setColorScheme: jest.fn(),
      getSatPosOnly: () => defaultSat,
      getSatInView: () => jest.fn(),
      getScreenCoords: () => ({
        error: false,
      }),
      getSatVel: () => jest.fn(),
      getSatInSun: () => jest.fn(),
      getSatInViewOnly: () => defaultSat,
      default: '',
      insertNewAnalystSatellite: jest.fn(),
      searchYear: () => [25544],
      searchYearOrLess: () => [25544],
      getIdFromIntlDes: jest.fn(),
      searchNameRegex: () => [25544],
      searchCountryRegex: () => [25544],
      queryStr: 'search=25544&intldes=1998-A&sat=25544&misl=0,0,0&date=1234567&rate=1&hires=true',
      cosparIndex: { '1998-AB': 5 },
      numSats: 1,
    },
    searchBox: {
      hideResults: jest.fn(),
      fillResultBox: jest.fn(),
      doArraySearch: jest.fn(),
      doSearch: jest.fn(),
      getLastResultGroup: jest.fn(),
      isHovering: jest.fn(),
      isResultBoxOpen: jest.fn(),
    },
    sensorFov: {
      enableFovView: jest.fn(),
    },
    sensorManager: {
      checkSensorSelected: () => false,
      currentSensor: {
        alt: 0,
        lat: 0,
        lon: 0,
        shortName: 'COD',
      },
      sensorListUS: [defaultSensor, defaultSensor],
      setCurrentSensor: jest.fn(),
    },
    starManager: {
      init: jest.fn(),
      findStarsConstellation: jest.fn(),
      drawConstellations: jest.fn(),
    },
    timeManager: {
      propOffset: 0,
      getPropOffset: () => 0,
      propTimeVar: new Date(2020, 0, 1),
      propRate: 0,
      selectedDate: 0,
      getDayOfYear: () => 0,
      updatePropTime: jest.fn(),
      jday: () => 0,
      dateFromDay: () => new Date(2020, 0, 1),
      setNow: jest.fn(),
      changePropRate: jest.fn(),
      changeStaticOffset: jest.fn(),
      calculateSimulationTime: () => new Date(2020, 0, 1),
      getOffsetTimeObj: () => new Date(2020, 0, 1),
      synchronize: jest.fn(),
    },
    uiManager: {
      hideSideMenus: jest.fn(),
      toast: jest.fn(),
      colorSchemeChangeAlert: jest.fn(),
      bottomIconPress: jest.fn(),
      legendColorsChange: jest.fn(),
      doSearch: jest.fn(),
      loadStr: jest.fn(),
      searchToggle: jest.fn(),
      legendMenuChange: jest.fn(),
      clearRMBSubMenu: jest.fn(),
      updateURL: jest.fn(),
      keyHandler: jest.fn(),
    },
    watchlist: {
      updateWatchlist: jest.fn(),
    },
  },
};

keepTrackApiStubs.programs.groupsManager.Canada = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.Japan = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.France = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.China = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.India = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.Israel = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.Russia = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.UnitedKingdom = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groupsManager.UnitedStates = keepTrackApiStubs.programs.groupsManager.SpaceStations;
keepTrackApiStubs.programs.groups = keepTrackApiStubs.programs.groupsManager;
