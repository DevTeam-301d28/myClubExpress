const jwtVerify = require('../security/checkJwt.controller');
const Data = {};
const UserModel = require('./Models/Users');

async function checkUserData(request, response) {
  let token = request.headers.authorization.split(' ')[1];
  jwtVerify(token, valid);
  async function valid(jwtUser) {
    const email = jwtUser.email;
    const nickname = jwtUser.given_name + ' ' + jwtUser.family_name;
    let favouriteleague, favTeamName, selectedSport, favPlayer;
    favouriteleague = 'NA';
    favTeamName = 'NA';
    favTeamId = 'NA';
    selectedSport = 'NA';
    favPlayer = 'CR7';
    searchHistory = [1];
    await UserModel.find({ email }, (err, data) => {
      if (err) throw err;
      if (!data.length > 0) {
        data[0] = {
          email,
          nickname,
          favouriteleague,
          favTeamName,
          favTeamId,
          selectedSport,
          favPlayer,
          intrestedInTeams: [1],
          intrestedInPlayers: [1],
          intrestedInLeauges: [1],
        };
        let thisUser = new UserModel(data[0]);
        thisUser.save();
      }

      response.send(data[0]);
    });
  }
}

Data.getUsers = async (req, res) => {
  UserModel.find()
    .then((all) => {
      if (all) {
        res.json(all);
      } else {
        res.status(404).json('no users');
      }
    })
    .catch((err) => res.json({ error: err }));
};
Data.createUser = async (req, res) => {
  let data = req.body;
  newUser = new User(data);

  newUser
    .save()
    .then((doc) =>
      res.json({ message: 'user created succefully', user: newUser }),
    )
    .catch((err) => console.log(err));
  //
};
Data.showUser = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  UserModel.findById(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json('user with that id is not found');
      }
    })
    .catch((err) =>
      res.status(500).json({ message: 'user not found', error: err }),
    );
};

const axios = require('axios');
Data.updateUser = async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  let newData = {};
  let arr = Object.keys(data);
console.log(id)
  let theUser = await axios
    .get(`https://myclub-1.herokuapp.com/user/${id}`)
    .then((resp) => {
      return resp.data;
    }).catch(err => {console.log('error something happened: ' + err)});

  console.log(theUser);
  if (data.intrestedInLeauges) {
    theUser.intrestedInLeauges.map((ele) => {
      data.intrestedInLeauges.push(ele);
    });
  }

  if (data.intrestedInPlayers) {
    theUser.intrestedInPlayers.map((ele) => {
      data.intrestedInPlayers.push(ele);
    });
  }

  if (data.intrestedInTeams) {
    theUser.intrestedInTeams.map((ele) => {
      data.intrestedInTeams.push(ele);
    });
  }

  console.log(data.intrestedInLeauges);
  arr.map((key) => {
    newData[key] = data[key];
  });

  UserModel.updateOne({ _id: id }, { $set: data })
    .then((updated) => {
      // console.log(newData);
      res.status(200).json({ message: 'updated sccussfully', upt: updated });
    })
    .catch((err) => {
      res.send(500).json({ error: err });
    });
};

Data.removeUser = async (req, res) => {
  let id = req.id;
  User.deleteOne(id)
    .then((result) =>
      res
        .status(200)
        .json({ message: 'user deleted succesully', reslt: result }),
    )
    .catch((err) => res.status(500).json({ error: err }));
};

module.exports = {
  checkUserData,
  Data,
};
