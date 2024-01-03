g_data = ""

function ajaxDownload(filename, func){
    $.ajax({
        type     : "GET",
        url      : filename,
        cache    : false,
        dataType : "text",
        success  : func
    }).done(function(){console.log("Ajax done:" + filename)})
}

function processImage(data){
    //g_data = data.split("\n");
    g_data = JSON.parse(data)
    //g_data.pop()
    setImages()
    
}

function main(){
    ajaxDownload("image.json",processImage);
    //setBackground();

}

function Log(log){
    $(".log").append($("<p>" + log + "</p>"))
    console.log(log)
}


function setImages(){
    $(".pictures").empty();
    $(".sentence").empty();
    image_width = $(".pictures").width()  / 3 < 200 ? Math.floor($(".pictures").width() / 3) : 200
    image_height = image_width * 0.65
    
    num_of_images_per_line = Math.floor($(".pictures").width() / image_width)

    for(let i = 0; i < g_data.length && i < num_of_images_per_line * 3; i++){
        id = g_data.length - i - 1
        if(i < num_of_images_per_line){
            $(".pictures").append("<img class='image' id='Image_" + (id) + "' src=" + g_data[id].picURL + " title=\"" + g_data[id].name + "\"" + ">")
        }
        else{
            $(".pictures").append("<img class='image hidden' id='Image_" + (id) + "' src=" + g_data[id].picURL + " title=\"" + g_data[id].name + "\"" + ">")
        }
        
    }
    $(".hidden").hide();
    $(".pictures").append("<div/>")
    $(".pictures").append("<p style='cursor:pointer;display:inline-block;margin-right:20px;' class='button'><svg t='1634634779585' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='15228' width='32' height='32'><path d='M512 248.746667L647.253333 384l60.373334-60.373333L512 128l-195.626667 195.626667L376.746667 384 512 248.746667z m0 526.506666L376.746667 640l-60.373334 60.373333L512 896l195.626667-195.626667L647.253333 640 512 775.253333z' fill='#ffffff' p-id='15229'></path></svg></p>")
    $(".pictures").append("<p style='cursor:pointer;display:inline-block;margin-right:20px;' class='button2'><svg t='1634634694770' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='13575' width='32' height='32'><path d='M316.373333 792.96L376.746667 853.333333 512 718.08 647.253333 853.333333l60.373334-60.373333L512 597.333333l-195.626667 195.626667z m391.253334-561.92L647.253333 170.666667 512 305.92 376.746667 170.666667l-60.373334 60.373333L512 426.666667l195.626667-195.626667z' fill='#ffffff' p-id='13576'></path></svg></p>")
    $(".pictures").append("<p style='cursor:pointer;display:inline-block;margin-right:20px;' class='picdownload'><svg t='1634634844068' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='16044' width='32' height='32'><path d='M704 341.333333h64a64 64 0 0 1 64 64v362.666667a64 64 0 0 1-64 64H256a64 64 0 0 1-64-64V405.333333a64 64 0 0 1 64-64h64v64h-64v362.666667h512V405.333333h-64v-64z m-154.794667-212.266666l0.042667 347.456 74.005333-74.026667 45.226667 45.248-150.826667 150.848-150.848-150.826667 45.248-45.269333 73.173334 73.173333V129.066667h64z' p-id='16045' fill='#ffffff'></path></svg></p>")
    
    $(".button2").hide();

    $('.image').css({  "width":image_width * 0.9  + "px", 
                    "height": image_height * 0.9  + "px", 
                    "padding": image_width * 0.05 + "px",
                    "cursor": "pointer"})
    $(".image").click(function(e){
        id = e.target.id.split("_")[1]
        //change background
        $("body").css("background-image", 'url("' + $(this)[0].attributes.src.value + '")');
        //change phrase
        if("picInfo" in g_data[id]){
            $('.sentence').empty()
            $('.sentence').append("<p class='s0'>" + g_data[id].picInfo + "</p>")
        }
        else if("phraseTitle" in g_data[id]){
            $('.sentence').empty()
            $('.sentence').append("<p class='s0'>" + g_data[id].phraseTitle + "</p>")
            $('.sentence').append("<p class='s1'>" + g_data[id].phraseDesc + "</p>")
        }

    });

    if(g_data.length < num_of_images_per_line) {
        $(".button").hide();
    }
    $(".button").click(function(){
        $(".hidden").show();
        $(".button").hide();
        $(".button2").show();
    });
    $(".button2").click(function(){
        $(".hidden").hide()
        $(".button2").hide();
        $(".button").show();
    });
    $(".picdownload").click(function(){
        url = $("body").css("background-image").slice(5,-2)
        Log(url)
        filename = url.split(".")[3].split("_")[0]
        Log(filename)
        
        picDownload(url, filename)
    });



    //set background
    Log(window.innerWidth + "x" + window.innerHeight )
    if(window.innerWidth / window.innerHeight < 1920 / 1080){
        w = 1920 * window.innerHeight / 1080
        h = window.innerHeight
    }
    else{
        w = window.innerWidth
        h = 1080 * window.innerWidth / 1920
    }
    Log(w + "x" + h)
    $("body").css("background-size", w + "px " + h + "px")
    
    id = g_data.length-1
    $('body').css("background-image", "url(" + g_data[id].picURL + ")");
    if("picInfo" in g_data[id]){
        $('.sentence').empty()
        $('.sentence').append("<p class='s0'>" + g_data[id].picInfo + "</p>")
    }
    else if("phraseTitle" in g_data[id]){
        $('.sentence').empty()
        $('.sentence').append("<p class='s0'>" + g_data[id].phraseTitle + "</p>")
        $('.sentence').append("<p class='s1'>" + g_data[id].phraseDesc + "</p>")
    }
    
}

window.onresize = setImages;


function processDictum(data) {
    s = JSON.parse(data);
    num=(new Date()).getMilliseconds() % s.length

    for(let i = 0; i < s[num].length; i++){
        $('.sentence').append("<p class='s" + i + "'>" + s[num][i] + "</p>")
    }

}

$(document).ready(main())


/* Pic Download related functions*/

function picDownload(url, filename) {

    getBlob(url, function (blob) {
        saveAs(blob, filename);
    });

};

function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement('a');
        var body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    };
}
