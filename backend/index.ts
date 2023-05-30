import * as dotenv from 'dotenv';
dotenv.config();

import express, {
  Express,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import colors from 'colors';
import icons from './src/routes/icons';
import HttpError from './src/models/http-error';

const app: Express = express();
const port: number = Number(process.env.PORT) ?? 5000;

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

app.use('/api/icons', icons);

app.get('/', (_, res: Response) => {
  res.send('API is running...');
});

app.use(() => {
  throw new HttpError('Could not find this route.', 404);
});

app.use(((error, _, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error?.code ?? 500);
  res.json({ message: error?.message ?? 'An unknown error occurred!' });
}) as ErrorRequestHandler);

app.listen(port, () => {
  console.log(
    colors.blue(
      `Server running in ${process.env.NODE_ENV} and listening on PORT ${port}`
    )
  );
});

export default app;
