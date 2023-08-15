// Generated by CodiumAI

import { keepTrackContainer } from "@app/js/container";
import { Singletons } from "@app/js/interfaces";
import * as getEl from "@app/js/lib/get-el";
import { DrawManager } from "@app/js/singletons/draw-manager";
import { MobileManager } from "@app/js/singletons/mobileManager";
import { SplashScreen } from "@app/js/static/splash-screen";

describe('SplashScreen_class', () => {
    // Tests that the loading screen is hidden immediately when running on mobile
    it('test_hide_splash_screen_mobile', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl');
        const checkMobileModeSpy = jest.spyOn(MobileManager, 'checkMobileMode');
        SplashScreen.hideSplashScreen();
        expect(getElSpy).toHaveBeenCalledTimes(1);
        expect(checkMobileModeSpy).toHaveBeenCalled();
    });

    // Tests that the loading screen is resized and hidden after a timeout when running on desktop
    it('test_hide_splash_screen_desktop', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl');
        const checkMobileModeSpy = jest.spyOn(MobileManager, 'checkMobileMode');
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const hideSplashScreenSpy = jest.spyOn(SplashScreen, 'hideSplashScreen');
        const drawManagerInstance = keepTrackContainer.get<DrawManager>(Singletons.DrawManager);
        drawManagerInstance.sceneManager.earth.isUseHiRes = true;
        drawManagerInstance.sceneManager.earth.isHiResReady = true;
        SplashScreen.hideSplashScreen();
        expect(getElSpy).toHaveBeenCalledTimes(2);
        expect(checkMobileModeSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).toHaveBeenCalled();
        expect(hideSplashScreenSpy).toHaveBeenCalledTimes(1);
    });

    // Tests that the loading screen waits and retries when hi-res earth is not ready
    it('test_hide_splash_screen_wait', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl');
        const checkMobileModeSpy = jest.spyOn(MobileManager, 'checkMobileMode');
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const hideSplashScreenSpy = jest.spyOn(SplashScreen, 'hideSplashScreen');
        const drawManagerInstance = keepTrackContainer.get<DrawManager>(Singletons.DrawManager);
        drawManagerInstance.sceneManager.earth.isUseHiRes = true;
        drawManagerInstance.sceneManager.earth.isHiResReady = false;
        SplashScreen.hideSplashScreen();
        expect(getElSpy).toHaveBeenCalledTimes(2);
        expect(checkMobileModeSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).toHaveBeenCalled();
        expect(hideSplashScreenSpy).toHaveBeenCalledTimes(2);
    });

    // Tests that loadStr() does nothing when the loader text element is not found
    it('test_load_str_element_not_found', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl').mockReturnValue(null);
        SplashScreen.loadStr('test');
        expect(getElSpy).toHaveBeenCalled();
    });

    // Tests that hideSplashScreen() hides the loading screen and displays content
    it('test_hide_splash_screen_displays_content', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl').mockReturnValue({ style: { display: '' } } as HTMLElement);
        const checkMobileModeSpy = jest.spyOn(MobileManager, 'checkMobileMode');
        const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
        const drawManagerInstance = keepTrackContainer.get<DrawManager>(Singletons.DrawManager);
        drawManagerInstance.sceneManager.earth.isUseHiRes = true;
        drawManagerInstance.sceneManager.earth.isHiResReady = true;
        SplashScreen.hideSplashScreen();
        expect(getElSpy).toHaveBeenCalled();
        expect(checkMobileModeSpy).toHaveBeenCalled();
        expect(setTimeoutSpy).toHaveBeenCalled();
        expect(getElSpy.mock.results[0].value.style.display).toBe('block');
    });

    // Tests that timeout functions fire
    it('test_timeout_functions', () => {
        jest.spyOn(getEl, 'getEl').mockReturnValue({ style: {}, classList: { add: jest.fn(), remove: jest.fn() } } as unknown as HTMLElement);
        SplashScreen.hideSplashScreen();
        jest.advanceTimersByTime(1000);
        expect(setTimeout).toHaveBeenCalledTimes(5);
    });

    // Tests branch if isMobileModeEnabled is true
    it('test_is_mobile_mode_enabled', () => {
        const getElSpy = jest.spyOn(getEl, 'getEl').mockReturnValue({ style: {}, classList: { add: jest.fn(), remove: jest.fn() } } as unknown as HTMLElement);
        MobileManager.checkMobileMode = jest.fn().mockReturnValue(true);
        settingsManager.isMobileModeEnabled = true;
        SplashScreen.hideSplashScreen();
        expect(getElSpy).toHaveBeenCalled();
    });
});
