import { keepTrackApi } from '@app/keepTrackApi';

interface LocalizationInformation {
  plugins: {
    [pluginName: string]: {
      bottomIconLabel?: string;
      title?: string;
      helpBody?: string;
    };
  };
}

export const English: LocalizationInformation = {
  plugins: {
    SensorListPlugin: {
      bottomIconLabel: 'Sensors',
      title: 'Sensor List Menu',
      helpBody: keepTrackApi.html`The Sensors menu allows you to select a sensor for use in calculations and other menu's functions.
      Sensors are in groups based on the networks they primarily support.
      On the left side of the menu is the name of the sensor and on the right side is the country/organization that owns it.
      <br><br>
      Selecting an "All...Sensors" option will select all sensors in that group.
      This is useful for visualizing the networks coverage, but currently does not work for all calculations.
      If you are trying to calculate look angles for a network it is best to use the multi-site look angles tool or
      to use look angles for each of the individual sensors in the network.
      <br><br>
      Sensors on this list include Mechanical and Phased Array Radars, in addition to Optical sensors:
      <ul style="margin-left: 40px;">
        <li>
          Phased Array Radars typically are limited to Low Earth Orbit (LEO).
        </li>
        <li>
          Mechanical Radars can be used for both LEO and Geostationary Orbit (GEO).
        </li>
        <li>
          Optical sensors are typically used for GEO, but can also be used for LEO.
        </li>
        <li>
          Optical sensors are limited to night time observations in clear skies, whereas radars can be used for both day and night.
        </li>
      </ul>
      <br>
      Sensor information is based on publicly available data and can be verified in the Sensor Info menu.
      If you have public data on additional sensors or corrections to existing sensor information please contact me at
      <a href="mailto:admin@keeptrack.space">admin@keeptrack.space</a>.`,
    },
    SensorInfoPlugin: {
      bottomIconLabel: 'Sensor Info',
      title: 'Sensor Info Menu',
      helpBody: keepTrackApi.html`
      Sensor Info provides information about the currently selected sensor.
      The information is based on publicly available data and may not always be 100% accurate.
      If you have public data on additional sensors or corrections to existing sensor information please contact me at
      <a href="mailto:admin@keeptrack.space">admin@keeptrack.space</a>.
      <br><br>
      The information provided includes:
      <ul style="margin-left: 40px;">
        <li>
          Sensor Name
        </li>
        <li>
          Sensor Owner
        </li>
        <li>
          Sensor Type
        </li>
        <li>
          Sensor Field of View
        </li>
      </ul>
      <br>
      Additionally, lines can be quickly created from the sensor to the sun or moon from this menu.`,
    },
    CustomSensorPlugin: {
      bottomIconLabel: 'Custom Sensor',
      title: 'Custom Sensor Menu',
      helpBody: keepTrackApi.html`
      This allows you to create a custom sensor for use in calculations and other menu's functions.
      This can be a completely original sensor or a modification of an existing sensor.
      <br><br>
      After setting the latitude, longitude, and altitude of the sensor, you can set the sensor's field of view.
      Selecting telescope will create a 360 degree field of view with an elevation mask of 10 degrees and unlimited range.
      Deselecting the telescope option will allow you to set the field of view manually.
      <br><br>
      If you are trying to edit an existing sensor, you can select it from the sensor list first and the custom sensor will be updated with the selected sensor's information.`,
    },
    LookAnglesPlugin: {
      bottomIconLabel: 'Look Angles',
      title: 'Look Angles Menu',
      helpBody: keepTrackApi.html`
      The Look Angles menu allows you to calculate the range, azimuth, and elevation angles between a sensor and a satellite.
      A satellite and sensor must first be selected before the menu can be used.
      <br><br>
      The toggle only rise and set times will only calculate the rise and set times of the satellite.
      This is useful for quickly determining when a satellite will be visible to a sensor.
      <br><br>
      The search range can be modified by changing the length and interval options.`,
    },
    MultiSiteLookAnglesPlugin: {
      bottomIconLabel: 'Multi-Site Looks',
      title: 'Multi-Site Look Angles Menu',
      helpBody: keepTrackApi.html`
      The Multi-Site Look Angles menu allows you to calculate the range, azimuth, and elevation angles between a satellite and multiple sensors.
      A satellite must first be selected before the menu can be used.
      <br><br>
      By default the menu will calculate the look angles for all sensors in the Space Surveillance Netowrk.
      If you would like to calculate the look angles for additional sensors, you can export a csv file at the bottom of the menu.
      The csv file will contain look angles for all sensors.
      <br><br>
      Clicking on a row in the table will select the sensor and change the simulation time to the time of the look angle.`,
    },
    SensorTimeline: {
      bottomIconLabel: 'Sensor Timeline',
      title: 'Sensor Timeline Menu',
      helpBody: keepTrackApi.html`
      The Sensor Timeline menu shows when a list of sensors have visibility of one satellite.
      The timeline is color-coded to show the quality of the pass.
      Red is a bad pass, yellow is an average pass, and green is a good pass. Click on a pass to change the sensor and time to that pass.
      <br><br>
      The timeline can be modified by changing the start and end time of the simulation.
      Additionally, the timeline can be modified by changing the length and interval options.`,
    },
    SatelliteTimeline: {
      bottomIconLabel: 'Satellite Timeline',
      title: 'Satellite Timeline Menu',
      helpBody: keepTrackApi.html`
      The Satellite Timeline menu shows when a single sensor has visibility of a list of satellites.
      The timeline is color-coded to show the quality of the pass.
      Red is a bad pass, yellow is an average pass, and green is a good pass. Click on a pass to change the satellite and time to that pass.
      <br><br>
      The timeline can be modified by changing the start and end time of the simulation.
      Additionally, the timeline can be modified by changing the length and interval options.`,
    },
    WatchlistPlugin: {
      bottomIconLabel: 'Watchlist',
      title: 'Watchlist Menu',
      helpBody: keepTrackApi.html`
      The Watchlist menu allows you to create a list of priority satellites to track.
      This allows you to quickly retrieve the satellites you are most interested in.
      The list is saved in your browser's local storage and will be available the next time you visit the site.
      <br><br>
      When satellites on the watchlist enter the selected sensor's field of view a notification will be displayed,
      a line will be drawn from the sensor to the satellite, and the satellite's number will be displayed on the globe.
      <br><br>
      The overlay feature relies on the watchlist being populated.`,
    },
    WatchlistOverlay: {
      bottomIconLabel: 'Overlay',
      title: 'Overlay Menu',
      helpBody: keepTrackApi.html`
      <p>
        The Watchlist Overlay shows the next pass time for each satellite in your watchlist. The overlay is updated every 10 seconds.
      </p>
      <p>
        The overlay is color coded to show the time to the next pass. The colors are as follows:
      </p>
      <ul>
        <li>Yellow - In View</li>
        <li>Blue - Time to Next Pass is up to 30 minutes after the current time or 10 minutes before the current time</li>
        <li>White - Any future pass not fitting the above requirements</li>
      </ul>
      <p>
        Clicking on a satellite in the overlay will center the map on that satellite.
      </p>`,
    },
    ReportsPlugin: {
      bottomIconLabel: 'Reports',
      title: 'Reports Menu',
      helpBody: keepTrackApi.html`The Reports Menu is a collection of tools to help you analyze and understand the data you are viewing.`,
    },
    PolarPlotPlugin: {
      bottomIconLabel: 'Polar Plot',
      title: 'Polar Plot Menu',
      helpBody: keepTrackApi.html`The Polar Plot Menu is used to generate a 2D polar plot of the satellite's azimuth and elevation over time.`,
    },
    NextLaunchesPlugin: {
      bottomIconLabel: 'Next Launches',
      title: 'Next Launches Menu',
      helpBody: keepTrackApi.html`The Next Launches Menu pulls data from <a href="https://thespacedevs.com/" target="_blank">The Space Devs</a> to display upcoming launches.`,
    },
    FindSatPlugin: {
      bottomIconLabel: 'Find Satellite',
      title: 'Find Satellite Menu',
      helpBody: keepTrackApi.html`The Find Satellite Menu is used for finding satellites by orbital parameters or satellite characteristics.
      <br><br>
      For most parameters, you type in the target value on the left and then a margin of error on the right.
      For example, if you wanted to find all satellites in a 51-52 degree inclination, you can type 51.5 in the left box and 0.5 in the right box.
      The search will then find all satellites within those inclinations and display them in the search bar.
      `,
    },
    ShortTermFences: {
      bottomIconLabel: 'Short Term Fence',
      title: 'Short Term Fences (STF) Menu',
      helpBody: keepTrackApi.html`The Short Term Fences (STF) Menu is used for visualizing sensor search boxes.
      <br><br>
      This is unlikely to be very helpful unless you own/operate a sensor with a search box functionality.`,
    },
    Collissions: {
      bottomIconLabel: 'Collisions',
      title: 'Collisions Menu',
      helpBody: keepTrackApi.html`The Collisions Menu shows satellites with a high probability of collision.
      <br><br>
      Clicking on a row will select the two satellites involved in the collision and change the time to the time of the collision.`,
    },
    TrackingImpactPredict: {
      bottomIconLabel: 'Reentry Prediction',
      title: 'Tracking and Impact Prediction Menu',
      helpBody: keepTrackApi.html`The Tracking and Impact Prediction (tip) menu displays the latest tracking and impact prediction messages for satellites.
      The table shows the following columns:<br><br>
      <b>NORAD</b>: The NORAD catalog ID of the satellite.<br><br>
      <b>Decay Date</b>: The date of the predicted decay of the satellite.<br><br>
      <b>Latitude</b>: The latitude of the satellite.<br><br>
      <b>Longitude</b>: The longitude of the satellite.<br><br>
      <b>Window (min)</b>: The time window in minutes for the prediction.<br><br>
      <b>Next Report</b>: The date of the next report.<br><br>
      <b>High Interest?</b>: Whether the satellite is of high interest.<br><br>

      All data for reentries is sourced from the Tracking and Impact Prediction (TIP) messages provided by the US Space Command (USSPACECOM).
      `,
    },
    Breakup: {
      bottomIconLabel: 'Create Breakup',
      title: 'Breakup Menu',
      helpBody: keepTrackApi.html`The Breakup Menu is a tool for simulating the breakup of a satellite.
      <br><br>
      By modifying duplicating and modifying a satellite's orbit we can model the breakup of a satellite.
      After selecting a satellite and opening the menu, the user can select:
      <ul style="margin-left: 40px;">
        <li>Inclination Variation</li>
        <li>RAAN Variation</li>
        <li>Period Variation</li>
        <li>Number of Breakup Pieces</li>
      </ul>
      The larger the variation the bigger the spread in the simulated breakup. The default variations are sufficient to simulate a breakup with a reasonable spread.`,
    },
    DebrisScreening: {
      bottomIconLabel: 'Debris Screening',
      title: 'Debris Screening Menu',
      helpBody: keepTrackApi.html`The Debris Screening menu is used to generate a list of debris objects that could potentially be seen by a satellite.
      The list is generated by calculating the orbital parameters of the debris objects and comparing them to the orbital parameters of the satellite.
      The user can choose to generate the list using either the TLE or the SGP4 propagator. The user can also choose to filter the list by the debris object's size and the debris
      object's magnitude. The user can also choose to filter the list by the debris object's size and the debris object's magnitude. The user can also choose to generate the list
      using either the TLE or the SGP4 propagator. The user can also choose to filter the list by the debris object's size and the debris object's magnitude.`,
    },
    EditSat: {
      bottomIconLabel: 'Edit Satellite',
      title: 'Edit Satellite Menu',
      helpBody: keepTrackApi.html`The Edit Satellite Menu is used to edit the satellite data.
      <br><br>
      <ul>
         <li>
             Satellite SCC# - A unique number assigned to each satellite by the US Space Force.
         </li>
           <li>
              Epoch Year - The year of the satellite's last orbital update.
          </li>
          <li>
              Epoch Day - The day of the year of the satellite's last orbital update.
          </li>
          <li>
              Inclination - The angle between the satellite's orbital plane and the equatorial plane.
          </li>
          <li>
              Right Ascension - The angle between the ascending node and the satellite's position at the time of the last orbital update.
          </li>
          <li>
              Eccentricity - The amount by which the satellite's orbit deviates from a perfect circle.
          </li>
          <li>
              Argument of Perigee - The angle between the ascending node and the satellite's closest point to the earth.
          </li>
          <li>
              Mean Anomaly - The angle between the satellite's position at the time of the last orbital update and the satellite's closest point to the earth.
          </li>
          <li>
              Mean Motion - The rate at which the satellite's mean anomaly changes.
          </li>
      </ul>`,
    },
    NewLaunch: {
      bottomIconLabel: 'New Launch',
      title: 'New Launch Menu',
      helpBody: keepTrackApi.html`The New Launch Menu is used for generating notional orbital launches by modifying existing satellites with similar parameters.
      <br><br>
      After selecting a satellite, you can select a launch location and a north/south azimuth.
      The selected satellite will be modified to align it with the launch site.
      The clock is then changed to 00:00:00 to represent relative time after the launch.
      This can be helpful in calculating sensor coverage relative to launch time.
      The objects relationship with other orbital objects will be incorrect.`,
    },
    Missile: {
      bottomIconLabel: 'Missile',
      title: 'Missile Menu',
      helpBody: keepTrackApi.html`The Missile Menu is used for generating notional missile launches between countries.
      <br><br>
      When you using submarine launched missiles, the launch point is a custom latitude and longitude. When you are using land based missiles, the launch point is a fix latitude
      and longitude based on open source reporting.
      <br><br>
      In addition to custom missiles, a few predefined scenarios involving hundreds of missiles are available.
      <br><br>
      All missile launches are notional and are not intended to represent real world events. The launch trajectories are all based on the same ballistic model, but use different
      minimum and maximum ranges.
      `,
    },
    StereoMap: {
      bottomIconLabel: 'Stereo Map',
      title: 'Stereographic Map Menu',
      helpBody: keepTrackApi.html`The Stereographic Map Menu is used for visualizing satellite ground traces in a stereographic projection.
      <br/><br/>
      You can click on a spot along the ground trace to change the time of the simulation to when the satellite reaches that spot.
      <br/><br/>
      The yellow dots indicate when the satellite is in view of the sensor. The red dots indicate when the satellite is not in view of the sensor. The dot closest to the satellite
      is the current time.`,
    },
    SensorFov: {
      bottomIconLabel: 'Sensor FOV',
    },
    SensorFence: {
      bottomIconLabel: 'Sensor Fence',
    },
    SatelliteViewPlugin: {
      bottomIconLabel: 'Satellite View',
    },
    SatelliteFov: {
      bottomIconLabel: 'Satellite FOV',
      title: 'Satellite Field of View Menu',
      helpBody: keepTrackApi.html`The Satellite Field of View plugin allows you to control the field of view of a satellite.`,
    },
    Planetarium: {
      bottomIconLabel: 'Planetarium View',
    },
    NightToggle: {
      bottomIconLabel: 'Night Toggle',
    },
    SatConstellations: {
      bottomIconLabel: 'Constellations',
      title: 'Constellations Menu',
      helpBody: keepTrackApi.html`The Constellations menu allows you to view groups of satellites.
      <br><br>
      For some constellations, notional uplink/downlinks and/or crosslinks will be drawn between satellites in the constellation.`,
    },
    CountriesMenu: {
      bottomIconLabel: 'Countries',
      title: 'Countries Menu',
      helpBody: keepTrackApi.html`The Countries Menu allows you to filter the satellites by country of origin.`,
    },
    ColorMenu: {
      bottomIconLabel: 'Color Schemes',
      title: 'Color Scheme Menu',
      helpBody: keepTrackApi.html`The Colors Menu is a place to change the color theme used to render the objects.
      <br><br>
      The various themes can change the colors based on the objects' orbits, objects' characteristics, or the objects' relation to sun and/or earth.
      `,
    },
    Screenshot: {
      bottomIconLabel: 'Take Photo',
    },
    LaunchCalendar: {
      bottomIconLabel: 'Launch Calendar',
    },
    TimeMachine: {
      bottomIconLabel: 'Time Machine',
    },
    SatellitePhotos: {
      bottomIconLabel: 'Satellite Photos',
      title: 'Satellite Photos Menu',
      helpBody: keepTrackApi.html`The Satellite Photos Menu is used for displaying live photos from select satellites.
      <br><br>
      Note - changes in the image API may cause the wrong satellite to be selected in KeepTrack.`,
    },
    ScreenRecorder: {
      bottomIconLabel: 'Record Video',
    },
    AnalysisMenu: {
      bottomIconLabel: 'Analysis',
      title: 'Analysis Menu',
      helpBody: keepTrackApi.html`The Analysis Menu provides a number of tools to help you analyze the data in the current view. The tools are:
      <ul style="margin-left: 40px;">
        <li>Export Official TLEs - Export real two line element sets.</li>
        <li>Export 3LES - Export three line element sets.</li>
        <li>Export KeepTrack TLEs - Export All KeepTrack two line element sets including analysts.</li>
        <li>Export KeepTrack 3LES - Export All KeepTrack three line element sets including analysts.</li>
        <li>Find Close Objects - Find objects that are close to each other.</li>
        <li>Find Reentries - Find objects that are likely to reenter the atmosphere.</li>
        <li>Best Passes - Find the best passes for a satellite based on the currently selected sensor.</li>
      </ul>`,
    },
    SettingsMenuPlugin: {
      bottomIconLabel: 'Settings',
      title: 'Settings Menu',
      helpBody: keepTrackApi.html`The Settings menu allows you to configure the application.`,
    },
    VideoDirectorPlugin: {
      bottomIconLabel: 'Video Director',
      title: 'Video Director Menu',
      helpBody: keepTrackApi.html`The Video Director Menu is used to manipulate the camera and objects in the scene to create a video.`,
    },
  },
};
