interface EmploymentsIndex {
    title: string;
    list: string[];
}

export function buildEmployments(index: EmploymentsIndex, items: Record<string, unknown>) {
    return {
        title: index.title,
        list: index.list.map((fileName) => items[fileName]).filter(Boolean),
    };
}
