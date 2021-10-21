import Head from 'next/head'

import Layout from "../components/Layout";

import Button from '@mui/material/Button';
import React, { Component } from 'react';

import Swal from 'sweetalert2'

import * as faceapi from 'face-api.js';

//import * as faceapi from '@vladmandic/face-api/dist/face-api.esm.js';

//import * as faceapi from '@vladmandic/face-api';

//import * as faceapi from '@vladmandic/face-api';

import { width } from '@mui/system';


class Home extends React.Component {

  async componentDidMount() {
    console.log(faceapi)
    console.log(faceapi.nets)

    //await faceapi.tf.setBackend('webgl');
    //await faceapi.tf.enableProdMode();
    //await faceapi.tf.ENV.set('DEBUG', false);
    //await faceapi.tf.ready();


    /*
    faceapi.tf.setWasmPaths({
      'tfjs-backend-wasm.wasm': '/wasm/tfjs-backend-wasm.wasm',
      'tfjs-backend-wasm-simd.wasm': '/wasm/tfjs-backend-wasm-simd.wasm',
      'tfjs-backend-wasm-threaded-simd.wasm': '/wasm/tfjs-backend-wasm-threaded-simd.wasm'
    });


    faceapi.tf.setBackend('wasm');
    */

    faceapi.tf.setBackend('webgl');


    //console.log(this.net)
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    //faceapi.nets.tinyFaceDetector.loadFromUri('/models');


    //faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    //faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    faceapi.nets.faceExpressionNet.loadFromUri('/models');



    this.initCamera()
  }

  async initCamera() {
    const self = this;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 320,
        height: 240,
        frameRate: 15
      }
    });

    this.video.srcObject = stream;
    this.video.play();

  }

  async predict() {
    const input = this.video;

    var startTime = performance.now()


    //const results = await faceapi.detectAllFaces(input).withFaceExpressions()
    const results = await faceapi.detectSingleFace(input).withFaceExpressions()
    //const results = await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
    console.log(results)

    if (typeof (results) == 'undefined') {
      setTimeout(() => this.predict());
      return;
    }
    //withFaceDescriptor()

    //faceapi.drawDetection('overlay', results.map(res => res.detection), { withScore: true })

    const displaySize = { width: input.videoWidth, height: input.videoHeight }
    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(this.canvas, displaySize)

    const resizedDetections = faceapi.resizeResults(results, displaySize)
    //faceapi.draw.drawDetections(this.canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections, 0.5)

    console.log(results)
    var endTime = performance.now()

    console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

    setTimeout(() => this.predict());
  }

  async xalert() {
    /*
    Swal.fire({
      title: 'Error!',
      text: 'Do you want to continue',
      icon: 'error',
      confirmButtonText: 'Cool'
    })
    */

    // console.log(this.net)
    this.predict()
  }


  render() {
    return (
      <Layout>
        <marquee>Kittinan</marquee>
        <button onClick={() => this.xalert()}>Click</button>
        <div>

          <div className="webcam-container">
            <video ref={ref => this.video = ref}></video>
            <canvas ref={ref => this.canvas = ref}></canvas>
          </div>
          {/*
          <img id="myImg" src="images/IMG_20211017_161512.jpg" style={{ width: 500 }} ref={ref => this.img = ref} />
          */}
        </div>
      </Layout>
    )
  }

}

export default Home;
