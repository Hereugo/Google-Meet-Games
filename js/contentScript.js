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

    // Add new games to the station
    // station.addNewCartridge(
    //     "snake", 
    //     "Snake", 
    //     "A simple snake game", 
    //     "img/snake.png",
    //     snakeSketch
    // );

    station.addNewCartridge(
        "minesweeper",
        "Minesweeper",
        "A simple minesweeper game",
        "img/minesweeper.png",
        new Minesweeper() 
    );
}