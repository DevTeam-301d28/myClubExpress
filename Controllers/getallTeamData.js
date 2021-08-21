const express = require("express");
const app = express();
const axios = require("axios");
const TeamData = require("../Module/football/TeamData");


let getallTeamData=(req, res) => {
    axios
      .get(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${req.params.idTeam}`)
      .then((resp) => {
          let teamsdata=[]
        let data = resp.data.teams;
        data.map(item => {
          let team = new TeamData(item);
           
            teamsdata.push(team)
        });
  
        res.send(teamsdata);
      }
      );
}

module.exports=getallTeamData;