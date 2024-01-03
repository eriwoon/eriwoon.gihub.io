DEBUG = true

function Table(node){
    this.node = node
}

Table.prototype = {
    get_line : function(line_number){return line_number},
    add_line : function(line, position){

    },
    add_head : function(line){
        if(this.head){
            this.del_head()
        } 
        this.headContent = line

        this.headEntry = $('<tr style="background:black; color:white;"></tr>')
        this.headThs = [];

        for(i = 0; i < line.length; i++){
            this.headThs.push($('<th>' + line[i] + '</th>'))
            this.headEntry.append(this.headThs[this.headThs.length -1])
        }
        
        if($(this.node).children().length > 0)
            $(this.node).children().first().before(this.headEntry)
        else
            $(this.node).append(this.headEntry)
    },

    del_head : function(){
        this.head = undefined
        $(this.node).children().first().detach()
    }

}

function debug(){
    test = new Table("#debug")
    test.add_head([1,2,3,4])
}

if(DEBUG)$(document).ready(debug)