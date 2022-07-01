import nc from 'next-connect'; //to implement backend api
import client from '../../../utils/client';

const handler = nc(); //its like express

handler.get(async (req, res) => {
  const product = await client.fetch(`*[_type == "Product" && _id == $id][0]`, {
    id: req.query.id,
  });
  res.send(product); //send product to client or frontend from backend
});
export default handler;
