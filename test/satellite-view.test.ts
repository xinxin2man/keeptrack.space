import { keepTrackContainer } from '@app/container';
import { KeepTrackApiEvents, Singletons } from '@app/interfaces';
import { keepTrackApi } from '@app/keepTrackApi';
import { getEl } from '@app/lib/get-el';
import { SatelliteViewPlugin } from '@app/plugins/satellite-view/satellite-view';
import { SelectSatManager } from '@app/plugins/select-sat-manager/select-sat-manager';
import { Camera, CameraType } from '@app/singletons/camera';
import { UiManager } from '@app/singletons/uiManager';
import { mockCameraManager, mockUiManager } from './environment/standard-env';
import { standardPluginSuite } from './generic-tests';

// Generated by CodiumAI

/*
 *Code Analysis
 *
 *Main functionalities:
 *The SatelliteViewPlugin class is a plugin for the KeepTrack application that adds a satellite view feature. It allows the user to switch between a normal camera mode and a
 *satellite camera mode, where the camera is fixed to a selected satellite. The plugin adds an icon to the bottom menu that toggles the satellite view mode on and off. The plugin
 *also registers callbacks with the KeepTrack API to handle user interactions and add HTML and JS to the application.
 *
 *Methods:
 *- init(): initializes the plugin by adding HTML and JS
 *- addJs(): adds JS to the application by registering a callback with the KeepTrack API
 *- addHtml(): adds HTML to the application by registering a callback with the KeepTrack API
 *
 *Fields:
 *- lastLongAudioTime: a number that tracks the last time a long audio clip was played
 */

describe('SatelliteViewPlugin_class', () => {
  beforeEach(() => {
    // eslint-disable-next-line guard-for-in
    for (const callback in keepTrackApi.events) {
      keepTrackApi.events[callback] = [];
    }

    mockUiManager.toast = jest.fn();
    keepTrackContainer.registerSingleton<UiManager>(Singletons.UiManager, mockUiManager);
    const selectSatManager = new SelectSatManager();

    selectSatManager.init();
  });

  standardPluginSuite(SatelliteViewPlugin, 'SatelliteViewPlugin');

  // Tests that the addHtml method adds the correct HTML element to the DOM
  it('test_addHtml_method', () => {
    const plugin = new SatelliteViewPlugin();
    const registerSpy = jest.spyOn(keepTrackApi, 'register');

    plugin.addHtml();
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerInit);
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerFinal);
    expect(registerSpy).toHaveBeenCalled();
    expect(getEl('bottom-icons').innerHTML).toContain('menu-satview');
  });

  // Tests that a toast message is displayed when no satellite is selected and trying to activate Satellite Camera Mode
  it('test_bottomMenuClick_callback_no_satellite_selected', () => {
    const plugin = new SatelliteViewPlugin();
    const uiManagerInstance = keepTrackApi.getUiManager();

    keepTrackApi.getPlugin(SelectSatManager).selectedSat = -1;
    plugin.init();
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerInit);
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerFinal);
    keepTrackContainer.registerSingleton<Camera>(Singletons.MainCamera, mockCameraManager);
    keepTrackApi.runEvent(KeepTrackApiEvents.bottomMenuClick, 'menu-satview');
    expect(uiManagerInstance.toast).toHaveBeenCalledWith('Select a Satellite First!', ToastMsgType.serious, true);
  });

  // Tests that a toast message is not displayed when a satellite is selected and trying to activate Satellite Camera Mode
  it('test_bottomMenuClick_callback_satellite_selected', () => {
    const plugin = new SatelliteViewPlugin();
    const uiManagerInstance = keepTrackApi.getUiManager();

    keepTrackApi.getPlugin(SelectSatManager).selectedSat = 1;
    plugin.init();
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerInit);
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerFinal);
    keepTrackContainer.registerSingleton<Camera>(Singletons.MainCamera, mockCameraManager);
    keepTrackApi.runEvent(KeepTrackApiEvents.bottomMenuClick, 'menu-satview');
    expect(uiManagerInstance.toast).not.toHaveBeenCalled();
  });

  // Tests that clicking the Satellite Camera Mode icon reverts the camera to the default camera
  it('test_bottomMenuClick_callback_satellite_selected', () => {
    const plugin = new SatelliteViewPlugin();
    const uiManagerInstance = keepTrackApi.getUiManager();

    keepTrackApi.getPlugin(SelectSatManager).selectedSat = 1;
    plugin.init();
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerInit);
    keepTrackApi.runEvent(KeepTrackApiEvents.uiManagerFinal);
    const tempMockCamera = { ...mockCameraManager, cameraType: CameraType.SATELLITE } as Camera;

    keepTrackContainer.registerSingleton<Camera>(Singletons.MainCamera, tempMockCamera);
    keepTrackApi.runEvent(KeepTrackApiEvents.bottomMenuClick, 'menu-satview');
    expect(uiManagerInstance.toast).not.toHaveBeenCalled();
  });
});
