import { CouncilMember } from "db/nest/services/council-member";

export function checkIfValidOrchestrationResponse(orchestrationResponse: string, mappingValidationObject: Record<string, Partial<CouncilMember>>): boolean {
  const personaKeys = Object.keys(mappingValidationObject);
  if (
    (orchestrationResponse.startsWith("[") && orchestrationResponse.endsWith("]"))
    && Array.isArray(orchestrationResponse)
  ) {
    for (let i = 0; i < orchestrationResponse.length; i++) {
      if (!personaKeys.includes(orchestrationResponse[i])) {
        return false;
      }
    }
  } else if (orchestrationResponse.startsWith("\'[\"") && orchestrationResponse.endsWith("]'")) {
    const parsedOrchestrationResponse = JSON.parse(orchestrationResponse);
    if (Array.isArray(parsedOrchestrationResponse)) {
      for (let i = 0; i < orchestrationResponse.length; i++) {
        if (!personaKeys.includes(orchestrationResponse[i])) {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  return true;
}