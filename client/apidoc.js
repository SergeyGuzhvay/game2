
/**
 *
 * @api {post} /api/create_game          Create
 * @apiGroup Game
 * @apiParam {Number} gameId       Game ID
 * @apiVersion 1.0.0
 *
 * @apiSuccess 200  Game was successfully created
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "message": "Description"
 *     }
 *
 *
 * @apiError 403 Game with this ID already created
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Description"
 *     }
 *
 */

/**
 *
 * @api {post} /api/join_game          Join
 * @apiGroup Game
 * @apiParam {Number} gameId       Game ID
 * @apiParam {Number} userId       User ID
 * @apiParam {String} userName     User name
 * @apiParam {String} userAvatar   Path to user avatar
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Number} seat  Player's seat ID in the game
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "seat": 1
 *     }
 *
 * @apiError 403 Game is full
 * @apiError 404 Game with this ID is not found
 *
 */

/**
 *
 * @api {post} /api/start_game           Start
 * @apiGroup Game
 * @apiParam {Number} gameId       Game ID
 * @apiVersion 1.0.0
 *
 * @apiSuccess 200  Game started successfully
 *
 * @apiError 403 Game is not ready
 * @apiError 404 Game with this ID is not found
 *
 */

/**
 *
 * @api {post} /api/show_game           Show
 * @apiGroup Game
 * @apiParam {Number} gameId       Game ID
 * @apiParam {Number} seat       Player's seat ID in the game
 * @apiVersion 1.0.0
 *
 * @apiSuccess 200  GAME ITSELF (player need to be redirected here, when game is started)
 *
 */

/**
 *
 * @api {get} /api/game_info/:id     Get basic info
 * @apiGroup Game
 * @apiParam {Number} id       Game ID
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Number} players  Number of players in the game
 * @apiSuccess {Boolean} isReady  Is game ready to start
 * @apiSuccess {Boolean} isStarted  Is game already started
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "players": 3,
 *      "isReady": true,
 *      "isStarted": false
 *     }
 *
 *
 * @apiError 404 Game with this ID is not found
 *
 */