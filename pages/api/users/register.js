import nc from 'next-connect'; //to implement backend api
import bcrypt from 'bcryptjs';
import axios from 'axios';
import config from '../../../utils/config';
import { signToken } from '../../../utils/auth';

const handler = nc();

//api function to insert user onto sanity dataset
handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN; //for create or updating data in the sanity dataset

  //createMutations is a way of updating sanity dataset
  const createMutations = [
    {
      create: {
        _type: 'user', //name of the document
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false,
      },
    },
  ];
  //send ajax request to sanity dataset
  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    { mutations: createMutations },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );

  const userId = data.results[0].id; //once user record is create in sanity dataset its return the userId along with other field onto data
  const user = {
    _id: userId,
    name: req.body.name,
    email: req.body.email,
    isAdmin: false,
  };
  const token = signToken(user);
  res.send({ ...user, token }); //to client side or frontend
});

export default handler;
