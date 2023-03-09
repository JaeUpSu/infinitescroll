import { useInfiniteQuery } from "react-query";
import axios from "axios";

const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
};

export const useFetchUsers = ({ size }) =>
  useInfiniteQuery(
    userKeys.lists(),
    ({ pageParam = 0 }) =>
      axios.get("/users", {
        params: { page: pageParam, size },
      }),
    {
      getNextPageParam: ({ data: { isLastPage, pageNumber } }) =>
        isLastPage ? undefined : pageNumber + 1,
    }
  );

// 각 API 요청별로 캐시를 관리하기 위해 useQuery
// 또는 useInfiniteQuery 함수의 첫 번째 인자로 queryKey라는 값을 주입
