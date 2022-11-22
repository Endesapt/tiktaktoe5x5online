const express=require('express');
const router = express.Router();
const{createNewLobby,getLobby,makeMove,getMatchInfo,getMapInfo,checkLobby}=require('../controllers/gamecontroller');

// Home page route.
router.get('/createNewLobby',createNewLobby);

//существует ли лобби 
router.use('/:id',checkLobby);

router.get("/:id",getLobby);
router.post("/:id/makeMove",makeMove);
router.get('/:id/getMatchInfo',getMatchInfo);
router.get('/:id/getMapInfo',getMapInfo);

module.exports=router;
