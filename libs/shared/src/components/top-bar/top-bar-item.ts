export type TopBarItem = {
    key: string;
    label: string;
    href: string;
    data?: Record<string, unknown>;
    render?: (item: TopBarItem) => JSX.Element;
};
