import { KeepTrackApiEvents, ToastMsgType } from '@app/interfaces';
import { KeepTrack } from '@app/keeptrack';
import { SelectSatManager } from '@app/plugins/select-sat-manager/select-sat-manager';
import { SettingsMenuPlugin } from '@app/plugins/settings-menu/settings-menu';
import { GreenwichMeanSiderealTime, Milliseconds } from 'ootk';
import { keepTrackApi } from '../keepTrackApi';
import { Camera } from './camera';
import { ConeMeshFactory } from './draw-manager/cone-mesh-factory';
import { Box } from './draw-manager/cube';
import { Earth } from './draw-manager/earth';
import { Godrays } from './draw-manager/godrays';
import { Moon } from './draw-manager/moon';
import { SensorFovMeshFactory } from './draw-manager/sensor-fov-mesh-factory';
import { SkyBoxSphere } from './draw-manager/skybox-sphere';
import { Sun } from './draw-manager/sun';
import { errorManagerInstance } from './errorManager';
import { WebGLRenderer } from './webgl-renderer';

export interface SceneParams {
  gl: WebGL2RenderingContext;
  background?: WebGLTexture;
}

export class Scene {
  private gl_: WebGL2RenderingContext;
  background: WebGLTexture;
  skybox: SkyBoxSphere;
  isScene = true;
  earth: Earth;
  moon: Moon;
  sun: Sun;
  godrays: Godrays;
  sensorFovFactory: SensorFovMeshFactory;
  coneFactory: ConeMeshFactory;
  /** The pizza box shaped search around a satellite. */
  searchBox: Box;
  frameBuffers = {
    gpuPicking: null as WebGLFramebuffer,
    godrays: null as WebGLFramebuffer,
  };

  constructor(params: SceneParams) {
    this.gl_ = params.gl;
    this.background = params?.background;

    this.skybox = new SkyBoxSphere();
    this.earth = new Earth();
    this.moon = new Moon();
    this.sun = new Sun();
    this.godrays = new Godrays();
    this.searchBox = new Box();
    this.sensorFovFactory = new SensorFovMeshFactory();
    this.coneFactory = new ConeMeshFactory();
  }

  init(gl: WebGL2RenderingContext): void {
    this.gl_ = gl;
    this.skybox.init(settingsManager, gl);
  }

  update(simulationTime: Date, gmst: GreenwichMeanSiderealTime, j: number) {
    this.sun.update(j);
    this.earth.update(gmst);
    this.moon.update(simulationTime);
    this.skybox.update();

    this.sensorFovFactory.updateAll(gmst);
    this.coneFactory.updateAll();
  }

  render(renderer: WebGLRenderer, camera: Camera): void {
    this.clear();

    this.renderBackground(renderer, camera);
    this.renderOpaque(renderer, camera);
    this.renderTransparent(renderer, camera);

    this.sensorFovFactory.drawAll(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer);
    this.coneFactory.drawAll(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer);
  }

  averageDrawTime = 0;
  drawTimeArray: number[] = Array(150).fill(16);

  renderBackground(renderer: WebGLRenderer, camera: Camera): void {
    this.drawTimeArray.push(Math.min(100, renderer.dt));
    if (this.drawTimeArray.length > 150) {
      this.drawTimeArray.shift();
    }
    this.averageDrawTime = this.drawTimeArray.reduce((a, b) => a + b) / this.drawTimeArray.length;

    if (
      (!settingsManager.isDisableMoon ||
        settingsManager.isDrawSun ||
        settingsManager.isDrawAurora ||
        settingsManager.isDrawMilkyWay) &&
      !KeepTrack.isFpsAboveLimit(this.averageDrawTime as Milliseconds, 30)) {
      keepTrackApi.getUiManager().toast('Your computer is struggling! Disabling some visual effects in settings.', ToastMsgType.caution);
      settingsManager.isDisableMoon = true;
      settingsManager.isDrawSun = false;
      settingsManager.isDrawAurora = false;
      settingsManager.isDrawMilkyWay = false;
      // console.error('FPS: ', 1000 / this.averageDrawTime);
      try {
        SettingsMenuPlugin?.syncOnLoad();
      } catch (error) {
        errorManagerInstance.log(error);
      }
    }

    if (!settingsManager.isDrawLess) {
      if (settingsManager.isDrawSun) {

        // Draw the Sun to the Godrays Frame Buffer
        this.sun.draw(this.earth.lightDirection, this.frameBuffers.godrays);

        // Draw a black earth mesh on top of the sun in the godrays frame buffer
        this.earth.drawOcclusion(renderer.projectionMatrix, camera.camMatrix, renderer?.postProcessingManager?.programs?.occlusion, this.frameBuffers.godrays);

        // Draw a black object mesh on top of the sun in the godrays frame buffer
        if (
          !settingsManager.modelsOnSatelliteViewOverride &&
          keepTrackApi.getPlugin(SelectSatManager)?.selectedSat > -1 &&
          keepTrackApi.getMainCamera().camDistBuffer <= settingsManager.nearZoomLevel
        ) {
          renderer.meshManager.drawOcclusion(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.programs.occlusion, this.frameBuffers.godrays);
        }

        // Add the godrays effect to the godrays frame buffer and then apply it to the postprocessing buffer two
        renderer.postProcessingManager.curBuffer = null;
        this.godrays.draw(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer);
      }

      this.skybox.render(renderer.postProcessingManager.curBuffer);

      // eslint-disable-next-line multiline-comment-style
      // Apply two pass gaussian blur to the godrays to smooth them out
      // postProcessingManager.programs.gaussian.uniformValues.radius = 2.0;
      // postProcessingManager.programs.gaussian.uniformValues.dir = { x: 1.0, y: 0.0 };
      // postProcessingManager.doPostProcessing(gl, postProcessingManager.programs.gaussian, postProcessingManager.curBuffer, postProcessingManager.secBuffer);
      // postProcessingManager.switchFrameBuffer();
      // postProcessingManager.programs.gaussian.uniformValues.dir = { x: 0.0, y: 1.0 };
      // // After second pass apply the results to the canvas
      // postProcessingManager.doPostProcessing(gl, postProcessingManager.programs.gaussian, postProcessingManager.curBuffer, null);

      // Draw the moon
      if (!settingsManager.isDisableMoon) {
        this.moon.draw(this.sun.position);
      }

      keepTrackApi.runEvent(KeepTrackApiEvents.drawOptionalScenery);
    }

    renderer.postProcessingManager.curBuffer = null;
  }

  // eslint-disable-next-line class-methods-use-this
  renderOpaque(renderer: WebGLRenderer, camera: Camera): void {
    const dotsManagerInstance = keepTrackApi.getDotsManager();
    const colorSchemeManagerInstance = keepTrackApi.getColorSchemeManager();
    const orbitManagerInstance = keepTrackApi.getOrbitManager();
    const hoverManagerInstance = keepTrackApi.getHoverManager();

    // Draw Earth
    this.earth.draw(renderer.postProcessingManager.curBuffer);

    // Draw Dots
    dotsManagerInstance.draw(renderer.projectionCameraMatrix, renderer.postProcessingManager.curBuffer);

    orbitManagerInstance.draw(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer, hoverManagerInstance, colorSchemeManagerInstance, camera);

    keepTrackApi.getLineManager().draw(renderer, dotsManagerInstance.inViewData, camera.camMatrix, null);

    // Draw Satellite Model if a satellite is selected and meshManager is loaded
    if (keepTrackApi.getPlugin(SelectSatManager)?.selectedSat > -1) {
      if (!settingsManager.modelsOnSatelliteViewOverride && camera.camDistBuffer <= settingsManager.nearZoomLevel) {
        renderer.meshManager.draw(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderTransparent(renderer: WebGLRenderer, camera: Camera): void {
    if (keepTrackApi.getPlugin(SelectSatManager)?.selectedSat > -1) {
      this.searchBox.draw(renderer.projectionMatrix, camera.camMatrix, renderer.postProcessingManager.curBuffer);
    }
  }

  clear(): void {
    const gl = this.gl_;
    /*
     * NOTE: clearColor is set here because two different colors are used. If you set it during
     * frameBuffer init then the wrong color will be applied (this can break gpuPicking)
     */

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers.gpuPicking);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Clear the godrays Frame Buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffers.godrays);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Switch back to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*
     * Only needed when doing post processing - otherwise just stay where we are
     * Setup Initial Frame Buffer for Offscreen Drawing
     * gl.bindFramebuffer(gl.FRAMEBUFFER, postProcessingManager.curBuffer);
     */
  }

  async loadScene(): Promise<void> {
    try {
      // await tools.init();
      await this.earth.init(settingsManager, this.gl_);
      keepTrackApi.runEvent(KeepTrackApiEvents.drawManagerLoadScene);
      await this.sun.init(this.gl_);
      await keepTrackApi.getScene().godrays?.init(this.gl_, this.sun);
      if (!settingsManager.isDisableMoon) {
        await this.moon.init(this.gl_);
      }
      await this.searchBox.init(this.gl_);
      if (!settingsManager.isDisableSkybox) {
        await this.skybox.init(settingsManager, this.gl_);
      }
      // await sceneManager.cone.init();
    } catch (error) {
      console.debug(error);
    }
  }
}
