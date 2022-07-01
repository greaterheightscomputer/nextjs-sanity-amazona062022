import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';

import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import Cookies from 'js-cookie';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: { underline: 'hover' },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    //palette for change the default color
    palette: {
      // mode: 'light', //use context api to make mode dynamic based on user preference
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000', //yellow
      },
      secondary: {
        main: '#208080', //blue
      },
    },
  });
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    // console.log(Cookies.get('darkMode'));
  };
  return (
    <div>
      <Head>
        <title>{title ? `${title} - Sanity Amazona` : `Sanity Amazona`}</title>
        <link
          href="../shopping_cart_checkout_FILL0_wght400_GRAD0_opsz48.svg"
          rel="icon"
        />
        {description && <meta name="description" content={description}></meta>}
        {/*description its very useful for search engine optimization*/}
      </Head>
      {/*body of the app*/}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/*CssBaseline is to make styling consist throughtout the app project*/}
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <NextLink href="/" passHref>
                {/* passHref props enable NextLink component to href value onto  Link component*/}
                <Link>
                  <Typography sx={classes.brand}>amazona</Typography>
                </Link>
              </NextLink>
            </Box>
            <Box>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
            </Box>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        {/*<Container> component is High Order Component meaning a component that render any components*/}
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazona.</Typography>
        </Box>
      </ThemeProvider>
    </div>
  );
}
