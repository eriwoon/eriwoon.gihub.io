function createNewMember(){
    console.log("created new member")
    return {
        Name: getRandomName(),
        Race: getRandomRace(),
        Class:getRandomClass(),
        Level:1,
        Gear:0,
        Buff:[]
    };
}
var newMemberInfo = createNewMember();


class LayerMember extends Layer {
    activate(frame) {
        super.activate(frame);

        //为menubar预留的位置
        var newMember = this.createElement({
            "element": "div",
            "class":"newMember",
            "content":"+招募新成员+",
            "click":()=>(new LayerAddMemberPopup).activate() & (memberBindedRefresh = ()=>(this.destroy() &this.activate(frame)))
        }, frame)

        for (let i in Save.Member) {
            let card = this.createElement({
                "element": "div",
                "class": "card",
                "click":()=>(new LayerMemberInfoPopup).activate(frame, [Save.Member[i], i]) & (memberBindedRefresh = ()=>(this.destroy() &this.activate(frame)))
            }, frame) ;
            this.createElement({
                "element": "div",
                "content": Save.Member[i].Name + ' ' + i18n.toRace(Save.Member[i].Race) + ' ' + i18n.toClass(Save.Member[i].Class) + ' ' + Save.Member[i].Level + '+' + Save.Member[i].Gear,
                "class": Save.Member[i].Class
            }, card) ;
            this.createElement({
                "element": "div",
                "class": "cardStatus",
                "content": "自由活动中"
            }, card);
        }
        
    }
}

class LayerAddMemberPopup extends LayerPopup{
    activate(){     
        super.activate()   
        var popup = this.createElement({
            "element":"div",
            "class":"popup",
            "content":"是否批准加入公会"
        }, this.mask);
        var card = this.createElement({
            "element":"div",
            "class":"card"
        }, popup);
        this.createElement({
            "element":"div",
            "class":newMemberInfo.Class,
            "content":newMemberInfo.Name + ' ' + i18n.toRace(newMemberInfo.Race) + ' ' + i18n.toClass(newMemberInfo.Class) + ' ' + newMemberInfo.Level + '+' + newMemberInfo.Gear
        }, card);
        this.createElement({
            "element": "div",
            "class": "cardStatus",
            "content": "老大，求加公会，带我飞呀！！"
        }, card);

        var buttonGroup = this.createElement({
            "element":"div",
            "class":"buttonGroup"
        }, popup);
        this.createElement({
            "element":"button",
            "content":"批准",
            "click":() => Save.Member.push(newMemberInfo) & (newMemberInfo = createNewMember()) & this.destroy() & bindElementRefresh()
        }, buttonGroup);
        this.createElement({
            "element":"button",
            "content":"拒绝",
            "click":()=>this.destroy() & (newMemberInfo = createNewMember())
        }, buttonGroup);
        this.buttons = buttonGroup;
    }
}

class LayerMemberInfoPopup extends LayerPopup{
    
    activate(frame, addition){
        super.activate(frame);

        let member    = addition[0];
        let member_id = addition[1]
        
        var popup = this.createElement({
            "element":"div",
            "class":"popup " + member.Class,
            "content":member.Name
        }, this.mask);

        //信息板
        let tbody = this.createElement({"element":"tbody"}, popup);
        let tr1    = this.createElement({"element":"tr"}, tbody);
        let td11    = this.createElement({"element":"td"}, tr1);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"种族："
        }, td11)
        this.createElement({
            "element":"span",
            "content":i18n.toRace(member.Race)
        }, td11)

        let td12    = this.createElement({"element":"td"}, tr1);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"职业："
        }, td12)
        this.createElement({
            "element":"span",
            "content":i18n.toClass(member.Class)
        }, td12)


        let tr2    = this.createElement({"element":"tr"}, tbody);
        let td21    = this.createElement({"element":"td"}, tr2);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"装备等级："
        }, td21)
        this.createElement({
            "element":"span",
            "content":"" + member.Level + "+" + member.Gear
        }, td21)
        let td22    = this.createElement({"element":"td"}, tr2);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"装备经验："
        }, td22)
        this.createElement({
            "element":"span",
            "content":"0/5"
        }, td22)

        let tr3    = this.createElement({"element":"tr"}, tbody);
        let td31    = this.createElement({"element":"td"}, tr3);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"商业技能："
        }, td31)
        this.createElement({
            "element":"span",
            "content":"无"
        }, td31)
        let td32    = this.createElement({"element":"td"}, tr3);
        this.createElement({
            "element":"span",
            "class":"info",
            "content":"入会时长："
        }, td32)
        this.createElement({
            "element":"span",
            "content":"N/A"
        }, td32)


        var buttonGroup = this.createElement({
            "element":"div",
            "class":"buttonGroup"
        }, popup);
        this.createElement({
            "element":"button",
            "content":"移除公会",
            "click":()=>Save.Member.splice(member_id,1) & this.destroy() & bindElementRefresh()
        }, buttonGroup);
        this.createElement({
            "element":"button",
            "content":"关闭",
            "click":()=>this.destroy()
        }, buttonGroup);
    }
}
