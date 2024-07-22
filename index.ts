import app from "./src/config/express";
import logger from "./src/config/logger";
import db from "./src/config/database";
import envs from "./src/config/envs";

const PORT = envs.PORT ?? 3003;

db.connect()
  .then(() => {
    logger.info("Database connected");
    app.listen(PORT, () => {
      logger.info(
        `Server is running on port ${PORT}, url = http://localhost:${PORT}`,
      );
    });
  })
  .catch((err) => {
    logger.error(err);
  });
