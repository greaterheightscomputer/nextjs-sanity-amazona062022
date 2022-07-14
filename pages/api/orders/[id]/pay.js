import nc from 'next-connect';
import { isAuth } from '../../../../utils/auth';
import config from '../../../../utils/config';
import axios from 'axios';

const handler = nc();

handler.use(isAuth);

//update existing order base on the orderId
handler.put(async (req, res) => {
  const tokenWithWriteAccess = process.env.SANITY_AUTH_TOKEN;
  await axios.post(
    `https://${config.projectId}.api.sanity.io/v1/data/mutate/${config.dataset}`,
    {
      mutations: [
        {
          patch: {
            id: req.query.id,
            set: {
              isPaid: true,
              paidAt: new Date().toISOString(),
              'paymentResult.id': req.body.id,
              'paymentResult.status': 'paid', //req.body.email_address,
              'paymentResult.email_address': req.user.email, //req.body.id,
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
  res.send({ message: 'order paid' });
});

export default handler;
