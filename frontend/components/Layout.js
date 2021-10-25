import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MoodIcon from '@mui/icons-material/Mood';

import Head from "next/head";


const theme = createTheme();

export default function Album(props) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Head>
        <title>Smile Fight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <meta name="description" content="Smile Fight" />
        <meta name="keywords" content="Smile Fight" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Smile Fight" />
        <meta property="og:description" content="You smile, you score." />
        <meta property="og:image" content="/cover.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Smile Fight" />
        <meta property="twitter:description" content="You smile, you score." />
        <meta property="twitter:image" content="https://smile-fight.pages.dev/cover.jpg"></meta>

        <link href="https://fonts.cdnfonts.com/css/dead-wallace" rel="stylesheet" />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon"></link>

        {/* 
        <script src="https://unpkg.com/vconsole/dist/vconsole.min.js"></script>
        <script>
          var vConsole = new window.VConsole();
        </script>
        */}

      </Head>

      <AppBar position="relative">
        <Toolbar>

          <MoodIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            <Link href="/" className="link-head font-game">Smile Fight</Link>
          </Typography>

        </Toolbar>
      </AppBar>


      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >

          <Container>{props.children}</Container>

        </Box>
      </main>
    </ThemeProvider>
  );
}