declare namespace Nest {
    interface PersonaMetadata {
        model: string;
        tags: string[];
        bot: Function<Promise<Promise<string>>>;
        name: string;
    }
    interface OrchestrationResponse {
        [personaKey: string]: PersonaMetadata
    }
}