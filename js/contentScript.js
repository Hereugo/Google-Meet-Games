//Globals
var station;

//Setup
(async () => {
    onReady('.crqnQb', '.c8mVDd', () => {
        initialize();
    });
    
    // Storage setup init values
    // sessionStorage.setItem('', JSON.stringify({}));
    let data = await getStorageData(null);

    await setStorageData({
        'language': data.language || "en",
        'bestScore': data.bestScore || "---"
    });
})();


function initialize() {
    station = new Station();

    station.addNewCartridge({
        "id": "minesweeper",
        "name": "Minesweeper",
        "description": "A simple minesweeper game",
        "imagePath": "img/minesweeper.png",
        "game": new MinesweeperGame()
    });

    p5Handler = new P5Handler();
}