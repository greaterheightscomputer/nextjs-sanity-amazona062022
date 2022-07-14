import nc from 'next-connect';
import config from '../../../utils/config';
import axios from 'axios';
import { signToken, isAuth } from '../../../utils/auth';
import bcrypt from 'bcryptjs';

const handler = nc();

handler.use(isAuth);

//update existing user base on the userId
handler.put(async (req, res) => {
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.user._id,
            set: {
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password),
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${tokenWithWriteAccess}`,
      },
    }
  );
  const user = {
    _id: req.user._id,
    name: req.body.name,
    email: req.body.email,
    isAdmin: req.user.isAdmin,
  };
  const token = signToken(user);
  res.send({ ...user, token });
});

export default handler;
