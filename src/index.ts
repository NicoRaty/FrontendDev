import express from "express";
import placesRouter from "./routers/places";
import loginRouter from "./routers/login";
import usersRouter from "./routers/users";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import cors from "cors";

const server = express();
server.use(express.json());
server.use(cors());

server.use("/api/places", placesRouter);
server.use("/api/login", loginRouter);
server.use("/api/users", usersRouter);

const doc = yaml.load("./doc.yml");
server.use("/api/doc", swaggerUi.serve, swaggerUi.setup(doc));

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`> Server running on http://localhost:${PORT}`);
    console.log(`> Documentation available at http://localhost:${PORT}/api/doc`);
});