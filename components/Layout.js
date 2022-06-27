import { createTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';

import Head from 'next/head';
import NextLink from 'next/link';
import classes from '../utils/classes';

export default function Layout({ title, description, children }) {
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
      mode: 'light', //use context api to make mode dynamic based on user preference
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/*CssBaseline is to make styling consist throughtout the app project*/}
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <NextLink href="/" passHref>
              <Link>
                <Typography sx={classes.brand}>amazona</Typography>
              </Link>
            </NextLink>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {children}
        </Container>
        {/*<Container> component is Hight Order Component meaning a component that render any components*/}
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Sanity Amazona.</Typography>
        </Box>
      </ThemeProvider>
    </div>
  );
}
