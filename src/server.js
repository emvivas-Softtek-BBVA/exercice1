import dotenv from "dotenv";
dotenv.config();

import { App } from "./App.js";

const app = App.getInstance();
const PORT = process.env.PORT || 3000;

app.expressApp.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
