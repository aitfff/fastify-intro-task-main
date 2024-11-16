import fastify from "fastify";
import view from "@fastify/view";
import pug from "pug";
import formbody from "@fastify/formbody";
import yup from "yup";
import { generateId } from "./utils.js";

export default async () => {
  const app = fastify();

  const articles = [];

  await app.register(view, { engine: { pug } });
  await app.register(formbody);

  app.get("/", (req, res) => res.view("src/views/index"));

  app.get("/articles", (req, res) => {
    res.view("src/views/articles/index", { articles });
  });

  // BEGIN (write your solution here)
  app.get("/articles/new", (req, res) => {
    res.view("src/views/articles/new", { errors: {}, article: {} });
  });

  const articleSchema = yup.object().shape({
    title: yup.string().required("Название не должно быть короче двух символов").min(2),
    text: yup.string().required("Статья должна быть не короче 10 символов").min(10),
  });

  app.post("/articles", async (req, res) => {
    try {
      await articleSchema.validate(req.body, { abortEarly: false });

      const articleExists = articles.some(article => article.title === req.body.title);
      if (articleExists) {
        return res.view("src/views/articles/new", {
          errors: { title: "Статья с таким названием уже существует" },
          article: req.body,
        });
      }

      const newArticle = {
        id: generateId(),
        title: req.body.title,
        text: req.body.text,
      };

      articles.push(newArticle);
      res.redirect("/articles");

    } catch (err) {
      const validationErrors = {};
      err.errors.forEach(message => {
        const field = message.includes("Название") ? "title" : "text";
        validationErrors[field] = message;
      });

      return res.view("src/views/articles/new", {
        errors: validationErrors,
        article: req.body,
      });
    }
  });
  // END

  app.get("/articles/:id", (req, res) => {
    const article = articles.find(({ id }) => id === req.params.id);

    if (!article) {
      return res.status(404).send("article not found");
    }

    return res.view("src/views/articles/show", { article });
  });

  return app;
};
