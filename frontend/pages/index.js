import Head from 'next/head'
import Router from 'next/router'

import Layout from "../components/Layout";

import Button from '@mui/material/Button';
import React, { Component } from 'react';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import axios from 'axios';

import Swal from 'sweetalert2'

import { width } from '@mui/system';

import ScoreBoard from '../components/scoreboard';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "Tun"
    }


  }

  componentDidMount() {
    const { pathname } = Router

    const token = localStorage.getItem("token");

    if (token) {
      //Router.push("smile");
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

  play() {

    const self = this;
    const { name } = this.state;
    console.log("name: " + name)

    const url = this.props.BASE_API_URL + '/user/create';

    const payload = {
      name: name
    }

    this.showLoading();

    axios.post(url, payload)
      .then(function (response) {

        self.hideLoading()

        if (response.status != 200) {
          // TODO: error
          return;
        }

        const { token, name, country } = response.data;
        console.log(response);
        console.log(token)

        localStorage.setItem("token", token)
        localStorage.setItem("name", name)
        localStorage.setItem("country", country)

        Router.push("smile")
      })
      .catch(function (error) {
        self.hideLoading()
        console.log(error);
      });

    //Router.push("smile")
  }



  onNameChange(value) {
    this.setState({
      name: value
    });
  }


  render() {
    const { name } = this.state;

    return (
      <Layout>
        <Card sx={{ minWidth: 275 }} className="center play-container">
          <CardContent sx={{ alignItems: 'center' }}>
            <TextField
              required
              id="name"
              label="Your name"
              value={name}
              onChange={e => this.onNameChange(e.target.value)}
            />
          </CardContent>
          <CardActions className="center">
            <Button variant="contained" onClick={() => {
              this.play();
            }} >Play</Button>
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
