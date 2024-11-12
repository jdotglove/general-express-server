import { PaymentUpdateModel, PaymentUpdateRequestDocument } from '../models/payment-update-request';

export type PaymentUpdateRequest = PaymentUpdateRequestDocument;

export const findOnePaymentUpdateRequest = (
  query: any,
  options?: any,
): Promise<PaymentUpdateRequest> => PaymentUpdateModel.findOne(
  query,
  options,
) as unknown as Promise<PaymentUpdateRequest>;

export const findOnePaymentUpdateRequestAndUpdate = (
  query: any,
  update: any,
  options?: any,
): Promise<PaymentUpdateRequest> => PaymentUpdateModel.findOneAndUpdate(
  query,
  update,
  options,
) as unknown as Promise<PaymentUpdateRequest>;

// TODO: come back to type this for checking modified success
export const updateOnePaymentUpdateRequest = (
  query: any,
  options?: any,
): Promise<void> => PaymentUpdateModel.updateOne(
  query,
  options,
) as unknown as Promise<void>;

export const createOnePaymentUpdateRequest = (
 customerDoc: any,
) => PaymentUpdateModel.create(
  customerDoc,
) as unknown as Promise<PaymentUpdateRequest>;