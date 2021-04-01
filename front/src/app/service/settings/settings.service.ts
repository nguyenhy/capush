import { Injectable } from '@angular/core';
import { IDevice, IOSettingService } from './io-setting/io-setting.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private IOSettingService: IOSettingService
  ) {

  }

  getAllSetting(): IAllSetting {
    const ioSetting = this.IOSettingService.getAllSetting()
    return {
      ...ioSetting
    }
  }
}

export interface IAllSetting {
  outputAudio: IDevice | null,
  inputAudio: IDevice | null,
  inputVideo: IDevice | null,
}
