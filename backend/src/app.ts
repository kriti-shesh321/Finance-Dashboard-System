import express from 'express';
import authRoutes from './modules/auth/auth.routes';
// import userRoutes from './modules/user/user.routes';
import recordRoutes from './modules/record/record.routes';
// import dashboardRoutes from './modules/dashboard/dashboard.routes';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.send("It's working!");
});

app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/records", recordRoutes);
// app.use("/api/v1/dashboard", dashboardRoutes);

export default app;