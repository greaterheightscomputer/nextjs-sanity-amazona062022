import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Form from '../components/Form';
import Layout from '../components/Layout';
import NextLink from 'next/link';

export default function LoginScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {};

  return (
    <Layout title="Login">
      {/*handleSubmit is function from useForm() */}
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
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
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account ?{'  '}
            <NextLink href={'/register'} passHref>
              <Link>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </Form>
    </Layout>
  );
}
