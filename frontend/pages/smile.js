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
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';

import ScoreBoard from '../components/scoreboard';
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
      isPlayed: false,
    }


  }

  showLoading() {
    Swal.fire({
      title: 'Loading',
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  hideLoading() {
    Swal.close();
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
      countDown: 15,
      isRunPrediction: true,
    }, this.predict)

    const self = this;

    this.countDownInterval = setInterval(() => {
      self.onCountDown();
    }, 1000)
  }

  onCountDown() {
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
      isPlayed: true,
    })

    console.log(`score: ${score}`)
  }

  async predict() {
    const input = this.video;

    let { score, latestSaveScore, isRunPrediction } = this.state;
    //console.log(isRunPrediction)

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
    //console.log(results)

    if (typeof (results) == 'undefined') {
      setTimeout(() => this.predict());
      return;
    }
    //withFaceDescriptor()

    //faceapi.drawDetection('overlay', results.map(res => res.detection), { withScore: true })

    const displaySize = { width: input.videoWidth, height: input.videoHeight }
    // resize the overlay canvas to the input dimensions
    //faceapi.matchDimensions(this.canvas, displaySize)

    //const resizedDetections = faceapi.resizeResults(results, displaySize)
    //faceapi.draw.drawDetections(this.canvas, resizedDetections)
    //faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections, 0.5)

    //console.log(results)
    var endTime = performance.now()

    //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

    const happy = results.expressions.happy;
    /*
    let currentScore = 0;
    if (happy > 0.8) {
      //currentScore = parseFloat(parseFloat(happy * 1).toFixed(3))
      currentScore = happy;
    }
    */
    const currentScore = happy;


    //console.log(`happy: ${happy} | currentScore: ${currentScore}`)

    const newScore = parseFloat(score) + currentScore;
    //console.log(typeof (newScore))

    //scores.push({ happy: results.expressions.happy, created: new Date() })
    //this.setState({ scores: scores })



    this.setState({ latestSaveScore: Date.now(), score: newScore });

    setTimeout(() => this.predict());
  }

  onClickedSubmit() {
    const { score } = this.state
    this.submitScore(score)
  }

  submitScore(score) {
    const self = this;
    const { token } = this.state;
    const payload = this.generatePayload(score)


    const reqPayload = {
      token: token,
      payload: payload
    }

    this.showLoading();

    const url = this.props.BASE_API_URL + '/score/submit';

    axios.post(url, reqPayload)
      .then(function (response) {

        self.hideLoading();

        console.log(response);

        self.setState({ isPlayed: false });

        if (response.status != 200) {
          // TODO: error
          return;
        }

        Swal.fire(
          'Success!',
          '',
          'success'
        )


      })
      .catch(function (error) {
        self.hideLoading();
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
    const { name, country, score, countDown, isRunPrediction, isPlayed } = this.state;
    console.log(score, typeof (score))
    const displayScore = score.toFixed(2);
    const playText = isPlayed ? 'Try Again' : 'Start';
    const playColor = isPlayed ? 'error' : 'success';
    console.log(country)
    return (
      <Layout>


        <Card sx={{ minWidth: 275 }} className="center play-container">
          <CardContent sx={{ alignItems: 'center' }}>

            <div className="font-game">
              <span>{name}</span> &nbsp;
              <ReactCountryFlag countryCode={country} />
            </div>

            <div className="space"></div>

            <div className="game-head">
              <div className="time-container">Time: {countDown}</div>
              <div className="score-container">Score: {displayScore}</div>
              <div className="space"></div>
            </div>

            <div>

              <div className="webcam-container">
                <video id="video-player" ref={ref => this.video = ref}></video>
                {/*
                <canvas ref={ref => this.canvas = ref}></canvas>
                */}
              </div>
            </div>


          </CardContent>
          <CardActions className="center">

            {!isRunPrediction &&
              <Button variant="contained" onClick={() => {
                this.startGame();
              }} color={playColor}>{playText}
              </Button>
            }

            {!isRunPrediction && isPlayed &&
              <Button variant="contained" onClick={() => {
                this.onClickedSubmit();
              }} color="success">Submit Score</Button>
            }
          </CardActions>
        </Card>

        <br />

        <ScoreBoard BASE_API_URL={this.props.BASE_API_URL} />


      </Layout>
    )
  }

}

export default Home;

export async function getStaticProps(context) {
  const BASE_API_URL = process.env.BASE_API_URL;

  return {
    props: { BASE_API_URL: BASE_API_URL }
  }
}
