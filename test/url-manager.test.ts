// Generated by CodiumAI

import { keepTrackApi } from '@app/js/keepTrackApi';
import { UrlManager } from '@app/js/static/url-manager';
import { setupStandardEnvironment } from './environment/standard-env';

describe('UrlManager_class', () => {
  beforeEach(() => {
    setupStandardEnvironment();
    jest.resetAllMocks();
    keepTrackApi.callbacks.onKeepTrackReady = [];
  });

  // Tests that URL parameters with valid values are parsed correctly
  it('test_parse_valid_params', () => {
    const url = 'http://localhost:8080/?sat=25544&search=ISS&rate=1.0&date=1630512000000';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const expectedSelectedSat = 25544;
    const expectedCurrentSearch = 'ISS';
    const expectedPropRate = 1;
    const expectedStaticOffset = 1630512000000 - Date.now();
    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    const timeManagerInstance = keepTrackApi.getTimeManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromObjNum = (objNum: number) => objNum;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(catalogManagerInstance.setSelectedSat).toHaveBeenCalledWith(expectedSelectedSat);
    expect(uiManagerInstance.doSearch).toHaveBeenCalledWith(expectedCurrentSearch);
    expect(timeManagerInstance.propRate).toBe(expectedPropRate);
    expect(timeManagerInstance.staticOffset).toBe(expectedStaticOffset);
  });

  // Tests that intldes parameter with valid value is parsed correctly
  it('test_parse_valid_params', () => {
    const url = 'http://localhost:8080/?intldes=1988-064A';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const expectedSelectedSat = 10;
    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromIntlDes = () => 10;
    catalogManagerInstance.getSat = () => ({ id: 10, sccNum: '25544', active: true }) as any;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(catalogManagerInstance.setSelectedSat).toHaveBeenCalledWith(expectedSelectedSat);
  });

  // Tests that URL parameters valid but satellite not found
  it('test_parse_valid_params_sat_not_found', () => {
    const url = 'http://localhost:8080/?intldes=1988-064A';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    uiManagerInstance.toast = jest.fn();
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromIntlDes = () => null;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(uiManagerInstance.toast).toHaveBeenCalled();
  });

  // Tests that URL parameters valid but satellite not found2
  it('test_parse_valid_params_sat_not_found2', () => {
    const url = 'http://localhost:8080/?sat=99999';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    uiManagerInstance.toast = jest.fn();
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromObjNum = () => null;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(uiManagerInstance.toast).toHaveBeenCalled();
  });

  // Tests that URL parameters with empty parameters are parsed correctly
  it('test_parse_empty_params', () => {
    const url = 'http://localhost:8080/';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const expectedSelectedSat = 25544;
    const expectedCurrentSearch = 'ISS';
    const expectedPropRate = 1;
    const expectedStaticOffset = 1630512000000 - Date.now();
    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    const timeManagerInstance = keepTrackApi.getTimeManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromObjNum = (objNum: number) => objNum;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(catalogManagerInstance.setSelectedSat).not.toHaveBeenCalledWith(expectedSelectedSat);
    expect(uiManagerInstance.doSearch).not.toHaveBeenCalledWith(expectedCurrentSearch);
    expect(timeManagerInstance.propRate).not.toBe(expectedPropRate);
    expect(timeManagerInstance.staticOffset).not.toBe(expectedStaticOffset);
  });

  // Tests that URL parameters with invalid parameters are not parsed
  it('test_parse_invalid_params', () => {
    const url = 'http://localhost:8080/?sat=invalid&search=ISS&rate=invalid&date=invalid';
    delete window.location;
    // @ts-ignore
    window.location = new URL(url);

    const expectedSelectedSat = 25544;
    const expectedCurrentSearch = 'ISS';
    const expectedPropRate = 1;
    const expectedStaticOffset = 1630512000000 - Date.now();
    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const uiManagerInstance = keepTrackApi.getUiManager();
    const timeManagerInstance = keepTrackApi.getTimeManager();
    jest.spyOn(window.history, 'replaceState').mockImplementation(() => {});
    catalogManagerInstance.setSelectedSat = jest.fn();
    catalogManagerInstance.getIdFromObjNum = (objNum: number) => objNum;
    uiManagerInstance.doSearch = jest.fn();
    uiManagerInstance.searchManager.hideResults = jest.fn();

    UrlManager.parseGetVariables();
    keepTrackApi.methods.onKeepTrackReady();

    expect(catalogManagerInstance.setSelectedSat).not.toHaveBeenCalledWith(expectedSelectedSat);
    expect(uiManagerInstance.doSearch).toHaveBeenCalledWith(expectedCurrentSearch);
    expect(timeManagerInstance.propRate).not.toBe(expectedPropRate);
    expect(timeManagerInstance.staticOffset).not.toBe(expectedStaticOffset);
  });

  // Test missile params are parsed correctly
  it.skip('test_parse_missile_params', () => {
    // TODO: Implement
  });
});
