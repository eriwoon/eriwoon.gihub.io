class LayerGuild extends Layer{
    activate(frame, frame2){
        super.activate(frame, frame2)

        var guildMainFrame = this.createElement({
            "element": "div"
        }, frame) ;
    
        var menubar = this.createElement({
            "element": "div",
            "class":"menubar"
        }, frame2);
        var buttonMember = this.createElement({
            "element": "span",
            "content": "会员",
            "click": () =>guildLayers.switchTo (0)
        }, menubar) ;
        var buttonQuest = this.createElement({
            "element": "span",
            "content": "任务",
            "click": () =>guildLayers.switchTo (1)
        }, menubar) 
        var buttonInventory = this.createElement({
            "element": "span",
            "content": "仓库",
            "click": () =>guildLayers.switchTo (2)
        }, menubar) ;
        var buttonAchievement = this.createElement({
            "element": "span",
            "content": "收藏",
            "click": () =>guildLayers.switchTo (3)
        }, menubar) ;
        var buttonSetting = this.createElement({
            "element": "span",
            "content": "设置",
            "click": () =>guildLayers.switchTo (4)
        }, menubar);
    
        var guildLayers = new LayerRadioBox(
            [new LayerMember, new LayerQuest, new LayerInventory, new LayerAchievement, new LayerSetting],
            [buttonMember,buttonQuest,buttonInventory,buttonAchievement,buttonSetting], 
            [guildMainFrame],
            0);
    }
}
