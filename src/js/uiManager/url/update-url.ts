import { keepTrackApi } from '@app/js/api/keepTrackApi';
import { searchBox } from '../search/searchBox';

export const updateURL = () => {
  if (settingsManager.isDisableUrlBar) return;
  const { objectManager, satSet, timeManager } = keepTrackApi.programs;

  const arr = window.location.href.split('?');
  let url = arr[0];
  const paramSlices = [];

  if (objectManager.selectedSat !== -1 && typeof satSet.getSatExtraOnly(objectManager.selectedSat).sccNum != 'undefined') {
    paramSlices.push('sat=' + satSet.getSatExtraOnly(objectManager.selectedSat).sccNum);
  }
  const currentSearch = searchBox.getCurrentSearch();
  if (currentSearch !== '') {
    paramSlices.push('search=' + currentSearch);
  }
  if (timeManager.propRate < 0.99 || timeManager.propRate > 1.01) {
    paramSlices.push('rate=' + timeManager.propRate);
  }

  if (timeManager.staticOffset < -1000 || timeManager.staticOffset > 1000) {
    paramSlices.push('date=' + (timeManager.dynamicOffsetEpoch + timeManager.staticOffset).toString());
  }

  if (paramSlices.length > 0) {
    url += '?' + paramSlices.join('&');
  }

  window.history.replaceState(null, 'Keeptrack', url);
};
