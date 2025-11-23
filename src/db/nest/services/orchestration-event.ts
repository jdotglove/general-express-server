import { OrchestrationEventModel, OrchestrationEventDocument } from '../models/orchestration-event';

export type OrchestrationEvent = OrchestrationEventDocument;

export const createOrchestrationEvent = (
    orchestrationEventDoc: Partial<OrchestrationEvent>,
): Promise<OrchestrationEvent> => OrchestrationEventModel.create(
  orchestrationEventDoc,
) as unknown as Promise<OrchestrationEvent>;

export const findOneOrchestrationEvent = (
  query: any,
  projection?: any,
  options?: any,
): Promise<OrchestrationEvent> => OrchestrationEventModel.findOne(
  query,
  projection,
  options,
) as unknown as Promise<OrchestrationEvent>;

export const findManyOrchestrationEvents = (
  query: any,
  projection?: any,
  options?: any,
): Promise<OrchestrationEvent[]> => OrchestrationEventModel.find(
  query,
  projection,
  options,
) as unknown as Promise<OrchestrationEvent[]>;