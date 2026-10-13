import assert from 'node:assert/strict';
import {paletteIntent} from './palette-gesture.js';
assert.equal(paletteIntent(0,0,true),null);assert.equal(paletteIntent(5,-3,true),null);
for(let building of [true,false]){assert.equal(paletteIntent(-80,5,building),'scroll');assert.equal(paletteIntent(80,-5,building),'scroll');assert.equal(paletteIntent(40,-30,building),'scroll');}
assert.equal(paletteIntent(2,-60,true),'drag');assert.equal(paletteIntent(2,-60,false),'ignore');assert.equal(paletteIntent(2,60,true),'ignore');
console.log('Palette: taps, sideways browsing, diagonal swipes, deliberate upward building drags and non-building gestures passed.');
