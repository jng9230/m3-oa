import express, { type Request, type Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express adasdas TypeScript!');
});


app.get('/', (req: Request, res: Response) => {
    res.send('Hello from Express adasdas TypeScript!');
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});