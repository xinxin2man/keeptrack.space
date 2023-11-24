import 'echarts-gl';

import * as echarts from 'echarts';

import { clickAndDragWidth } from '@app/js/lib/click-and-drag';
import { getEl } from '@app/js/lib/get-el';
import { shake } from '@app/js/lib/shake';
import { slideInRight, slideOutLeft } from '@app/js/lib/slide';
import { createInc2AltScatterPlot, getInc2AltScatterData } from './components/plots/inc2AltScatterPlot';
import { createInc2LonScatterPlot, getInc2LonScatterData } from './components/plots/inc2LonScatterPlot';
import { createRicScatterPlot, getRicScatterData } from './components/plots/ricScatterPlot';
import { createTime2LonScatterPlot, getTime2LonScatterData } from './components/plots/time2LonScatterPlot';

import { SatObject } from '@app/js/interfaces';
import { keepTrackApi } from '@app/js/keepTrackApi';

import { adviceManagerInstance } from '@app/js/singletons/adviceManager';
import { PlotAnalysisBottomIcon } from './components/PlotAnalysisBottomIcon';
import { PlotAnalysisSideMenu } from './components/PlotAnalysisSideMenu';
import {
  helpBodyTextIncAltPlot,
  helpBodyTextIncLonPlot,
  helpBodyTextRicPlot,
  helpBodyTextTimeLonPlot,
  helpTitleTextIncAltPlot,
  helpTitleTextIncLonPlot,
  helpTitleTextRicPlot,
  helpTitleTextTimeLonPlot,
} from './help';

export let isPlotAnalyisMenuOpen3 = false;
export let isPlotAnalyisMenuOpen4 = false;
export let isPlotAnalyisMenuOpen5 = false;
export let isPlotAnalyisMenuOpen6 = false;
export let curChart3: echarts.ECharts;
export let curChart4: echarts.ECharts;
export let curChart5: echarts.ECharts;
export let curChart6: echarts.ECharts;

export const init = (): void => {
  // Add HTML
  keepTrackApi.register({
    event: 'uiManagerInit',
    cbName: 'plotAnalysis',
    cb: () => uiManagerInit(),
  });

  // Add JavaScript
  keepTrackApi.register({
    event: 'bottomMenuClick',
    cbName: 'plotAnalysis',
    cb: (iconName: string): void => bottomMenuClick(iconName),
  });

  keepTrackApi.register({
    event: 'hideSideMenus',
    cbName: 'plotAnalysis',
    cb: (): void => hideSideMenus(),
  });

  keepTrackApi.register({
    event: 'selectSatData',
    cbName: 'plotAnalysis',
    cb: selectSatData,
  });

  keepTrackApi.register({
    event: 'onHelpMenuClick',
    cbName: 'plotAnalysis',
    cb: onHelpMenuClick,
  });
};

export const onHelpMenuClick = (): boolean => {
  if (isPlotAnalyisMenuOpen3) {
    adviceManagerInstance.showAdvice(helpTitleTextRicPlot, helpBodyTextRicPlot);
    return true;
  }

  if (isPlotAnalyisMenuOpen4) {
    adviceManagerInstance.showAdvice(helpTitleTextIncLonPlot, helpBodyTextIncLonPlot);
    return true;
  }

  if (isPlotAnalyisMenuOpen5) {
    adviceManagerInstance.showAdvice(helpTitleTextTimeLonPlot, helpBodyTextTimeLonPlot);
    return true;
  }

  if (isPlotAnalyisMenuOpen6) {
    adviceManagerInstance.showAdvice(helpTitleTextIncAltPlot, helpBodyTextIncAltPlot);
    return true;
  }

  return false;
};

export const uiManagerInit = (): void => {
  getEl('left-menus').insertAdjacentHTML('beforeend', PlotAnalysisSideMenu);
  getEl('bottom-icons').insertAdjacentHTML('beforeend', PlotAnalysisBottomIcon);

  clickAndDragWidth(getEl('plot-analysis-menu3'), {
    maxWidth: 1200,
    minWidth: 500,
  });
};

/**
 * This function is called when the user clicks on a bottom icon
 * @param {string} iconName The name of the icon that was clicked
 * @returns {void}
 */
export const bottomMenuClick = (iconName: string): void => {
  switch (iconName) {
    case 'menu-plot-analysis3':
      onRicPlotBtnClick();
      break;
    case 'menu-plot-analysis4':
      onInc2LonPlotBtnClick();
      break;
    case 'menu-plot-analysis5':
      onTime2LonPlotBtnClick();
      break;
    case 'menu-plot-analysis6':
      onInc2AltPlotBtnClick();
      break;
    default:
      break;
  }
};

export const onRicPlotBtnClick = () => {
  const catalogManagerInstance = keepTrackApi.getCatalogManager();
  const uiManagerInstance = keepTrackApi.getUiManager();

  if (catalogManagerInstance.secondarySat === -1) {
    uiManagerInstance.toast(`Select a Secondary Satellite First!`, 'caution');
    shake(getEl('menu-plot-analysis3'));
    return;
  }

  if (catalogManagerInstance.selectedSat === -1 || catalogManagerInstance.lastSelectedSat() === -1) {
    uiManagerInstance.toast(`Select a Primary Satellite First!`, 'caution');
    shake(getEl('menu-plot-analysis3'));
    return;
  }

  if (isPlotAnalyisMenuOpen3) {
    uiManagerInstance.hideSideMenus();
    isPlotAnalyisMenuOpen3 = false;
    return;
  } else {
    uiManagerInstance.hideSideMenus();
    slideInRight(getEl('plot-analysis-menu3'), 1000);
    isPlotAnalyisMenuOpen3 = true;

    const chartDom3 = getEl('plot-analysis-chart3');

    curChart3 = createRicScatterPlot(getRicScatterData(), isPlotAnalyisMenuOpen3, curChart3, chartDom3);
    setTimeout(() => {
      curChart3.resize();
    }, 1000);
    getEl('menu-plot-analysis3').classList.add('bmenu-item-selected');
    return;
  }
};

export const onInc2LonPlotBtnClick = () => {
  const uiManagerInstance = keepTrackApi.getUiManager();

  if (isPlotAnalyisMenuOpen4) {
    uiManagerInstance.hideSideMenus();
    isPlotAnalyisMenuOpen4 = false;
    return;
  } else {
    uiManagerInstance.hideSideMenus();
    slideInRight(getEl('plot-analysis-menu4'), 1000);
    isPlotAnalyisMenuOpen4 = true;

    const chartDom4 = <HTMLCanvasElement>(<unknown>getEl('plot-analysis-chart4'));
    let existInstance = echarts.getInstanceByDom(chartDom4);

    if (!existInstance) {
      curChart4 = createInc2LonScatterPlot(getInc2LonScatterData(), isPlotAnalyisMenuOpen4, curChart4, chartDom4);
    }
    setTimeout(() => {
      curChart4.resize();
    }, 1000);
    getEl('menu-plot-analysis4').classList.add('bmenu-item-selected');
    return;
  }
};

export const onInc2AltPlotBtnClick = () => {
  const uiManagerInstance = keepTrackApi.getUiManager();

  if (isPlotAnalyisMenuOpen6) {
    uiManagerInstance.hideSideMenus();
    isPlotAnalyisMenuOpen6 = false;
    return;
  } else {
    uiManagerInstance.hideSideMenus();
    slideInRight(getEl('plot-analysis-menu6'), 1000);
    isPlotAnalyisMenuOpen6 = true;

    const chartDom6 = <HTMLCanvasElement>(<unknown>getEl('plot-analysis-chart6'));
    let existInstance = echarts.getInstanceByDom(chartDom6);

    if (!existInstance) {
      curChart6 = createInc2AltScatterPlot(getInc2AltScatterData(), isPlotAnalyisMenuOpen6, curChart6, chartDom6);
    }
    setTimeout(() => {
      curChart6.resize();
    }, 1000);
    getEl('menu-plot-analysis6').classList.add('bmenu-item-selected');
    return;
  }
};

export const onTime2LonPlotBtnClick = () => {
  const uiManagerInstance = keepTrackApi.getUiManager();

  if (isPlotAnalyisMenuOpen5) {
    uiManagerInstance.hideSideMenus();
    isPlotAnalyisMenuOpen5 = false;
    return;
  } else {
    uiManagerInstance.hideSideMenus();
    slideInRight(getEl('plot-analysis-menu5'), 1000);
    isPlotAnalyisMenuOpen5 = true;

    const chartDom5 = <HTMLCanvasElement>(<unknown>getEl('plot-analysis-chart5'));
    let existInstance = echarts.getInstanceByDom(chartDom5);

    if (!existInstance) {
      curChart5 = createTime2LonScatterPlot(getTime2LonScatterData(), isPlotAnalyisMenuOpen5, curChart5, chartDom5);
    }
    setTimeout(() => {
      curChart5.resize();
    }, 1000);
    getEl('menu-plot-analysis5').classList.add('bmenu-item-selected');
    return;
  }
};

/**
 * This function is called when the user clicks on a menu item
 * @returns {void}
 */
export const hideSideMenus = (): void => {
  slideOutLeft(getEl('plot-analysis-menu3'), 1000);
  getEl('menu-plot-analysis3').classList.remove('bmenu-item-selected');
  isPlotAnalyisMenuOpen3 = false;
  slideOutLeft(getEl('plot-analysis-menu4'), 1000);
  getEl('menu-plot-analysis4').classList.remove('bmenu-item-selected');
  isPlotAnalyisMenuOpen4 = false;
  slideOutLeft(getEl('plot-analysis-menu5'), 1000);
  getEl('menu-plot-analysis5').classList.remove('bmenu-item-selected');
  isPlotAnalyisMenuOpen5 = false;
  slideOutLeft(getEl('plot-analysis-menu6'), 1000);
  getEl('menu-plot-analysis6').classList.remove('bmenu-item-selected');
  isPlotAnalyisMenuOpen6 = false;
};

/**
 * Update Plots When Satellite Clicked
 * - This does not apply to all plots
 * @param {SatObject} _sat - The satellite object (currently unused)
 * @param {number} satId - The id of the satellite
 * @returns {void}
 */
export const selectSatData = (_sat: SatObject, satId: number): void => {
  if (satId === -1) {
    hideSideMenus();
    return;
  }

  const catalogManagerInstance = keepTrackApi.getCatalogManager();
  if (catalogManagerInstance.secondarySat !== -1 && isPlotAnalyisMenuOpen3) {
    getEl('menu-plot-analysis3').classList.add('bmenu-item-selected');
    const chartDom3 = getEl('plot-analysis-chart3');
    curChart3 = createRicScatterPlot(getRicScatterData(), isPlotAnalyisMenuOpen3, curChart3, chartDom3);
  }
};
