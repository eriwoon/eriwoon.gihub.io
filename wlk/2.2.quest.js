class LayerQuest extends Layer {
    activate(frame){
        
        super.activate(frame);
        this.createElement({
            "element": "div",
            "content": "TODO 任务"
            }, frame);
    }
}

class LayerInventory extends Layer {
    activate(frame){
        super.activate(frame);
        this.createElement({
            "element": "div",
            "content": "TODO 仓库"
            }, frame);
    }
}

class LayerAchievement extends Layer {
    activate(frame){
        super.activate(frame);
        this.createElement({
            "element": "div",
            "content": "TODO 收藏"
            }, frame);
    }
}

class LayerSetting extends Layer {
    activate(frame){
        super.activate(frame);
        this.createElement({
            "element": "div",
            "content": "TODO 设置"
            }, frame);
    }
}
