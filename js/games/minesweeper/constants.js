const CELL_TYPE_COLOR = {
    "bomb": {
        "bg": [['#DA3236', '#DA3236'], 
               ['#F4840D', '#F4840D'], 
               ['#F4C20E', '#F4C20E'], 
               ['#008744', '#008744'], 
               ['#48E6F1', '#48E6F1'], 
               ['#4785ED', '#4785ED'], 
               ['#ED44B5', '#ED44B5']],
        "text": ['#8E2123', '#9F5607', '#9F7E09', '#01582C', '#2F969D', '#2F569A', '#9A2C76'],
    },
    "flag": {
        "bg": [["#8ECC39", "#A7D948"]],
        "text": ["#FFFFFF00"], // Transparent color
    },
    "revealed": {
        "bg": [["#D7B899", "#E5C29F"]],
        "text": ["#FFFFFF00", "#1975CE", "green", "red", "purple", "black", "maroon", "gray", "turquoise"],
    },
    "unrevealed": {
        "bg": [["#8ECC39", "#A7D948"]],
        "text": ["#FFFFFF00"], // Transparent color
    },
    "unrevealed-hover": {
        "bg": [["#B9DD76", "#BFE17C"]],
        "text": ["#FFFFFF00"], // Transparent color
    }
}