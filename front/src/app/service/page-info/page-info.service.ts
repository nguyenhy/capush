import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageInfoService {

  constructor() { }

  getPageInfo(path: string): IMenuItem | null {
    return allPageInfo[path] || null;
  }

  getListMenu() {
    return [
      allPageInfo['/input-output'],
    ];
  }
}


export const allPageInfo: IAllPageInfo = {
  /* all-setting */
  '/settings': {
    icon: 'settings',
    text: 'Settings',
    title: 'settings',
    path: '/settings',
  },

  /* homepage */
  '/': {
    icon: '',
    text: 'Homepage',
    title: 'homepage',
    path: '/',
  },

  /* 404 */
  '/404': {
    icon: 'report_gmailerrorred',
    text: '404',
    title: '404',
    path: '/404'
  },

  // menu
  '/input-output': {
    icon: 'brightness_1',
    text: 'input-output',
    title: 'input-output demo',
    path: '/input-output'
  },
};

export interface IAllPageInfo {
  [key: string]: IMenuItem;
}

export interface IMenuItem {
  icon: string;
  text: string;
  title: string;
  path: string;
}
