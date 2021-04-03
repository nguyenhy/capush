import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { VideoStreamComponent } from 'src/app/component/video-stream/video-stream.component';
import { SettingsService } from 'src/app/service/settings/settings.service';

@Component({
  selector: 'app-input-output',
  templateUrl: './input-output.component.html',
  styleUrls: ['./input-output.component.scss']
})
export class InputOutputComponent implements OnInit, AfterViewInit {

  @ViewChild('videoStream') videoStream!: VideoStreamComponent;

  constructor(
    private settingsService: SettingsService,
  ) {

  }

  public ngOnInit(): void {

  }

  public ngAfterViewInit(): void {
    this.initLocalVideo();
  }


  private async initLocalVideo() {
    try {
      const stream = await this.settingsService.getLocalStream();

      if (stream) {
        /* show video in page */
        this.videoStream.updateStream(stream);


        /* check input/output device disconnect */
        // 1. input video
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length) {
          const firstVideoTracks = videoTracks[0];
          if (firstVideoTracks) {
            firstVideoTracks.addEventListener('ended', (event) => {
              console.error('check cam connection');
            });
          }
        } else {
          // some things wrong with the track
        }

      } else {

      }
    } catch (error) {
      console.error(error);
    }
  }

}
