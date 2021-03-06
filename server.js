require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();

const Controllers = require('./middleware/Controllers');

const getConfig = require('./configs/allConfigs');
const configs = getConfig();

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
const helmet = require('helmet');

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

const { checkUserData, Data } = require('./database/db');

app.get('/checkJwt', checkUserData);

app.get('/leagues/:countryName', Controllers.getallLeaguesController);
app.get('/teams/:leagueId', Controllers.getallTeamesController);

app.get('/lookup/:idTeam', Controllers.getallTeamData);
app.get('/player/:playerId', Controllers.getPlayersController);
app.get('/teamEvents/:teamId', Controllers.getTeamEventsById);
app.get('/lookupByName/:name', Controllers.teamDataByName);

app.get('/all', Data.getUsers);
app.get('/user/:id', Data.showUser);
app.patch('/updateUser/:id', Data.updateUser);
// app.post('/Createuser', createUser);
// app.delete('/removeUser/:id', removeUser);

app.get('/players/:club', Controllers.getPlayersController);

mongoose.connect(configs.AtlasDataBaseConnection, configs.ConnectionParameters);
const db = mongoose.connection;
const PORT = configs.PORT;
db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.clear();
  console.log('Mongoose is Connected!');
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
});
