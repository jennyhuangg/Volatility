/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/*
 * This code was modified from https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/volume/js/soundmeter.js
 */


'use strict';

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.


// OUR OWN CODE
// create a queue that will hold the amplitude of audio input for the last ten
// seconds
var queue = [];
var timeLength = 10;

for(var i = 0; i < timeLength * 1000 / 50; i++)
{
  queue.push(0);
}

// OUR OWN FUNCTION
// Calculates the average of a given array/queue
function calculateAverage(array)
{
  var count = 0;
  for(var x = 0; x < array.length; x++)
  {
    count += array[x];
  }
  return count/array.length;
}


// THEIR FUNCTION
function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  var that = this;

  // Whenever some type of audio input is detected
  this.script.onaudioprocess = function(event) {
    // Length of input corresponds to the amplitude of sound input
    var input = event.inputBuffer.getChannelData(0);
    var i;
    var sum = 0.0;
    var clipcount = 0;
    for (i = 0; i < input.length; ++i) {
      sum += input[i] * input[i];
      if (Math.abs(input[i]) > 0.99) {
        clipcount += 1;
      }
    }
    that.instant = Math.sqrt(sum / input.length);

    // OUR CODE
    // add new instant volume and remove earliest volume level from queue
    queue.push(that.instant);
    queue.shift();
    // set slow to the average volume of the last 10 seconds
    that.slow = calculateAverage(queue);
  };
}

// THEIR FUNCTION
SoundMeter.prototype.connectToSource = function(stream, callback) {
  console.log('SoundMeter connecting');
  try {
    this.mic = this.context.createMediaStreamSource(stream);
    this.mic.connect(this.script);
    // necessary to make sample run, but should not be.
    this.script.connect(this.context.destination);
    if (typeof callback !== 'undefined') {
      callback(null);
    }
  } catch (e) {
    console.error(e);
    if (typeof callback !== 'undefined') {
      callback(e);
    }
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
};
