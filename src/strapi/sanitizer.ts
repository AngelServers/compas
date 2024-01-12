export const parseServiceResult = (
  result: any
): {
  data: any[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
} => {
  return { data: result.results, meta: { pagination: result.pagination } };
};
