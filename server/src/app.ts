import express, { Request, Response } from 'express';
import cors from 'cors'; 
import morgan from "morgan"
import routes from "./routes/index"

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan("tiny"));
app.use(cors({
    origin: 'http://localhost:5173', 
}))
app.use('', routes)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to advium backend.');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});