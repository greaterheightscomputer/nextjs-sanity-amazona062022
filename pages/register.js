import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';

export default function RegisterScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo) {
      router.push('/'); //once userInfo object contain info user will not be able to access register screen
    }
  }, [router, userInfo]);

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' });
      return;
    }
    //else
    try {
      const { data } = await axios.post('/api/users/register', {
        name,
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      router.push('/');
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };

  return (
    <Layout title="Register">
      {/*handleSubmit is function from useForm() */}
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="name"
              control={control} /*this {control} is from useForm */
              defaultValue=""
              rules={{
                required: true,
                minLength: 2,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  inputProps={{ type: 'name' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name
                      ? errors.name.type === 'minLength'
                        ? 'Name length is more than 1'
                        : 'Name is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="email"
              control={control} /*this {control} is from useForm */
              defaultValue=""
              rules={{
                required: true,
                pattern:
                  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ /*{2,4} means the length of characters after . should be 2 or 4 length */,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(
                    errors.email
                  )} /*this errors is from formState: { errors }, of useForm */
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field} /*{...field} means render other attributes in the field */
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.confirmPassword)}
                  helperText={
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'minLength'
                        ? 'Confirm Password length is more than 5'
                        : 'Confirm Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Submit
            </Button>
          </ListItem>
          <ListItem>
            Already have an account ?{'  '}
            <NextLink href={'/login'} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
