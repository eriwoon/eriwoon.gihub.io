RaceList = ['orc','tauren','dwarf','nightelf','bloodelf','draenei','human','undead','gnome','troll'];
ClassList = ['warrior','hunter','shaman','rogue','mage','druid','paladin','warlock','priest','dk'];
NameList = ['殒落的樱花づ', '稀梦@', '風有霧', '时间风干了我们的悲伤', '╰◇生如夏花灿烂', '橘和柠', '陌上青苔', '纯白的梦。', '夜幕篱下浅笙歌°', '梦里、訴說著對你的思念', '墨锦倾城染白衣', '夜未央゛樱花落ζ', '蒲公英的梦想 Φ', '对妳╮俄输德彻底', '花开雨落又逢春i', '〝苏烟', '划一舟意中人', '游鲤醉花', '伴你月光下', '似识镜花', '墨初@', '转角、一起走', '浮夸了年华丶', '心锁了雾.', '心灵的触动、', '你是暖光i', '一曲琵琶半遮面シ', '忆 倾城', '阳光笑脸', '桃风杏雨', '〗斷ホ乔殘χμё〖', '虚拟世界、痛苦', '那是雨不是眼泪', '沉鱼一梦', '动听の歌', '披肩女神', '瞳孔印温柔', '流星、划过sky', '似最初', 'bloom.(绽放)', '在梦里丶', '雾隐青山林', '错过一路的风景', '〃阳光突然好温柔i', '初雪未霁', '悲伤中的那一缕阳光つ', '风向决定发型i', '淡存丶余光', '九公里浅绿', '- 散落在巴黎铁塔旳樱花。', '青花影', '执灯一盏', '陋巷', '梦念人.', '白衬杉格子梦', '风再起时', '一世倾城丶繁华已去°', '记得、遗忘', '朦胧感。', '余音未静﹌', '清风无痕', '一米阳光°几度温暖', '微笑的、侧脸', '偷得浮生', '雨樱', '一地月光'];
var getRandomName = () => NameList[Math.floor((Math.random()*NameList.length))];
var getRandomClass  = () => ClassList[Math.floor((Math.random()*ClassList.length))];
var getRandomRace = () => RaceList[Math.floor((Math.random()*RaceList.length))];

function i18n() {}
i18n.raceMapping = {'orc': "兽人", 'tauren': '牛头人', 'dwarf':'矮人', 'nightelf':'暗夜精灵', 'bloodelf':'血精灵', 'draenei':'德莱尼', 'human':'人类', 'undead':'被遗忘者', 'gnome':'侏儒', 'troll':'巨魔'}
i18n.classMapping = { 'warrior': "战士", 'hunter':'猎人', 'shaman':'萨满', 'rogue':'潜行者', 'mage':'法师', 'druid':'德鲁伊', 'paladin':'圣骑士', 'warlock':'术士', 'priest':'牧师', 'dk':'死亡骑士' }

i18n.toRace = (race) =>i18n.raceMapping[race]
i18n.toClass = (Class) =>i18n.classMapping[Class]

var layersBindElements = []
var memberBindedRefresh = ""
function bindElementRefresh() {
    if(memberBindedRefresh != ""){
        memberBindedRefresh()
    }

    layersBindElements.forEach(function(bindElements) {
        if (bindElements && bindElements instanceof Array) {
            bindElements.forEach(function(pair) {
                pair[0].textContent = eval(pair[1])
            })
        }
    })


    localStorage.setItem("Save", JSON.stringify(Save))
}

class Layer {
    constructor() {
        this.elements = [] ;
        this.bindElements = [] ;
        layersBindElements.push(this.bindElements);
        console.log("Class created: " + this.constructor.name)
    }

    activate(){
        console.log("Class activated: " + this.constructor.name)
    }

    createElement(eleDef, parent) {
        if (!eleDef instanceof Array) {
            console.log("not Instaneof Array.") ;
            return 1;
        }
        if (parent == null) 
            parent = this.elements[this.elements.length - 1];

        var element = document.createElement(eleDef.element);
        if ("id" in eleDef) 
            element.setAttribute("id", eleDef.id);
        if ("class" in eleDef) 
            element.setAttribute("class", eleDef.class) ;
        if ("content" in eleDef) 
            element.textContent = eleDef.content;
        if ("bindContent" in eleDef) {
            element.textContent = eval(eleDef.bindContent) ;
            this.bindElements.push([element, eleDef.bindContent]);
        }
        if ("click" in eleDef) 
            $(element).click(eleDef.click);

        parent.appendChild(element) ;
        this.elements.push(element);
        return element;
    }

    destroy() {
        console.log("Class destroied: " + this.constructor.name)
        this.elements.forEach((element) => element.remove())
    }

}

class LayerRadioBox {
    constructor(layers, buttons, frame, activated = 0, selected = "selected") {
        this.layers = layers;
        this.buttons = buttons;
        this.frame = frame ;
        this.activated = activated
        this.selected = selected
        if (activated != -1){
            if(frame.length == 1){
                layers[activated].activate(frame[0]);
            }
            else if(frame.length == 2){
                layers[activated].activate(frame[0], frame[1])
            }
            buttons[activated].setAttribute("class", selected)
        }
    }

    switchTo (layerId) {
        if (this.activated != -1) {
            this.layers[this.activated].destroy() ;
            this.buttons[this.activated].removeAttribute("class")
        }
        
        if(this.frame.length == 1){
            this.layers[layerId].activate(this.frame[0]) ;
        }
        else if(this.frame.length == 2){
            this.layers[layerId].activate(this.frame[0], this.frame[1]) ;
        }

        this.buttons[layerId].setAttribute("class", this.selected)
        this.activated = layerId;
    }
}


class LayerPopup extends Layer{
    activate(){
        super.activate()
        this.mask = this.createElement({
            "element":"div",
            "class":"mask",
            "click":()=>this.destroy()
        }, body);
    }
}