import { SERVER_RESPONSE_CODES } from '../../../utils/errors';
import { Request, Response } from '../../../plugins/express';
import axios from '../../../plugins/axios';


/**
 * @function getInventoryItems
 * @param req
 * @returns - All inventory items for alex and asher for display on the shop page
 */
export const getInventoryItems = async (req: Request, res: Response) => {
  try {
    const inventoryResopnse = await axios('https://us-east-1.zuperpro.com/api/product', {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": process.env.ZUPER_API_KEY || "",
      },
    });

    console.log(inventoryResopnse.data);
    const inventoryItems = inventoryResopnse.data.data.map((inventoryItem: any) => {
      return {
        squaraeProductUID: inventoryItem.product_uid,
        squareProductID: inventoryItem.product_id,
        category: inventoryItem.product_category,
        image: inventoryItem.product_image,
        name: inventoryItem.product_name,
        productType: inventoryItem.product_type,
        description: inventoryItem.product_description,
        price: inventoryItem.price,
        purchasePrice: inventoryItem.purchase_price,
        brand: inventoryItem.brand,
      }
    });
    res.status(SERVER_RESPONSE_CODES.ACCEPTED).send({ items: inventoryItems }).end();
  } catch (error: any) {
    const errorObj = error.response ? {
      status: error.response.status,
      message: error.response.statusText || error.message,
    } : {
      status: SERVER_RESPONSE_CODES.SERVER_ERROR,
      message: error.message
    };
    res.status(errorObj.status).send({ error: errorObj.message }).end
  }
}