import fastify from "fastify";
import view from "@fastify/view";
import pug from "pug";
import getUsers from "./utils.js";

export default async () => {
  const app = fastify();

  const users = getUsers();

  // BEGIN (write your solution here)
  app.register(view, {
    engine: {
      pug,
    },
    root: `${__dirname}/views`, 
  });

  app.get("/users", (req, res) => {
    const { term } = req.query;
    let currentUsers = users;

    if (term) {
      currentUsers = users.filter((user) =>
        user.username.toLowerCase().includes(term.toLowerCase())
      );
    }
    res.view("users/index.pug", { users: currentUsers });
  });

  app.get('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = users.find(user => user.id === id);

    if (user) {
      return reply.view('users/show.pug', { user });
    } else {
      return reply.code(404).send("User not found"); 
    }
  });

  // END

  return app;
};
