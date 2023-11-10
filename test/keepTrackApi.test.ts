import { expect } from '@jest/globals';
import { SatObject } from '../src/js/interfaces';
import { isThisNode, keepTrackApi } from '../src/js/keepTrackApi';
import { defaultSat } from './environment/apiMocks';

test(`keepTrackApi Unit Testing`, () => {
  expect(() => {
    keepTrackApi.register({
      method: 'test',
      cbName: 'test',
      cb: () => console.log('test'),
    });
  }).toThrow(Error);

  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  expect(() => {
    keepTrackApi.unregister({ method: 'test', cbName: 'test' });
  }).toThrow(Error);

  expect(() => {
    keepTrackApi.unregister({ method: 'selectSatData', cbName: 'test2' });
  }).toThrow(Error);

  keepTrackApi.unregister({ method: 'selectSatData', cbName: 'test' });

  keepTrackApi.register({
    method: 'updateSelectBox',
    cbName: 'test',
    cb: (sat: SatObject) => console.log(sat),
  });

  keepTrackApi.register({
    method: 'onCruncherReady',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'onCruncherMessage',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'uiManagerInit',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'uiManagerOnReady',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'bottomMenuClick',
    cbName: 'test',
    cb: (name) => console.log(name),
  });

  keepTrackApi.register({
    method: 'hideSideMenus',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'nightToggle',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'orbitManagerInit',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'drawManagerLoadScene',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'drawOptionalScenery',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'updateLoop',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'rmbMenuActions',
    cbName: 'test',
    cb: (str) => console.log(str),
  });

  keepTrackApi.register({
    method: 'updateDateTime',
    cbName: 'test',
    cb: (str) => console.log(str),
  });

  keepTrackApi.register({
    method: 'uiManagerFinal',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'rightBtnMenuAdd',
    cbName: 'test',
    cb: () => console.log('test'),
  });

  keepTrackApi.register({
    method: 'selectSatData',
    cbName: 'test',
    cb: (sat, satId) => console.log(`${sat} - ${satId}`),
  });

  keepTrackApi.methods.updateSelectBox('test');
  keepTrackApi.methods.onCruncherReady();
  keepTrackApi.methods.onCruncherMessage();
  keepTrackApi.methods.uiManagerInit();
  keepTrackApi.methods.uiManagerOnReady();
  keepTrackApi.methods.bottomMenuClick('test');
  keepTrackApi.methods.hideSideMenus();

  // let emptyTexture: WebGLTexture;
  // keepTrackApi.methods.nightToggle(keepTrackApi.programs.drawManager.gl, emptyTexture, emptyTexture);
  keepTrackApi.methods.orbitManagerInit();
  keepTrackApi.methods.drawManagerLoadScene();
  keepTrackApi.methods.drawOptionalScenery();
  keepTrackApi.methods.updateLoop();
  keepTrackApi.methods.rmbMenuActions('test');
  keepTrackApi.methods.updateDateTime(new Date());
  keepTrackApi.methods.uiManagerFinal();
  keepTrackApi.methods.rightBtnMenuAdd();
  keepTrackApi.methods.selectSatData(defaultSat, 0);
});

describe(`keepTrackApi.html`, () => {
  test(`keepTrackApi.html Good HTML`, () => {
    expect(() => {
      keepTrackApi.html`<div id="about-menu" class="side-menu-parent start-hidden text-select">`;
    }).not.toThrow(Error);
  });

  test(`keepTrackApi.html Bad HTML`, () => {
    expect(() => keepTrackApi.html(<TemplateStringsArray>(<unknown>'A'))).toThrow(Error);
  });
});

describe('externalApi.isThisJest', () => {
  test('0', () => expect(() => isThisNode()).not.toThrow());
  test('1', () => expect(isThisNode()).toMatchSnapshot());
});
