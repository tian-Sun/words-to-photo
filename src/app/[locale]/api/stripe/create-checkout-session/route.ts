import {stripe} from '~/libs/stripe';
import {createOrRetrieveCustomer} from '~/libs/handle-stripe';
import {getURL} from '~/libs/helpers';
import Stripe from 'stripe';
import {getDb} from "~/libs/db";

export async function POST(req: Request) {
  const db = getDb();
  if (req.method === 'POST') {
    // 1. Destructure the price and quantity from the POST body
    const {price, quantity = 1, metadata = {}, redirectUrl, user_id} = await req.json();

    try {
      // 2. select user
      const userInfoRes = await db.query('select * from user_info where user_id = $1', [user_id]);
      const userInfoRow = userInfoRes.rows;
      if (userInfoRow.length <= 0) {
        return new Response(JSON.stringify({message: 'Not have user'}), {
          status: 200
        });
      }
      const userInfo = userInfoRow[0];
      const userEmail = userInfo.email;

      // 3. Retrieve or create the customer in Stripe
      const customer = await createOrRetrieveCustomer({
        user_id: user_id,
        email: userEmail
      });

      let redirectPath = `${getURL()}`;
      if (redirectUrl) {
        redirectPath = `${getURL()}${redirectUrl}`;
      }

      // 4. Create a checkout session in Stripe
      let session: Stripe.Response<Stripe.Checkout.Session>;
      if (price.type === 'recurring') {
        // @ts-ignore
        session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          billing_address_collection: 'auto',
          customer,
          customer_update: {
            address: 'auto'
          },
          line_items: [
            {
              price: price.id,
              quantity
            }
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            trial_from_plan: true,
            metadata
          },
          success_url: redirectPath,
          cancel_url: redirectPath
        });
      } else if (price.type === 'one_time') {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          billing_address_collection: 'auto',
          customer,
          customer_update: {
            address: 'auto'
          },
          line_items: [
            {
              price: price.id,
              quantity
            }
          ],
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: redirectPath,
          cancel_url: redirectPath
        });
      }

      if (session) {
        return new Response(JSON.stringify({sessionId: session.id}), {
          status: 200
        });
      } else {
        return new Response(
          JSON.stringify({
            error: {statusCode: 500, message: 'Session is not defined'}
          }),
          {status: 200}
        );
      }
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify(err), {status: 500});
    }
  } else {
    return new Response(JSON.stringify({message: 'Method Not Allowed'}), {
      status: 200
    });
  }
}
