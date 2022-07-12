import axios from 'axios';
import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import config from '../../../utils/config';

const handler = nc();

handler.use(isAuth); //isAuth() middleware is use to authentic the user making order request

//api to create user order in sanity dataset
handler.post(async (req, res) => {
  const projectId = config.projectId;
  const dataset = config.dataset;
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  const { data } = await axios.post(
    `https://${projectId}.api.sanity.io/v1/data/mutate/${dataset}?returnIds=true`,
    {
      mutations: [
        {
          create: {
            _type: 'order',
            createdAt: new Date().toISOString(),
            ...req.body,
            userName: req.user.name,
            user: {
              _type: 'reference',
              _ref: req.user._id,
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
  //   console.log('apiOrderId: ', data.results[0].id);
  // console.log('apiOrderId: ', data.results[0]);
  //   console.log('apiOrderId: ', data);
  res.status(201).send(data.results[0].id);
});

export default handler;
