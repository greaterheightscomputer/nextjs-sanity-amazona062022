export default {
  //the id, status and email_address of the payer will be residing in the document
  title: 'paymentResult',
  name: 'paymentResult',
  type: 'object',
  fields: [
    {
      title: 'id',
      name: 'id',
      type: 'string',
    },
    {
      title: 'status',
      name: 'status',
      type: 'string',
    },
    {
      title: 'email_address',
      name: 'email_address',
      type: 'string',
    },
  ],
};
