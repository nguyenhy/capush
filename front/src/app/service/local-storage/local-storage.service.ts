import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage = window.localStorage
  constructor() { }

  public remove(key: string) {
    this.storage.removeItem(key);
  }
  public set(key: EStorage | string, item: any) {
    try {
      const value = JSON.stringify({ item: item });
      this.storage.setItem(`${key}`, value);

    } catch (error) {
      console.error(error)
    }
  }
  public get(key: EStorage | string): any {
    try {
      const data: string = this.storage.getItem(`${key}`) || ''
      if (data) {
        const value = JSON.parse(data);
        return value?.item ? value.item : null;

      } else {
        return null
      }

    } catch (error) {
      console.error(error)
      return null
    }
  }

  public clear() {
    this.storage.clear();
  }

  public set_with_prefix(key: EStorage, prefix: string, item: any) {
    const prefixKey: string = `${prefix}-${key}`
    return this.set(prefixKey, item)
  }

  public get_with_prefix(key: EStorage, prefix: string) {
    const prefixKey: string = `${prefix}-${key}`
    return this.get(prefixKey)
  }
}


export enum EStorage {
  settingSelectedAudioOutput,
  settingSelectedAudioInput,
  settingSelectedVideoInput,
}