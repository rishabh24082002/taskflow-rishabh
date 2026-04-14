
require('dotenv').config();
const express = require('express');
const authMiddleware = require('./middlewares/auth.middleware');
const loggerMiddleware = require('./middlewares/logger.middleware');
const errorMiddleware = require('./middlewares/error.middleware');
 
const app = express();


app.use(express.json());
app.use(loggerMiddleware);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/tasks', authMiddleware, require('./routes/task.routes'));
app.use('/projects', authMiddleware, require('./routes/project.routes'));

app.use(errorMiddleware);


module.exports = app;