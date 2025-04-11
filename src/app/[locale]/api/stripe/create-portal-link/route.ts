import {getUserById} from "~/servers/user";
import {createOrRetrieveCustomer} from "~/libs/handle-stripe";
import {stripe} from '~/libs/stripe';
import {getURL} from "~/libs/helpers";

export async function POST(req: Request) {
  let json = await req.json();
  let user_id = json.user_id;

  if (!user_id) {
    return Response.json({msg: "Login to continue.", status: 601});
  }

  // 检查用户在数据库是否存在，不存在则返回需登录
  const resultsUser = await getUserById(user_id);
  if (resultsUser.email == '') {
    return Response.json({msg: "Login to continue.", status: 601});
  }

  const customer = await createOrRetrieveCustomer({
    user_id: user_id,
    email: resultsUser.email
  });
  if (!customer) throw Error('Could not get customer');

  const {url} = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${getURL()}`
  });
  return new Response(JSON.stringify({url: url}), {
    status: 200
  });

}
