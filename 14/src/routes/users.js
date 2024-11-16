import { generateToken, buildIdGenerator } from "../utils.js";

export default (app) => {
  const users = [];

  const generateId = buildIdGenerator();

  app.get("/users/new", (req, res) => res.view("src/views/users/new"));

  // BEGIN (write your solution here)
  app.post("/users", (req, res) => {
    const { firstName, lastName, email } = req.body;

    const userId = generateId();
    const token = generateToken();
    const newUser = { id: userId, firstName, lastName, email, token };

    users.push(newUser);
    res.setCookie("token", token);
    res.redirect(`/users/${userId}`);
  });

  app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    const token = req.cookies.token;

    const user = users.find(u => u.id === userId);

    if (user && user.token === token) {
      res.view("src/views/users/show", { user });
    } else {
      res.send("_User not found_");
    }
  });
};
