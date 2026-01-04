export interface ADTProfile {
    id: string;
    name: string;
    signature: string;
    description?: string;
    preconditions?: string[];
}

export interface Axiom {
    id: string;
    expression: string;
    description?: string;
    relatedProfileIds: string[];
}

export interface ADTImplementation {
    id: string;
    name: string; // e.g. "Contiguous" or "Chained"
    domainSpace: string; // Struct definitions, types
    methods: Record<string, string>; // profileId -> code
}

export interface ADT {
    name: string;
    domain: string;
    uses: string;
    profiles: ADTProfile[];
    axioms: Axiom[];
    implementations: {
        contiguous: ADTImplementation;
        chained: ADTImplementation;
    };
}
