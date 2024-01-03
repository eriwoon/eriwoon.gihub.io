//初始化所有需要的原材料
sources_available = ["硅石","氢","重氢","硫酸"]
sources_special  = ["可燃冰","光栅石","分型硅石","金伯利矿","单极磁石","刺笋结晶"]
sources_default = ['铁矿','铜矿','煤矿','石矿','石油', '钛矿','水', '临界光子']
manufacturer_type = [0.75, 1, 1.5]
MATERIALS_MAPPING = []
BUILDINGS_MAPPING = []

function main(){
    //初始化界面
    save = localStorage.getItem("save");
    if(save)
        save = JSON.parse(save)

    for(let i = 0; i < sources_available.length; i ++){
        $("#sources_available").append('<input id="sa'+i+'" type="checkbox"/>\
            <label for="sa'+i+'">足够的'+sources_available[i]+'</label>')
            if(save && save[sources_available[i]] && save[sources_available[i]] == "checked")
                $("#sa" + i).prop("checked",true)
    }


    $("#source_check").append("<p></p>")
    for(let i = 0; i < sources_special.length; i ++){
        $("#sources_special").append('<input id="ss'+i+'" type="checkbox"/>\
            <label for="ss'+i+'">足够的'+sources_special[i]+'</label>')
            if(save && save[sources_special[i]] && save[sources_special[i]] == "checked")
                $("#ss" + i).prop("checked",true)
    }

    for(let i = 0; i < manufacturer_type.length; i ++){
        $("#manufacturer_type").append('<input id="mt'+i+'" type="radio" name="manufacturer_type"/>\
            <label for="mt'+i+'">工作台 '+manufacturer_type[i]+'x 速度</label>')
            if(save && save[manufacturer_type[i]] && save[manufacturer_type[i]] == "checked")
                $("#mt" + i).prop("checked",true)
    }


    //根据用户上次退出时的状态进行恢复现场
    if(!save){
        $("#sa0").prop("checked",true)
        $("#mt1").prop("checked",true)
    }

    if(save && save.name)
        $("#name").val(save.name)
    else
        $("#name").val("小型运载火箭")

    if(save && save.number)
        $("#number").val(save.number)
    else
        $("#number").val(10)


    $("input").keydown(function(event){
        if(event.which == Key_ENTER){
            search()
        }
    })

    //事件绑定
    $("#search").click(search)
    $("#clear").click(clear)

    ajaxDownload("docs/formula_r_utf8.csv", processFormula)
    ajaxDownload("docs/name-mapping.json", nameMapping)
    ajaxDownload("docs/materials.csv", processMaterials)
    ajaxDownload("docs/buildings.csv", processBuildings)
}



$(document).ready(
    main()
)