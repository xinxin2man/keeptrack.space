import { keepTrackApi } from '../keepTrackApi';
import { GroupType, ObjectGroup } from './object-group';

/**
 * /*! /////////////////////////////////////////////////////////////////////////////
 *
 * https://keeptrack.space
 *
 * @Copyright (C) 2016-2024 Theodore Kruczek
 * @Copyright (C) 2020-2024 Heather Kruczek
 *
 * KeepTrack is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * KeepTrack is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * KeepTrack. If not, see <http://www.gnu.org/licenses/>.
 *
 * /////////////////////////////////////////////////////////////////////////////
 */

export class GroupsManager {
  groupList: Record<string, ObjectGroup> = {};
  selectedGroup: ObjectGroup = null;
  stopUpdatingInViewSoon: boolean;

  private changeGroup_(group: ObjectGroup): ObjectGroup {
    this.selectedGroup = group;

    return this.selectedGroup;
  }

  selectGroup(group: ObjectGroup): void {
    this.changeGroup_(group);
    group.updateOrbits();
    const colorSchemeManagerInstance = keepTrackApi.getColorSchemeManager();

    colorSchemeManagerInstance.setToGroupColorScheme();

    this.stopUpdatingInViewSoon = false;
  }

  // eslint-disable-next-line class-methods-use-this
  selectGroupNoOverlay(): void {
    settingsManager.isGroupOverlayDisabled = true;

    const colorSchemeManagerInstance = keepTrackApi.getColorSchemeManager();

    colorSchemeManagerInstance.setColorScheme(colorSchemeManagerInstance.group);
  }

  clearSelect(): void {
    this.changeGroup_(null);
    settingsManager.isGroupOverlayDisabled = false;
    this.stopUpdatingInViewSoon = true;
  }

  /**
   * Including the name parameter creates a cached version of the object
   *
   * Do not include a name if the group is temporary or will change
   */
  createGroup(type: GroupType, data: any, name?: string): ObjectGroup {
    // Seee if this group already exists and return it
    if (name) {
      if (this.groupList[name]) {
        return this.groupList[name];
      }
    }

    const group = new ObjectGroup(type, data);

    // If the group was named, add it to the cache
    if (name) {
      this.groupList[name] = group;
    }

    return group;
  }

  init() {
    this.selectedGroup = null;
    this.stopUpdatingInViewSoon = false;
    this.groupList = {};
  }
}
