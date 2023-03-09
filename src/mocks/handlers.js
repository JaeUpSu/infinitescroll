import { setupWorker } from "msw";
import { rest } from "msw";

const users = Array.from(Array(1024).keys()).map((id) => ({
  id,
  name: `denis${id}`,
}));

const handlers = [
  rest.get("/users", async (req, res, ctx) => {
    const { searchParams } = req.url;
    const size = Number(searchParams.get("size"));
    const page = Number(searchParams.get("page"));
    const totalCount = users.length;
    const totalPages = Math.round(totalCount / size);

    return res(
      ctx.status(200),
      ctx.json({
        contents: users.slice(page * size, (page + 1) * size),
        pageNumber: page,
        pageSize: size,
        totalPages,
        totalCount,
        isLastPage: totalPages <= page,
        isFirstPage: page === 0,
      }),
      ctx.delay(500)
    );
  }),
];

export const worker = setupWorker(...handlers);
