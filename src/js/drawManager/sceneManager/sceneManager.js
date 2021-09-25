/**
 * /////////////////////////////////////////////////////////////////////////////
 *
 * @Copyright (C) 2016-2021 Theodore Kruczek
 * @Copyright (C) 2020 Heather Kruczek
 *
 * KeepTrack is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * KeepTrack is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with
 * KeepTrack. If not, see <http://www.gnu.org/licenses/>.
 *
 * /////////////////////////////////////////////////////////////////////////////
 */

// This file should contain all of the webgl code for generating non .obj meshes
import * as glm from '@app/js/lib/external/gl-matrix.js';

import { LineFactory } from './line-factory.js';
import { Moon } from './moon.js';
import { earth } from './earth.js';
import { keepTrackApi } from '@app/js/api/externalApi';
import { sun } from './sun.js';

const sceneManager = {
  classes: {
    Moon: Moon,
  },
  earth: earth,
  sun: sun,
};

export { LineFactory, sceneManager };
