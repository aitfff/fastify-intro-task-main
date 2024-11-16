import _ from "lodash";
import generatePosts from "../utils.js";

export default (app) => {
  const posts = generatePosts();

  // BEGIN (write your solution here)
  app.get("/posts", (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = 5;
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    // Если страница превышает допустимый диапазон, возвращаем пустой массив
    if (page > totalPages) {
      return res.view("posts/index", { posts: [], currentPage: page });
    }

    // Получаем нужные посты для текущей страницы
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    // Создаем массив пагинации
    const pagination = {
      currentPage: page,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return res.view("posts/index", { posts: paginatedPosts, pagination });
  });

  // Обработчик для отображения конкретного поста
  app.get("/posts/:id", (req, res) => {
    const postId = req.params.id;
    const post = _.find(posts, { id: postId });

    if (!post) {
      return res.status(404).send("Page not found");
    }

    return res.view("posts/show", { post });
  });
  // END
};
