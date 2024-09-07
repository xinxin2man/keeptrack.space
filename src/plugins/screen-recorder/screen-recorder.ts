import { KeepTrackApiEvents } from '@app/interfaces';
import { keepTrackApi } from '@app/keepTrackApi';
import { errorManagerInstance } from '@app/singletons/errorManager';
import recorderPng from '@public/img/icons/video.png';
import { KeepTrackPlugin } from '../KeepTrackPlugin';
import { StreamManager } from './stream-manager';

export class ScreenRecorder extends KeepTrackPlugin {
  dependencies_ = [];
  static readonly FILE_NAME = 'keeptrack.webm';

  bottomIconCallback = () => {
    if (this.isCompatibilityIssue_) {
      errorManagerInstance.warn('Recording unavailable due to compatibility issues!');
      this.shakeBottomIcon();

      return;
    }

    if (this.streamManagerInstance_.isVideoRecording) {
      this.streamManagerInstance_.stop();
    } else {
      try {
        this.setBottomIconToSelected();
        this.streamManagerInstance_.start();
        this.streamManagerInstance_.isVideoRecording = true;
      } catch (e) {
        errorManagerInstance.warn('Compatibility Error with Recording!');
        this.streamManagerInstance_.isVideoRecording = false;
        this.setBottomIconToDisabled();
        this.shakeBottomIcon();
        this.isCompatibilityIssue_ = true;
      }
    }
  };


  bottomIconImg = recorderPng;
  private isCompatibilityIssue_ = false;
  private streamManagerInstance_: StreamManager;

  addJs(): void {
    super.addJs();

    keepTrackApi.register({
      event: KeepTrackApiEvents.uiManagerOnReady,
      cbName: this.constructor.name,
      cb: () => {
        try {
          this.streamManagerInstance_ = new StreamManager(settingsManager.videoBitsPerSecond, this.onStop_.bind(this), this.onMinorError_.bind(this), this.onError_.bind(this));
        } catch (e) {
          console.warn(e);
        }
      },
    });
  }

  getRecorderObject(): StreamManager {
    return this.streamManagerInstance_;
  }

  private onError_(): void {
    this.setBottomIconToDisabled();
    this.isIconDisabled = true;
    this.streamManagerInstance_.isVideoRecording = false;
    this.shakeBottomIcon();
    this.isCompatibilityIssue_ = true;
  }

  private onMinorError_(): void {
    this.setBottomIconToUnselected();
  }

  private onStop_(): void {
    this.streamManagerInstance_.save(ScreenRecorder.FILE_NAME);
    this.setBottomIconToUnselected();
  }
}

