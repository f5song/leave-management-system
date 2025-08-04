export class PaginatedResponseObject<T> {
    data: T[];
    pagination: {
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}
