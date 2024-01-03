class LayerFramework extends Layer{
    activate(frame){
        super.activate(frame)
        //工会名称部分
        this.createElement({
            "element": "div",
            "class": "GuildName",
            "content": Save.Guild.Name
        }, frame);

        //顶部常驻的状态条
        var toolbar = this.createElement({
            "element": "div",
            "class": "toolBar"
        }, frame);

        this.createElement({
            "element": "span",
            "bindContent": "'👑' + Save.Guild.Level"
        }, toolbar);

        this.createElement({
            "element": "span",
            "bindContent": "'👨🏻‍🔧' + Save.Member.length"
        }, toolbar) ;
        this.createElement({
            "element": "span",
            "bindContent": "'💰' + Save.Guild.Gold"
        }, toolbar) ;
        this.createElement({
            "element": "span",
            "bindContent": "'🍵' + Save.Guild.Mixture",
            "click": function() {
                Save.Guild.Gold += 100 ;
                Save.Member[0].Level += 1 ;
                bindElementRefresh();
            }
        }, toolbar);

        //中间填充部分
        var mainFrame = this.createElement({
            "element": "div"
        }, body);

        //底部动作条
        var bottom = this.createElement({
            "element": "div",
            "class": "bottom"
        }, frame) 

        //为menubar预留的位置
        var menubarDiv = this.createElement({
            "element": "div"
        }, bottom) ;

        var bottomBar = this.createElement({
            "element": "div",
            "class": "bottomBar"
        }, bottom) ;
        var buttonGuild = this.createElement({
            "element": "span",
            "content": "工会",
            "class": "selected",
            "click": () =>mainFrameLayers.switchTo (0)
        },bottomBar) ;
        var buttonShop = this.createElement({
            "element": "span",
            "content": "商店",
            "click": () =>mainFrameLayers.switchTo (1)
        }, bottomBar) ;
        var buttonWorld = this.createElement({
            "element": "span",
            "content": "世界",
            "click": () =>mainFrameLayers.switchTo (2)
        }, bottomBar) ;
        var buttonRaid = this.createElement({
            "element": "span",
            "content": "团战",
            "click": () =>mainFrameLayers.switchTo (3)
        }, bottomBar);

        //mainFrame 部分业务逻辑
        var mainFrameLayers = new LayerRadioBox(
            [new LayerGuild, new LayerShop, new LayerWorld, new LayerRaid], 
            [buttonGuild, buttonShop,buttonWorld, buttonRaid],
            [mainFrame, menubarDiv],
            0);
    }
}
