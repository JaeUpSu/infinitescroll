import { useState, useEffect, useCallback } from "react";

import { throttle } from "./throttle";
import axios from "axios";

export const useInfiniteScroll = (fetcher, { size, onSuccess, onError }) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const executeFetch = useCallback(async () => {
    try {
      const {
        data: { contents, pageNumber, isLastPage },
      } = await fetcher({ page, size });

      setData((prev) => prev.concat(contents));
      setPage(pageNumber + 1);
      setNextPage(!isLastPage);
      setFetching(false);
      onSuccess?.();
    } catch (err) {
      onError?.(err);
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const { scrollTop, offsetHeight } = document.documentElement;

      if (window.innerHeight + scrollTop + 1 >= offsetHeight) {
        setFetching(true);
      }
    });

    setFetching(true);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isFetching && hasNextPage) executeFetch();
    else if (!hasNextPage) setFetching(false);
  }, [isFetching]);

  return { page, data, isFetching, hasNextPage };
};
export const fetchUsers = (params) =>
  axios.get("/users", {
    params,
  });
