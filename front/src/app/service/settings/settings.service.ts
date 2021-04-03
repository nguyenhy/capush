import { Injectable } from '@angular/core';
import { IDevice, IOSettingService } from './io-setting/io-setting.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private ioSettingService: IOSettingService,
  ) {

  }

  public getAllSetting(): IAllSetting {
    const ioSetting = this.ioSettingService.getIOSetting();
    return {
      ...ioSetting
    };
  }

  public async getLocalStream(): Promise<MediaStream | null> {
    try {
      const stream = await this.ioSettingService.getStreamFromSavedSetting();
      return stream;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export interface IAllSetting {
  outputAudio: IDevice | null;
  inputAudio: IDevice | null;
  inputVideo: IDevice | null;
}
