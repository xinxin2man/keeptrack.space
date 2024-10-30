import { DetailedSatellite, Milliseconds } from 'ootk';

import { keepTrackApi } from '../keepTrackApi';

export class DemoManager {
  private readonly UPDATE_INTERVAL_ = <Milliseconds>3000;
  private readonly IS_RANDOM_ = true;
  private lastTime_ = <Milliseconds>0;
  public satellite = 0;

  public update(): void {
    const satData = keepTrackApi.getCatalogManager().objectCache;
    const colorSchemeManagerInstance = keepTrackApi.getColorSchemeManager();

    const realTime = <Milliseconds>Date.now();

    if (realTime - this.lastTime_ < this.UPDATE_INTERVAL_) {
      return;
    }

    this.lastTime_ = realTime;
    const catalogManagerInstance = keepTrackApi.getCatalogManager();
    const activeSats = catalogManagerInstance.objectCache.filter((sat) => sat.isSatellite() && sat.active) as DetailedSatellite[];
    const lastSatId = activeSats[activeSats.length - 1].id;

    for (this.satellite; this.satellite < lastSatId;) {
      if (this.IS_RANDOM_) {
        this.satellite = Math.floor(Math.random() * lastSatId);
      }

      const sat = satData[this.satellite] as DetailedSatellite;

      if (
        !sat.isSatellite() ||
        colorSchemeManagerInstance.isPayloadOff(sat) ||
        colorSchemeManagerInstance.isRocketBodyOff(sat) ||
        colorSchemeManagerInstance.isDebrisOff(sat) ||
        colorSchemeManagerInstance.isInViewOff(sat)
      ) {
        continue;
      }

      keepTrackApi.getHoverManager().setHoverId(this.satellite);
      keepTrackApi.getOrbitManager().setSelectOrbit(this.satellite);
      this.satellite++;
      break;
    }
  }
}