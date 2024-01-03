//default2.js
Restore = {
    Guild: {
        Name: "One Wow 工会",
        Level: 13,
        Gold: 107012,
        Mixture: 3
    },

    Member: [{
        Name: "圣堂",
        Race: "orc",
        Class: "warrior",
        Level: 269,
        Gear: 36,
        Buff: []
    },
    {
        Name: "一、落雨流觞",
        Race: "tauren",
        Class: "druid",
        Level: 281,
        Gear: 25,
        Buff: []
    }],

    NewMember : [{}],

    Inventory: [{
        Item_ID: 1,
        Number: 2368
    },
    {
        Item_ID: 2,
        Number: 1730
    }],

    Collection: {
        Weapon: [1, 2, 3, 4, 5],
        Suite: [{
            ID: 1,
            items: [1, 3, 5]
        },
        {
            ID: 1,
            items: [1, 2, 3, 4, 5]
        }],
        Mount: [1, 2, 3, 4],
        Pet: [1, 2, 3, 4]
    }
}

raid = [{
    name:"祖尔格拉布",
    boss:["猎手阿图门", "boss2", "boss3"],
    gearlevel:[55,60],
    player:25
    },
    {name:"奥妮克希亚的巢穴",
    boss:["boss1", "boss2", "boss3"],
    gearlevel:[59,66],
    player:25
    },
    {name:"熔火之心 黑翼之巢 安其拉废墟 安其拉神殿 纳克萨玛斯",
    boss:["boss1", "boss2", "boss3"],
    gearlevel:[59,66],
    player:25
    }
];

//localStorage.removeItem("Save")
var Save = localStorage.getItem("Save");
if (!Save){
    Save = Restore;
    localStorage.setItem("Save", JSON.stringify(Save))
}
else{
    Save = JSON.parse(Save)
}

var body = document.getElementById('canvas');

$(document).ready(function() {
    //////业务逻辑    
    new LayerFramework().activate(body)

})