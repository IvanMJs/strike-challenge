import app from './app';
import { config } from './config/environment';

const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default server;
