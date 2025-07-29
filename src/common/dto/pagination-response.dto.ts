export class PaginatedResponseObject<T> {
    data: T[];
    pagination: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
    };
}
