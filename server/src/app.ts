import express, { Request, Response } from 'express';
import cors from 'cors'; 
import morgan from "morgan"

const app = express();
const port = process.env.PORT || 3000;
app.use(morgan("tiny"));

app.use(cors({
    origin: 'http://localhost:5173', 
}))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });