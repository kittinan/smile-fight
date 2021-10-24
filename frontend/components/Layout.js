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
      <AppBar position="relative">
        <Toolbar>

          <MoodIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            <Link href="/" className="link-head font-game">Smile Fight</Link>
          </Typography>

        </Toolbar>
      </AppBar>

      <Head>
        <title>Smile Fight</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <link href="http://fonts.cdnfonts.com/css/dead-wallace" rel="stylesheet" />

      </Head>
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