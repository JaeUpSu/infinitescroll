import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useFetchUsers } from "./useFetchUsers";
import { fetchUsers, useInfiniteScroll } from "./useInfiniteScroll";
import { useIntersect } from "./useIntersect";

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  margin-top: 25px;
  background: gray;
  display: flex;
  flex-wrap: wrap;
`;
const Card = styled.div`
  height: 200px;
  width: 200px;
  border: 1px solid black;
  color: black;
`;
const Target = styled.div`
  height: 1px;
`;

const CARD_SIZE = 200;
const PAGE_SIZE = 10 * Math.ceil(visualViewport.width / CARD_SIZE);

function UsersPage() {
  // const { data, isFetching } = useInfiniteScroll(fetchUsers, {
  //   size: PAGE_SIZE,
  // });

  const { data, hasNextPage, isFetching, fetchNextPage } = useFetchUsers({
    size: PAGE_SIZE,
  });

  const users = useMemo(
    () => (data ? data.pages.flatMap(({ data }) => data.contents) : []),
    [data]
  );

  const ref = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  });

  return (
    <Container>
      {/* {data.map((user) => {
        return <Card key={user.id}>{user.name}</Card>;
      })} */}
      {users.map((user) => {
        return <Card key={user.id}>{user.name}</Card>;
      })}
      {isFetching && "Loading..."}
      <Target ref={ref} />
    </Container>
  );
}

export default UsersPage;
