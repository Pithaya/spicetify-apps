export type QueryDefinition = {
    name: string;
    operation: 'query' | 'mutation';
    sha256Hash: string;
    value: null;
};
