import Vue from 'nativescript-vue';
import CanvasPlugin from 'nativescript-canvas/vue';

import Camera from './components/Camera';
import { CameraPlus } from '@nstudio/nativescript-camera-plus';

// Uncommment the following to see NativeScript-Vue output logs
Vue.config.silent = false;

new Vue({

    render: h => h('frame', [h(Camera)])

}).$start();

Vue.registerElement('CameraPlus', () => require('@nstudio/nativescript-camera-plus').CameraPlus);
Vue.use(CameraPlus.defaultCamera = 'front')
Vue.use(CanvasPlugin);