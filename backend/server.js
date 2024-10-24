const express = require('express');
const listEndpoints = require('express-list-endpoints');

const authRoutes = require('./routes/auth.js');
const writeRoutes = require('./routes/write.js');
const editRoutes = require('./routes/edit.js');
const blogRoutes = require('./routes/getBlog.js');
const uploadRoutes = require('./routes/upload.js');
const commentRoutes = require('./routes/comment.js');
const replyRoutes = require('./routes/reply.js');
const getCommentsRoutes = require('./routes/getComments.js');
const getReplysRoutes = require('./routes/getReplys.js');
const bodyParser = require('body-parser');
const getAll = require('./routes/blogs/getByTime.js');

const setupSwagger = require('./utils/swaggerui.js');
const cors = require('cors');


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the React frontend
}));


// OR if using express' own middleware (no body-parser)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
setupSwagger(app);

const PORT = process.env.PORT;

// Routes
app.use('/auth', authRoutes);
app.use('/write', [writeRoutes, editRoutes]);
app.use('/blog', [blogRoutes]);
app.use('/upload', uploadRoutes);
app.use('', [commentRoutes, replyRoutes]);
app.use('', [getCommentsRoutes, getReplysRoutes]);
app.use('/blogs', [getAll]);

// Route to list all endpoints
app.get('/routes', (req, res) => {
  const routes = listEndpoints(app);
  res.json(routes);
});

app.get('/', (req, res) => {
  return res.json(
    {
      "message": "Welcome to backend API!", 
      "swagger UI": "/docs"
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`[🎄] Server is running on http://localhost:${PORT}`);
});
