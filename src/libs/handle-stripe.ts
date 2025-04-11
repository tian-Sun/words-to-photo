import {toDateTime} from './helpers';
import {stripe} from './stripe';
import Stripe from 'stripe';
import {getDb} from "~/libs/db";



const createOrRetrieveCustomer = async ({
                                          email,
                                          user_id
                                        }: {
  email: string;
  user_id: string;
}) => {

  const db = getDb();

  const results = await db.query('SELECT * FROM stripe_customers where user_id=$1 limit 1', [user_id]);
  const existUser = results.rows;

  if (existUser.length <= 0) {
    // 创建
    const customerData: { metadata: { user_id: string }; email?: string } =
      {
        metadata: {
          user_id: user_id
        }
      };
    if (email) customerData.email = email;
    const customer = await stripe.customers.create(customerData);
    await db.query('insert into stripe_customers(user_id,stripe_customer_id) values($1, $2)', [user_id, customer.id]);
    return customer.id;
  }
  return existUser[0].stripe_customer_id;
};


/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  user_id: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const {name, phone, address} = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, {name, phone, address});
  const db = getDb();
  await db.query('update user_info set billing_address=$1,payment_method=$2 where user_id=$3',
    [{...address}, {...payment_method[payment_method.type], user_id}]);
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const db = getDb();
  // Get customer's UUID from mapping table.
  const results = await db.query('SELECT * FROM stripe_customers where stripe_customer_id=$1 limit 1', [customerId]);
  const existCustomer = results.rows;
  if (existCustomer.length <= 0) {
    return;
  }
  const customerData = existCustomer[0];

  const {user_id: user_id} = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData =
    {
      id: subscription.id,
      user_id: user_id,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? toDateTime(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? toDateTime(subscription.canceled_at).toISOString()
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: toDateTime(
        subscription.current_period_end
      ).toISOString(),
      created: toDateTime(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? toDateTime(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? toDateTime(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? toDateTime(subscription.trial_end).toISOString()
        : null
    };

  const resultSubs = await db.query('SELECT * FROM stripe_subscriptions where user_id=$1 limit 1', [subscriptionData.user_id]);
  const existSubs = resultSubs.rows;
  if (existSubs.length <= 0) {
    // 没有，新增
    await db.query('insert into stripe_subscriptions(id,user_id,metadata,status,price_id,quantity,cancel_at_period_end,cancel_at,canceled_at,current_period_start,current_period_end,created,ended_at,trial_start,trial_end) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)',
      [subscriptionData.id, subscriptionData.user_id, subscriptionData.metadata, subscriptionData.status, subscriptionData.price_id, subscriptionData.quantity, subscriptionData.cancel_at_period_end, subscriptionData.cancel_at, subscriptionData.canceled_at, subscriptionData.current_period_start, subscriptionData.current_period_end, subscriptionData.created, subscriptionData.ended_at, subscriptionData.trial_start, subscriptionData.trial_end]);
  } else {
    // 有，更新
    await db.query('update stripe_subscriptions set user_id=$1,metadata=$2,status=$3,price_id=$4,quantity=$5,cancel_at_period_end=$6,cancel_at=$7,canceled_at=$8,current_period_start=$9,current_period_end=$10,created=$11,ended_at=$12,trial_start=$13,trial_end=$14 where user_id=$15',
      [subscriptionData.user_id, subscriptionData.metadata, subscriptionData.status, subscriptionData.price_id, subscriptionData.quantity, subscriptionData.cancel_at_period_end, subscriptionData.cancel_at, subscriptionData.canceled_at, subscriptionData.current_period_start, subscriptionData.current_period_end, subscriptionData.created, subscriptionData.ended_at, subscriptionData.trial_start, subscriptionData.trial_end, subscriptionData.user_id]);
  }

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && user_id)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      user_id,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};



export {
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
