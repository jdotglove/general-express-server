import { CustomerModel, CustomerDocument } from '../models/customer';

export type Customer = CustomerDocument;

export const findOneCustomer = (
  query: any,
  options?: any,
): Promise<Customer> => CustomerModel.findOne(
  query,
  options,
) as unknown as Promise<Customer>;

export const findOneCustomerAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<Customer> => CustomerModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<Customer>;

// TODO: come back to type this for checking modified success
export const updateOneCustomer = (
  query: any,
  options?: any,
): Promise<void> => CustomerModel.updateOne(
  query,
  options,
) as unknown as Promise<void>;

export const createOneCustomer = (
 customerDoc: any,
) => CustomerModel.create(
  customerDoc,
) as unknown as Promise<Customer>;