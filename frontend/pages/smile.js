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

import ReactCountryFlag from "react-country-flag"

import AES from 'crypto-js/aes';

import axios from 'axios';

import Box from '@mui/material/Box';


class Home extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      country: "US",
      score: 0.0,
      scores: [],
      latestSaveScore: Date.now(),
      countDown: 0,
      isRunPrediction: false,
    }
  }

  async componentDidMount() {
    console.log(faceapi)
    console.log(faceapi.nets)


    const country = localStorage.getItem("country")
    const name = localStorage.getItem("name")
    const token = localStorage.getItem("token")
    console.log(country)




    this.setState({ country, token, name })

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
    //faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    faceapi.nets.tinyFaceDetector.loadFromUri('/models');


    //faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    //faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    faceapi.nets.faceExpressionNet.loadFromUri('/models');



    this.initCamera()
  }

  async initCamera() {
    const self = this;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: 320,
        height: 240,
        frameRate: 15
      }
    });

    this.video.srcObject = stream;
    this.video.play();

  }

  startGame() {
    this.setState({
      score: 0.0,
      countDown: 10,
      isRunPrediction: true,
    }, this.predict)

    const self = this;

    this.countDownInterval = setInterval(() => {
      self.onCountDown();
    }, 1000)
  }

  onCountDown() {
    console.log("onCountDown")
    const { countDown } = this.state;
    if (countDown <= 0) {

      this.onEndCountdown();

      return;
    }

    this.setState({
      countDown: countDown - 1,
    })
  }

  onEndCountdown() {
    console.log("onEndCountdown");

    let { score } = this.state;

    clearInterval(this.countDownInterval);

    this.setState({
      isRunPrediction: false,
    })

    console.log(score)
    this.submitScore(score)
  }

  async predict() {
    const input = this.video;

    let { score, scores, latestSaveScore, isRunPrediction } = this.state;
    console.log(isRunPrediction)

    if (!isRunPrediction) {
      return;
    }
    //console.log(scores)

    var startTime = performance.now()

    const now = Date.now();
    if (now - latestSaveScore < 100) {
      setTimeout(() => this.predict());
      return;
    }


    //const results = await faceapi.detectAllFaces(input).withFaceExpressions()
    //const results = await faceapi.detectSingleFace(input).withFaceExpressions()
    const results = await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
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

    const happy = results.expressions.happy;
    const newScore = parseFloat(score) + parseFloat(parseFloat(happy * 10).toFixed(3))
    console.log(happy)

    //scores.push({ happy: results.expressions.happy, created: new Date() })
    //this.setState({ scores: scores })



    this.setState({ latestSaveScore: Date.now(), score: newScore });

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
    //this.predict()

    const payload = this.generatePayload(95)

    console.log(payload)
  }

  onClickedSubmit() {
    const { score } = this.state
    this.submitScore(score)
  }

  submitScore(score) {
    const { token } = this.state;
    const payload = this.generatePayload(score)


    const reqPayload = {
      token: token,
      payload: payload
    }



    const url = 'http://127.0.0.1:8787/score/submit'

    axios.post(url, reqPayload)
      .then(function (response) {

        console.log(response);

        if (response.status != 200) {
          // TODO: error
          return;
        }


      })
      .catch(function (error) {
        console.log(error);
      });
  }

  generatePayload(score) {
    const { token } = this.state

    console.log(token)

    const payload = JSON.stringify({ score: score, t: Date.now() })

    // Encrypt
    var ciphertext = AES.encrypt(payload, token).toString()

    return ciphertext
  }


  render() {
    const { name, country, score, countDown } = this.state;
    console.log(country)
    return (
      <Layout>

        <div>
          <span>{name}</span>
          <ReactCountryFlag countryCode={country} />
        </div>

        <div>
          <div>{countDown}</div>
          <div>Score: {score}</div>
          <div></div>
        </div>

        <div>

          <div className="webcam-container">
            <video ref={ref => this.video = ref}></video>
            <canvas ref={ref => this.canvas = ref}></canvas>
          </div>
        </div>

        <div>

          <Button variant="contained" onClick={() => {
            this.startGame();
          }} >Start</Button>

          <Button variant="contained" onClick={() => {
            this.onClickedSubmit();
          }} >Submit</Button>
        </div>



      </Layout>
    )
  }

}

export default Home;
