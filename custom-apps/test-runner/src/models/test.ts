export type Test = {
    name: string;
    test: () => Promise<void>;
};
