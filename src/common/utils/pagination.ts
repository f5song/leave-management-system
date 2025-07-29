export function getPaginationParams(
    currentPage: number,
    itemsPerPage: number,
  ) {
    const skip = (currentPage - 1) * itemsPerPage;
    const take = itemsPerPage;
    return { skip, take };
  }
  