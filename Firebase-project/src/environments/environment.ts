// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebaseConfig: {
    apiKey: 'AIzaSyB8CNGyGHEWc7EjcbZidkNnZA2irMryXP8',
    authDomain: 'thesis-tom-bury.firebaseapp.com',
    databaseURL: 'https://thesis-tom-bury.firebaseio.com',
    projectId: 'thesis-tom-bury',
    storageBucket: 'thesis-tom-bury.appspot.com',
    messagingSenderId: '722001355031',
    appId: '1:722001355031:web:8293d5d92425758ddd9752',
    measurementId: 'G-MKQ5N0KV03'
  },

  apiBaseUrl: 'http://localhost:5005/api',

  needsAuthentication: false,

  mainCollection: 'survey-03-05-a',

  mainStorage: 'survey-03-05-a',

  usersDB: 'test-users/',

  forumDB: 'test-forum-posts/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
