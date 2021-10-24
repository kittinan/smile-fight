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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import ReactCountryFlag from "react-country-flag"
import loadCustomRoutes from 'next/dist/lib/load-custom-routes';

import ScoreBoard from '../components/scoreboard';

class ScoreBoardPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [
      ]
    }


  }

  componentDidMount() {
    const { pathname } = Router

    const token = localStorage.getItem("token");

    this.loadScoreBoard()
  }

  loadScoreBoard() {
    const self = this;
    const url = this.props.BASE_API_URL + '/score/board';

    axios.get(url)
      .then(function (response) {

        self.hideLoading()

        if (response.status != 200) {
          // TODO: error
          return;
        }

        self.setState({
          rows: response.data
        })

      })
      .catch(function (error) {
        self.hideLoading()
        console.log(error);
      });


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

  render() {
    const { rows } = this.state;

    return (
      <Card sx={{ minWidth: 275 }} className="center play-container">
        <CardContent sx={{ alignItems: 'center' }}>
          <h1>Scoreboard</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Country</TableCell>
                  <TableCell align="center">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center"><ReactCountryFlag countryCode={row.country} /></TableCell>
                    <TableCell align="center">{row.score.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    )
  }

}

export default ScoreBoardPage;
