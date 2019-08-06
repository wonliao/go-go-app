import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

const STORAGE_KEY="settings";
/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class SettingsProvider {
    listSkins=[
      // { title: 'Lama vs Coban',         main_bg: 'lama-vs-coban',     text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Pink vs Indigo',        main_bg: 'pink-vs-indigo',    text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Indigo vs Purple',      main_bg: 'indigo-vs-purple',  text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Pink vs Red',           main_bg: 'pink-vs-red',       text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Pink vs Yellow',        main_bg: 'pink-vs-yellow',    text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Green vs Yellow',       main_bg: 'green-vs-yellow',   text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Tim vs Datroi',         main_bg: 'tim-vs-datroi',     text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Hong vs Lanon',         main_bg: 'hong-vs-lanon',     text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Lot vs Phan',           main_bg: 'lot-vs-phan',       text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-transparent' },
      // { title: 'Transparent - dark',    main_bg: 'transparent',       text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-transparent' },
      // { title: 'Transparent - light',   main_bg: 'transparent',       text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-transparent' },
      // { title: 'White',                 main_bg: 'white',             text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-white' },
      // { title: 'White 1',               main_bg: 'white-1',           text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-white-1' },
      // { title: 'White 2',               main_bg: 'white-2',           text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-white-2' },
      // { title: 'Grey 1',                main_bg: 'grey-1',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-grey-1' },
      // { title: 'Grey 2',                main_bg: 'grey-2',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-grey-2' },
      // { title: 'Grey 3',                main_bg: 'grey-3',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-grey-3' },
      // { title: 'Grey 4',                main_bg: 'grey-4',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-grey-4' },
      // { title: 'Grey 5',                main_bg: 'grey-5',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-grey-5' },
      // { title: 'Black',                 main_bg: 'black',             text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-black' },
      // { title: 'Red',                   main_bg: 'red',               text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-red' },
      // { title: 'Pink',                  main_bg: 'pink',              text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-pink' },
      // { title: 'Purple',                main_bg: 'purple',            text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-purple' },
      // { title: 'Deep Purple',           main_bg: 'd-purple',          text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-d-purple' },
      // { title: 'Indigo',                main_bg: 'indigo',            text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-indigo' },
      // { title: 'Blue',                  main_bg: 'blue',              text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-blue' },
      // { title: 'Light Blue',            main_bg: 'l-blue',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-l-blue' },
      // { title: 'Cyan',                  main_bg: 'cyan',              text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-cyan' },
      // { title: 'Teal',                  main_bg: 'teal',              text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-teal' },
      // { title: 'Green',                 main_bg: 'green',             text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-green' },
      // { title: 'Light Green',           main_bg: 'l-green',           text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-l-green' },
      // { title: 'Lime',                  main_bg: 'lime',              text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-lime' },
      // { title: 'Yellow',                main_bg: 'yellow',            text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-yellow' },
      // { title: 'Amber',                 main_bg: 'amber',             text_1: 'text-black',   text_2: 'text-grey-4',   text_3: 'text-grey-3',   text_4: 'text-grey-2', main_skin: 'skin skin-light skin-amber' },
      // { title: 'Orange',                main_bg: 'orange',            text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-orange' },
      // { title: 'Deep Orange',           main_bg: 'd-orange',          text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-d-orange' },
      // { title: 'Brown',                 main_bg: 'brown',             text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-brown' },
      { title: 'Blue Grey',             main_bg: 'blue-grey',         text_1: 'text-white',   text_2: 'text-grey-1',   text_3: 'text-grey-2',   text_4: 'text-grey-3', main_skin: 'skin skin-dark skin-blue-grey' }
    ]

    settings:any={
       dashboard_type: 2,
       skin:this.listSkins[0],
       menu_id:'menu-avatar'
    };

    constructor(public http: HttpClient, public events:Events, public storage:Storage) {

    }

    setDashboard(dashboard_type:Number){
      this.settings.dashboard_type=dashboard_type;
      return this.storage.set(STORAGE_KEY,this.settings);
    }

    getSkins(){
      return this.listSkins;
    }

    setSkin(skin){
      this.settings.skin=skin;
      return this.storage.set(STORAGE_KEY,this.settings)
    }

    setMenu(menu_id:any){
      this.settings.menu_id=menu_id;
      return this.storage.set(STORAGE_KEY,this.settings);
    }

    getSettings(){
      return this.storage.get(STORAGE_KEY).then(data=>{
        if(!data || data==null){
          //  console.log(this.settings);
          return this.settings;
        }
        return data;
      })
    }

    clearAll(){
      this.storage.clear();
    }

    getIndexOf(main_bg:any,result:any){
      for (var i = 0; i < result.length; i++) {
        if(result[i].main_bg == main_bg ){
          return i;
        }
      }
      return -1;
   }

  }