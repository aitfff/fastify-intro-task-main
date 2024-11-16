import fastify from "fastify";
import getCompanies from "./utils.js";

export default () => {
  const app = fastify();

  const companies = getCompanies();

  // BEGIN (write your solution here)
  app.get('/companies/:id', (request, reply) => {
    const { id } = request.params; 
    const company = companies.find(company => company.id === id);

    if (company) {
      reply.send(company);
    } else {
      reply.code(404).send("Company not found");
    }
  });
  // END

  return app;
};
