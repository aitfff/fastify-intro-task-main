import _ from "lodash";
import fastify from "fastify";
import getUsers from "./utils.js";

export default () => {
  const app = fastify();

  const users = getUsers();

  // BEGIN (write your solution here)
  app.get('/users', (request, reply) => {
    const { page = 1, per = 5 } = request.query; 
    const pageNumber = Number(page);
    const perPage = Number(per);

    const startIndex = (pageNumber - 1) * perPage;
    const endIndex = startIndex + perPage;

    const result = users.slice(startIndex, endIndex);

    reply.send(result);
  });
  // END

  return app;
};
