
Key_ENTER = 13

var toFileName = {}
function nameMapping(data){
    toFileName = JSON.parse(data)
}

function ajaxDownload(filename, func){
    $.ajax({
        type     : "GET",
        url      : filename,
        cache    : false,
        dataType : "text",
        success  : func
    }).done(function(){console.log("Ajax done:" + filename)})
}

var formulas = []
function processFormula(data){
    lines = data.split("\n")
    for(let i = 1; i<lines.length; i++){
        /*console.log(dataList[i])
        $("ol").append("<li>" + dataList[i] + "</li>")*/
        items = lines[i].split(',');
        formula = {}
        for(let j = 0; j < items.length; j ++){
            switch (j){
                case 0:
                    formula.name = items[j]
                    break
                case 2:
                    formula.manufacturer = items[j];
                    break;
                case 4:
                case 6:
                    materials = []
                    m = items[j].split("+")
                    for (let k = 0; k < m.length; k++){
                        n = m[k].split("*");
                        materials.push({number:n[0], name:n[1]})
                    }
                    if (j == 4){
                        formula.targets = materials;
                    }
                    else if(j == 6){
                        formula.sources = materials;
                    }
                    break;
                case 5:
                    formula.duration = items[j];
                    break;
            }
        }
        formula.origin = items
        formulas.push(formula)
    }
}


function clear(){
    $("#flow").empty()
    $("#new_flow").empty()
    $("#all_sources").empty()
    $("#all_manufactures").empty()
}


function inArray(value, array){
    for (let j = 0; j < array.length; j++){
        if(array[j][1] == value)
            return j;
    }
    return -1;
}

//将用户上次使用的状态保留下来，用户下次进入网页会恢复上次的选择
function saveCurrentStatus()
{
    save = {}
    sources = JSON.parse(JSON.stringify(sources_default))

    for(let i = 0; i < sources_available.length; i ++){
        if($("#sa" + i).is(":checked") == true){
            sources.push(sources_available[i])
            save[sources_available[i]] = "checked"
        }
        else{
            save[sources_available[i]] = "unchecked"
        }
    }    
    for(let i = 0; i < sources_special.length; i ++){
        if($("#ss" + i).is(":checked") == true ){
            sources.push(sources_special[i])
            save[sources_special[i]] = "checked"
        }
        else{
            save[sources_special[i]] = "unchecked"
        }
    }
    for(let i = 0; i < manufacturer_type.length; i ++){
        if($("#mt" + i).is(":checked") == true ){
            sources.push(manufacturer_type[i])
            save[manufacturer_type[i]] = "checked"
            manufacturer_speed = manufacturer_type[i]
        }
        else{
            save[manufacturer_type[i]] = "unchecked"
        }
    }

    save.name = $("#name").val()
    save.number = $("#number").val()

    localStorage.setItem("save", JSON.stringify(save))

    console.log(sources)
}


function search()
{
    clear()
    saveCurrentStatus()

    manufacturer_speed = 1 //工作台的工作速度
    for(let i = 0; i < manufacturer_type.length; i ++){
        if($("#mt" + i).is(":checked") == true ){
            manufacturer_speed = manufacturer_type[i]
            break
        }
    }
    console.log("manufacturer_speed = " + manufacturer_speed)


    //初始化需求
    targets = []
    console.log("目标产物：" + $("#name").val() + "x" + $("#number").val())
    targets.push({
        name:       $("#name").val(),
        number:     $("#number").val(),
        used_for:   []
    })

    count = 0 //方式死循环的计数器
    flows = []
    all_materials_needed = {}
    while(targets.length > 0 && count < 1000){
        count ++;
        target = targets.pop()

        m = $.inArray(target.name, sources)
        if(m >= 0){
            if(all_materials_needed[target.name] != undefined){
                all_materials_needed[target.name] += target.number
            }
            else{
                all_materials_needed[target.name] = target.number
            }
            //console.log(r[0] + " in Source list")
            continue;
        }

        let i = 0
        for(;i < formulas.length; i++){
            //首先判断是否是高效，如果是高效需要确认是否有对应的元素
            if(i < sources_special.length && $("#ss" + i).is(":checked") == false)
                continue
            if(i == 6 &&  $("#ss1").is(":checked") == false)
                continue
            
            //判断当前的配方是不是能够生产出目标产物
            formula = formulas[i]
            for(k = 0; k < formula.targets.length; k++)
                if(formula.targets[k].name == target.name)
                    break;
            if(k < formula.targets.length){
                for(let j = 0; j < formula.sources.length; j++){
                    targets.push({
                        name:       formula.sources[j].name,
                        number:     target.number / formula.targets[k].number * formula.sources[j].number, 
                        used_for:   target
                    })
                    
                }
                /*//0:产品 1：需求数量 2：目标用户 3：设备 4：时长 5：需要的原料
                flow.push([r[0],                                    //产品
                    r[1],                                           //需求数量
                    r[2],                                           //目标用户
                    formula.manufacturer,                       //设备
                    formula.duration/formula.target[k][0], //时长
                    formula.source])                             //需要的原料*/

                flows.push({
                    target:target,
                    formula:formula
                })
                break;
            }
        }
        if (i == formulas.length){
            console.log("cannot find "+ target.name + ", break!")
            return;
        }
    }
    //所有的生产线详情
    console.log("flow", flows)

    //材料总需求量
    console.log("all_materials_needed", all_materials_needed)
    for (let i in all_materials_needed){        
        $("#all_sources").append('\
            <div class="image_desc_new">\
                <img class="image_new" src="images/icons2/' + toFileName[i] + '-40px.png">\
                <span class="desc_new">' + i + 'X' + all_materials_needed[i] + '</span></div>'
            )
    }
    $("#all_needed").append("<br/>")

    //生产线汇总 
    flows_sum = []
    for(let i = 0; i < flows.length; i++){
        flow = flows[i]

        for(j = 0; j < flows_sum.length; j++)
            if(flow.formula.name == flows_sum[j].formula.name)
                break
        if(j < flows_sum.length){
            flows_sum[j].targets.push(flow.target)
        }
        else {
            flows_sum.push({
                formula:flow.formula,
                targets:[flow.target],
                targets_sum:[]
            })
        }
    }
    //console.log("flows_sum", flows_sum)

    //对flow_sum的target字段进行合并，同时统计需要的总设备数量
    all_manufactories_needed = {}  
    for(let i = 0; i<flows_sum.length; i++){
        flow_sum = flows_sum[i]
        
        max_manufacturer_number = -1
        max_manufacturer_number_id = -1
        //基于formula的target字段进行计算
        for(let j = 0; j < flow_sum.formula.targets.length; j ++){
            target = flow_sum.formula.targets[j]

            target_sum = {
                name: target.name,
                number:0,
                manufacturer_number:0,
                number_per_production:target.number,
                used_for_targets:[]
            }
            //将targets中的内容合并
            for(let k =0; k < flow_sum.targets.length; k ++)
                if(flow_sum.targets[k].name == target.name){
                    if(typeof(flow_sum.targets[k].number) == "string")
                        target_sum.number += parseInt(flow_sum.targets[k].number)
                    else
                        target_sum.number += flow_sum.targets[k].number
                    target_sum.used_for_targets.push(flow_sum.targets[k])
                }
            //需要的设备数量
            target_sum.manufacturer_number = target_sum.number / target_sum.number_per_production * flow_sum.formula.duration / 60 
            
            //对于制作台类的情况，需要根据制作台的等级使用不同的数量
            if(flow_sum.formula.manufacturer == "制造台"){
                target_sum.manufacturer_number /= manufacturer_speed
            }


            if(target_sum.manufacturer_number > max_manufacturer_number){
                max_manufacturer_number = target_sum.manufacturer_number
                max_manufacturer_number_id = j
            }
            flow_sum.targets_sum.push(target_sum)
        }

        //基于max_manufacturer_number_id计算多余的量
        for(let j = 0; j < flow_sum.targets_sum.length; j ++){
            flow_sum.targets_sum[j].number_additional = flow_sum.targets_sum[max_manufacturer_number_id].number * flow_sum.targets_sum[j].number_per_production / flow_sum.targets_sum[max_manufacturer_number_id].number_per_production - flow_sum.targets_sum[j].number
        }
        
        flow_sum.max_manufacturer_number = max_manufacturer_number
        flow_sum.max_manufacturer_number_id = max_manufacturer_number_id

        //输出设备汇总数据
        if(flow_sum.formula.manufacturer in all_manufactories_needed){
            all_manufactories_needed[flow_sum.formula.manufacturer] += Math.ceil(max_manufacturer_number)
        }
        else{
            all_manufactories_needed[flow_sum.formula.manufacturer] = Math.ceil(max_manufacturer_number)
        }
    }

    sum = 0 //总设备数量
    console.log("all_manufactories_needed", all_manufactories_needed)
    for (let i in all_manufactories_needed){
        $("#all_manufactures").append('\
            <div class="image_desc_new">\
                <img class="image_new" src="images/icons2/' + toFileName[i  + (i == "制造台" ? manufacturer_speed : "")] + '-70px.png">\
                <span class="desc_new">' + i + 'X' + all_manufactories_needed[i] + '</span></div>'
            )
        sum += all_manufactories_needed[i]
    }
    //计算每个产品的平均设备数量
    avg = Math.ceil(sum / flows_sum.length)
    console.log("sum:" + sum + ", avg:" + avg)
    console.log("flows_sum", flows_sum)

    //生产线排序：从原料开始，到能生产的，从能生产的中找到能够降低轨道数量的
    count = 0
    flows_orderred = []
    sources_from_flow_orderred = []
    while(flows_orderred.length < flows_sum.length && count < 1000){
        count ++
        //找到所有能生产的
        produce_able = []
        for(let i = 0; i < flows_sum.length; i++){
            flow_found_flag = 0
            for(k = 0; k < flows_orderred.length; k++){
                if(flows_orderred[k].formula.name == flows_sum[i].formula.name){
                    flow_found_flag = 1
                    break
                }
            }
            if(flow_found_flag == 1)
                continue

            for(j = 0; j < flows_sum[i].formula.sources.length; j++){//检查每一样原材料是否都能获得
                if($.inArray(flows_sum[i].formula.sources[j].name, sources) == -1 && 
                $.inArray(flows_sum[i].formula.sources[j].name, sources_from_flow_orderred) == -1)//从原始里没有找到
                    break

            }
            if(j == flows_sum[i].formula.sources.length){//所有原料都可获得，所以这个当前是可以生产的
                produce_able.push(flows_sum[i])
            }
        }
        
        //简单排序，保证每次查询的结果都相同的，同时也将需要最多输入的放在前面
        produce_able = produce_able.sort(function(m,n){
            if(m.formula.sources.length - m.formula.targets.length > n.formula.sources.length - n.formula.targets.length )
                return -1;
            if(m.formula.sources.length - m.formula.targets.length < n.formula.sources.length - n.formula.targets.length )
                return 1;
            if(m.formula.name > n.formula.name)
                return -1;
            return 1;    
        })

        flows_orderred.push(produce_able[0])
        
        for(let i = 0; i < produce_able[0].formula.targets.length; i ++){
            if($.inArray(produce_able[0].formula.targets[i].name, sources_from_flow_orderred) == -1)
                sources_from_flow_orderred.push(produce_able[0].formula.targets[i].name)
        }
    }
    console.log("flows_orderred", flows_orderred);

    //新的输出详情到new_flow
    $("#new_flow").append('\
        <tr style="background:black; color:white;">\
        <th>#</th>\
        <th>原料</th>\
        <th>设备</th>\
        <th>产物</th>\
        </tr>')

    for(let i = 0; i < flows_orderred.length; i++){
        //0:source 1：需求数量 2：目标用户 3：设备 4：时长 5:需要的原料
        let flow = flows_orderred[i]
    
        if(i % 2 == 0)
            content = '<tr style="background:lightgray">'
        else
            content = '<tr>'
        content += 
            '<td>' + (i+1) + '</td>\
            <td>'
                for(let j = 0; j < flow.formula.sources.length; j++){
                    let source = flow.formula.sources[j]
                    content += '<div class="image_desc_new"><img class="image_new" src="images/icons2/' + toFileName[source.name] + '-40px.png"><span class="desc_new">' + source.name + 'X' +  
                    (source.number * flow.targets_sum[flow.max_manufacturer_number_id].number / flow.formula.targets[flow.max_manufacturer_number_id].number)  +  '</span></div>'
                }
            content += '</td>\
            <td>\
                <table><tr>\
                    <td><img class="image_bigger_new"src="images/icons2/' + toFileName[flow.formula.manufacturer + (flow.formula.manufacturer == "制造台" ? manufacturer_speed : "")] + '-70px.png"></td>\
                    <td>\
                        <p style="margin:0;">' + flow.formula.manufacturer + 'X' + Math.ceil(flow.max_manufacturer_number) +  '</p>\
                    </td>\
                </tr></table>\
            </td>\
            <td>'
                for(let j = 0; j < flow.targets_sum.length; j++){
                    target = flow.targets_sum[j]
                    string = target.name + 'X' +  (target.number + target.number_additional)
                    if(target.number_additional > 0)
                        string += "(多余" + target.number_additional + ")"
                    content += '<div class="image_desc_new"><img class="image_new" src="images/icons2/' + toFileName[target.name] + '-40px.png"><span class="desc_new">' + string + '</span></div>'
                }
            content += '</td>\
            </tr>'
        $("#new_flow").append(content)
    }
}

function processMaterials(data){
    lines = data.split("\n")
    for(let i = 1; i<lines.length; i++){    
        items = lines[i].split(',');
        secret = lines[i].split('"')[1];
        MATERIALS_MAPPING.push({

            title: items[0],
            alter: items[0],
            src  : items[2],
            secret:secret
        })}
    let tr = "<tr>"
    for(let i = 1; i<MATERIALS_MAPPING.length + 1; i++){
        tr += '<td><img title="'  + MATERIALS_MAPPING[i-1]["title"] +
                     '" src="'    + MATERIALS_MAPPING[i-1]["src"] + 
                     '" secret="' + MATERIALS_MAPPING[i-1]["secret"]  +'"></td>'
        if(i % 14 == 0 || i == MATERIALS_MAPPING.length){
            $("#materials").append(tr)
            tr = "<tr>"
        }
    }
}

function processBuildings(data){
    lines = data.split("\n")
    for(let i = 1; i<lines.length; i++){    
        items = lines[i].split(',');
        secret = lines[i].split('"')[1];
        BUILDINGS_MAPPING.push({

            title: items[0],
            alter: items[0],
            src  : items[2],
            secret:secret
        })}
    let tr = "<tr>"
    for(let i = 1; i<BUILDINGS_MAPPING.length + 1; i++){
        tr += '<td><img title="'  + BUILDINGS_MAPPING[i-1]["title"] +
                     '" src="'    + BUILDINGS_MAPPING[i-1]["src"] + 
                     '" secret="' + BUILDINGS_MAPPING[i-1]["secret"]  +'"></td>'
        if(i % 14 == 0 || i == BUILDINGS_MAPPING.length ){
            $("#buildings").append(tr)
            tr = "<tr>"
        }
    }
}