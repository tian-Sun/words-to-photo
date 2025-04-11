const priceProd = [
  {
    currency: "usd",
    type: "recurring",
    unit_amount: 11880,
    id: "price_"
  },
  {
    currency: "usd",
    type: "recurring",
    unit_amount: 1990,
    id: "price_"
  }
];

const priceTest = [
  {
    currency: "usd",
    type: "recurring",
    unit_amount: 11880,
    id: "price_"
  },
  {
    currency: "usd",
    type: "recurring",
    unit_amount: 1990,
    id: "price_"
  }
];

export const priceList = (process.env.NODE_ENV === 'production' ? priceProd: priceTest);
