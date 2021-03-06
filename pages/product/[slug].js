import { useContext, useEffect, useState } from 'react';
import client from '../../utils/client';
import Layout from '../../components/Layout';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import classes from '../../utils/classes';
import Image from 'next/image';
import { urlFor, urlForThumbnail } from '../../utils/image';
import axios from 'axios';
import { Store } from '../../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
  const router = useRouter();
  const { slug } = props; //props is coming from predefined getServerSideProps() function
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: '',
  });
  const { product, loading, error } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `*[_type == "product" && slug.current == $slug][0]`,
          { slug }
        ); //{slug} here is the value right after product/ in the url
        setState({ ...state, product, loading: false });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, [setState, slug, state]);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id); //existing item
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }
    //else
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    console.log(Cookies.get('cartItems'));
    enqueueSnackbar(`${product.name} added to the cart`, {
      variant: 'success',
    });
    router.push('/cart'); //redirect user to cart screen
  };

  //title={product?.title} means if product is null don't raise an error just return null
  return (
    <Layout title={product?.title}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <NextLink href="/" passHref>
              <Link>
                <Typography>back to result</Typography>
              </Link>
            </NextLink>
          </Box>

          {/*render product details information*/}
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <Image
                src={urlFor(product.image)}
                alt={product.name}
                layout="responsive"
                width={640}
                height={640}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>Category: {product.category}</ListItem>
                <ListItem>Brand: {product.brand}</ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Typography sx={classes.smallText}>
                    ({product.numReviews} reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Description: {product.description}</Typography>
                </ListItem>
              </List>
            </Grid>

            {/*Action section*/}
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>???{product.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={addToCartHandler}
                      fullWidth
                      variant="contained"
                    >
                      Add to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Layout>
  );
}

export function getServerSideProps(context) {
  return {
    props: { slug: context.params.slug }, //use the return props object in ProductScreen react component
  };
}
