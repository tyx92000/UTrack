'use strict';

// Put your view code here (e.g., the graph renderering code)

function makeUI_input(asm){
   // if(document.getElementById('activities') == null){
        var act_dropdown_listner = function(){
            var act_dropdown = document.getElementById('activities');
            act_dropdown.addEventListener('change',function(){
                var display = document.getElementById('display');
                display.removeChild(display.childNodes[1]); //el
                insert_before('el',1);
                display.removeChild(display.childNodes[2]); //sl
                insert_before('sl',2);
                display.removeChild(display.childNodes[3]); //hl
                insert_before('hl',3);
                display.removeChild(display.childNodes[4]); //ts
                insert_before('ts',4);
            });
        }

        var activityInput = function (attachToElement,asm) {
            while(attachToElement.firstChild) {
                attachToElement.removeChild(attachToElement.firstChild);
            }
            render('act');
            render('el');
            render('sl');
            render('hl');
            render('ts');
            render('js_currentTime');

            act_dropdown_listner();

            asm.addListener(function(type, time,ap){
                var a = document.getElementById('last_time');
                var formattedTime = function(time){
                    if(time.getDate().toString().length < 2){
                        this.day = "0"+time.getDate();
                    } else {
                        this.day = time.getDate();
                    }

                    if(time.getHours().toString().length < 2){
                        this.hour = "0"+time.getHours();
                    } else {
                        this.hour = time.getHours();
                    }

                    if(time.getMinutes().toString().length < 2){
                        this.min = "0"+time.getMinutes();
                    } else {
                        this.min = time.getMinutes();
                    }

                    if(time.getSeconds().toString().length < 2){
                        this.sec = "0"+time.getSeconds();
                    } else {
                        this.sec = time.getSeconds();
                    }
                };

                var ft = new formattedTime(time);
                a.innerHTML = time.getFullYear() + "/" + time.getMonth() +1 + "/" + ft.day + " at " + ft.hour
                + ":" + ft.min + ":"+ ft.sec;

            });
        };

        var inputDiv = document.getElementById('display');
        var inputPage = new activityInput(inputDiv,asm);
    //}


}

var insert_before = function(temp, index){
    var template = document.getElementById(temp);
    var hostElement = document.createElement('div');
    hostElement.innerHTML = template.innerHTML;
    display.insertBefore(hostElement, display.childNodes[index]);
};
var render = function(temp){
    var template = document.getElementById(temp);
    var hostElement = document.createElement('div');
    hostElement.innerHTML = template.innerHTML;
    display.appendChild(hostElement);
};

function makeUI_analysis(asm, graph_model){
    function add_view_type_listener(){
        var graph_type_0 = document.getElementById('vst');
        graph_type_0.addEventListener('change',function(){
            graph_model.selectGraph("table_view");
        });
        var graph_type_1 = document.getElementById('vss');
        graph_type_1.addEventListener('change',function(){
            graph_model.selectGraph("scatterplot");
        });
    }

    //if(document.getElementById("vst") == null){


        var graph = function (attachToElement,asm) {
            while(attachToElement.firstChild) {
                attachToElement.removeChild(attachToElement.firstChild);
            }

            function default_type_select(){
                var a = graph_model.getNameOfCurrentlySelectedGraph();
                if(a == "table_view")
                    document.getElementById('vst').checked = true;
                else
                    document.getElementById('vss').checked = true;
            }

            render('view_selector');
            default_type_select();
            add_view_type_listener();


            var draw_table = function(){
                render('table_view');
                var table = document.getElementById('table_act');
                //var row = table.insertRow(0);
                //row.insertCell(0).innerHTML = "Activity";
                //row.insertCell(1).innerHTML = "Time in minutes";
                for(var i = 0; i < asm.activityForDisplay.length; i ++){
                    var row = table.insertRow(i+1);
                    row.insertCell(0).innerHTML = asm.activityForDisplay[i].activityType;
                    row.insertCell(1).innerHTML = asm.activityForDisplay[i].activityDurationInMinutes;
                }
            };

            var add_plot_listener = function(){
                var checks = document.getElementsByName('graph_info');
                for(var i=0; i < graph_model.graph_display_elements.length; i++){
                    if(graph_model.graph_display_elements[i]== 1)
                        checks[i].checked = true;
                }
                var plot = document.getElementById('plot');
                plot.addEventListener('click', function(){
                    for(var i=0; i < graph_model.graph_display_elements.length; i++){
                        if(checks[i].checked){
                            graph_model.graph_display_elements[i]= 1;
                        }
                        else
                            graph_model.graph_display_elements[i]= 0;
                    }

                    var canvas = document.getElementById( "draw" );

                    var context = canvas.getContext( "2d" );
                    context.clearRect(0,0,canvas.width,canvas.height);
                    var xIncrement = canvas.width*0.7 / 6;
                    var yIncrement = (canvas.height) * 0.9 / (asm.activityForDisplay.length + 1);

                    //draw background grid;
                    context.strokeStyle = "#DDDDDD";
                    context.lineWidth = 1;
                    context.strokeRect( canvas.width*0.3 ,0,canvas.width , canvas.height * 0.9 );

                    context.beginPath();
                    context.font = "20px Georgia";
                    var scale = 1;
                    for ( var xPosition = 0; xPosition < canvas.width; xPosition += xIncrement )
                    {
                        if(scale < 6){
                            context.fillText(scale.toString(), xPosition + xIncrement + canvas.width*0.3, canvas.height*0.97);
                            scale ++;
                        }
                        context.moveTo( xPosition + canvas.width*0.3, 0 );
                        context.lineTo( xPosition + canvas.width*0.3, canvas.height*0.9 );
                    }
                    var i =0;
                    context.font = "12px Georgia";
                    for ( var yPosition = 0; yPosition < canvas.height; yPosition += yIncrement )
                    {
                        if(i < asm.activityForDisplay.length){
                            context.textAlign = "right";

                            context.fillText(asm.activityForDisplay[i].activityType, canvas.width*0.28, yPosition + yIncrement);
                            i++;
                        }

                        context.moveTo( 0 + canvas.width*0.3, yPosition );
                        context.lineTo( canvas.width, yPosition );
                    }

                    context.textAlign = "center";
                    var level = 0;
                    var draw_dot = function(x,type,color){
                        context.fillStyle=color;
                        for(var j = 0; j < asm.activityForDisplay.length; j++){
                            for(var k = 0; k < asm.activityList.length; k++){
                                if(asm.activityForDisplay[j].activityType == asm.activityList[k].activityType){
                                    level = asm.activityList[k].activityDataDict[type];
                                    level = parseInt(level);
                                    context.fillText(x,(level+1) * xIncrement + canvas.width*0.3,(j+1) * yIncrement);
                                }
                            }
                        }
                        context.fillStyle="black";
                        context.font = "20px Georgia";
                    };

                    context.font = " bold 20px Georgia";
                    if(graph_model.graph_display_elements[0] == 1) draw_dot("o","el","red");
                    context.font = " bold 20px Georgia";
                    if(graph_model.graph_display_elements[1] == 1) draw_dot("x","sl","blue");
                    context.font = " bold 20px Georgia";
                    if(graph_model.graph_display_elements[2] == 1) draw_dot("+","hl","orange");



                    context.stroke();
                    context.strokeStyle = "#000000";
                    context.lineWidth = 1;

                });
            };

            if(graph_model.getNameOfCurrentlySelectedGraph() == "table_view"){

                draw_table();
            } else{
                render('graph_view');
                var canvas = document.getElementById( "draw" );

                var context = canvas.getContext( "2d" );
                context.clearRect(0,0,canvas.width,canvas.height);

                context.strokeStyle = "#DDDDDD";
                context.lineWidth = 1;
                context.strokeRect( 0 ,0,canvas.width , canvas.height );
                context.font ="15px Arial";
                context.fillStyle = "#0b97c4";
                context.fillText("Your scatterplot will be displayed here.", canvas.width*0.28, canvas.height*0.5);
                context.fillStyle = "black";

                add_plot_listener();

            }

            graph_model.addListener(function(type, time,ap){
                var display = document.getElementById('display');
                while(display.firstChild) {
                    display.removeChild(display.firstChild);
                }


                render('view_selector');
                default_type_select();
                add_view_type_listener();


                if(graph_model.getNameOfCurrentlySelectedGraph() == "table_view"){

                    draw_table();

                } else{
                    render('graph_view');
                    var canvas = document.getElementById( "draw" );

                    var context = canvas.getContext( "2d" );
                    context.clearRect(0,0,canvas.width,canvas.height);

                    context.strokeStyle = "#DDDDDD";
                    context.lineWidth = 1;
                    context.strokeRect( 0 ,0,canvas.width , canvas.height );
                    context.font ="15px Arial";
                    context.fillStyle = "#0b97c4";
                    context.fillText("Your scatterplot will be displayed here.", canvas.width*0.28, canvas.height*0.5);
                    context.fillStyle = "black";
                    add_plot_listener();
                }
            });
        };

        var inputDiv = document.getElementById('display');
        var inputPage = new graph(inputDiv,asm);
    //}


}
