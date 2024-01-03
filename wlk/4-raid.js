class LayerRaid extends Layer {
    activate(frame, frame2){
        super.activate(frame);
        
        var raidMainFrame = this.createElement({
            "element":"div"
        }, frame);

        var raidMenuBar = this.createElement({
            "element":"div",
            "class":"menubar"
        }, frame2);
        var buttonRaid = this.createElement({
            "element":"span",
            "content":"清理已结束团战",
            "click":()=>console.log("clicked at 清理")
        }, raidMenuBar);
        var buttonRaidList = this.createElement({
            "element":"span",
            "content":"开组副本",
            "click":()=>raidLayers.swithTo(0)
        }, raidMenuBar);

        var raidLayers = new LayerRadioBox(
            [new LayerRaidList],
            [buttonRaidList],
            [frame]
        );
    }
}

class LayerRaidList extends Layer {
    activate(frame){
        super.activate(frame);
        for(let i in raid){
            let card = this.createElement({
                "element":"div",
                "class":"card"
            }, frame);
            this.createElement({
                "element":"div",
                "content":raid[i].name
            }, card);
            this.createElement({
                "element":"div",
                "class":"cardStatus",
                "content":raid[i].player + "人 掉落装等" + raid[i].gearlevel[0] + '~' + raid[i].gearlevel[1]
            }, card);
        }
    }
}


//class LayerRaidList e