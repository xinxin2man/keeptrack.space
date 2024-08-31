/**
 * /*! /////////////////////////////////////////////////////////////////////////////
 *
 * launch-calendar.ts is a plugin for viewing the launch calendar on Gunter's Space Page.
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

import { openColorbox } from '@app/lib/colorbox';
import { getEl } from '@app/lib/get-el';

import { KeepTrackPlugin } from '../KeepTrackPlugin';

import calendarPng from '@public/img/icons/calendar.png';

export class LaunchCalendar extends KeepTrackPlugin {
  dependencies_ = [];
  bottomIconImg = calendarPng;
  isForceHideSideMenus = true;

  bottomIconCallback = () => {
    if (this.isMenuButtonActive) {
      settingsManager.isPreventColorboxClose = true;
      setTimeout(() => {
        settingsManager.isPreventColorboxClose = false;
      }, 2000);
      const year = new Date().getFullYear();

      openColorbox(`https://space.skyrocket.de/doc_chr/lau${year}.htm`, {
        callback: this.closeColorbox_.bind(this),
      });
    }
  };

  private closeColorbox_() {
    if (this.isMenuButtonActive) {
      this.isMenuButtonActive = false;
      getEl(this.bottomIconElementName).classList.remove('bmenu-item-selected');
    }
  }
}

