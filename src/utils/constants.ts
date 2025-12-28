import { BaseMessage } from "@langchain/core/messages";
import { SolitaryAphoristicNomad } from "../library/friedrich-nietzsche";
import { KonigsbergDreamer } from "../library/immanuel-kant";
import { ExistentialLens } from "../library/jean-paul-sartre";

export const PERSONA_MAPPING: Record<string,  Nest.PersonaMetadata> = {
    "aphoristic-nomad": {
      model: "claude-3-5-haiku-latest",
      tags: ["general", "info", "information", "orchestration"],
      bot: (messages: BaseMessage[]) => SolitaryAphoristicNomad(messages),
      name: "Solitary Aphoristic Nomad",
    },
    "konigsberg-dreamer": {
      model: "claude-opus-4-20250514",
      tags: ["reasoning", "deep-thought", "choices", "options", "creativity", "creative"],
      bot: (messages: BaseMessage[]) => KonigsbergDreamer(messages),
      name: "Konigsberg Dreamer",
    },
    "existential-lens": {
      model: "claude-sonnet-4-20250514",
      tags: ["efficiency", "optimize", "high-level", "streamline", "productivity", "frameworks"],
      bot: (messages: BaseMessage[]) => ExistentialLens(messages),
      name: "Existential Lens",
    },
  }