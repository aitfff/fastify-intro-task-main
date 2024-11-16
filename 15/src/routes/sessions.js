import generateUsers, { decrypt } from "../utils.js";

export default (app) => {
  const users = generateUsers();

  // BEGIN (write your solution here)
  app.post("/sessions", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (user && decrypt(user.password) === password) {
      req.session.username = user.username;
      return res.redirect("/");
    }

    res.view("src/views/sessions/new", { error: "Wrong username or password" });
  });

  app.post("/sessions/delete", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/");
    });
  });
  // END
};
