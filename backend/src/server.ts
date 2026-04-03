
import app from "./app";
import "dotenv/config";
import { ENV } from "./config/env";

const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});