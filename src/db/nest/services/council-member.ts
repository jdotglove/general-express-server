import { CouncilMemberModel, CouncilMemberDocument } from '../models/council-member';

export type CouncilMember = CouncilMemberDocument;

export const createCouncilMember = (
    councilMemberDoc: Partial<CouncilMember>,
): Promise<CouncilMember> => CouncilMemberModel.create(
    councilMemberDoc,
) as unknown as Promise<CouncilMember>;


export const findOneCouncilMember = (
  query: any,
  projection?: any,
  options?: any,
): Promise<CouncilMember> => CouncilMemberModel.findOne(
  query,
  projection,
  options,
) as unknown as Promise<CouncilMember>;

export const findManyCouncilMembers = (
  query: any,
  projection?: any,
  options?: any,
): Promise<CouncilMember[]> => CouncilMemberModel.find(
  query,
  projection,
  options,
) as unknown as Promise<CouncilMember[]>;

export const updateOneCouncilMember = (
  query: any,
  update: any,
  options?: any,
): Promise<void> => CouncilMemberModel.updateOne(
  query,
  update,
  options,
) as unknown as Promise<void>;

export const updateManyCouncilMembers = (
  query: any,
  update: any,
  options?: any,
) => CouncilMemberModel.updateMany(
  query,
  update,
  options,
);