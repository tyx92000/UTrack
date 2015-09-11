'use strict';

/*
Put any interaction code here
 */

window.addEventListener('load', function() {
    // You should wire up all of your event handling code here, as well as any
    // code that initiates calls to manipulate the DOM (as opposed to responding
    // to events)
    console.log("Hello world!");
    var asm = new ActivityStoreModel();

    // INPUT TAB
    var add_submit_listener = function(){
        var submit_button = document.getElementById('submit');
        submit_button.addEventListener('click', function(){
            var dic = {
                'el' : getRate('eL'),
                'sl' : getRate('sL'),
                'hl' : getRate('hL')
            };
            var selected_act = document.getElementById('activities');
            var act = selected_act.options[selected_act.selectedIndex].text;
            var time = document.getElementById('ts_').value;
            var regex=/^[0-9]+$/;
            if (time.match(regex) && dic.el >= 0 && dic.el < 5 && dic.sl >= 0 && dic.sl < 5 && dic.hl >= 0 && dic.hl < 5){
                time = parseInt(time);
                var newDataPoint = new ActivityData(act, dic, time);
                var a = document.getElementsByName('eL');
                a[parseInt(getRate('eL'))].checked =false;
                a = document.getElementsByName('sL');
                a[parseInt(getRate('sL'))].checked =false;
                a = document.getElementsByName('hL');
                a[parseInt(getRate('hL'))].checked =false;
                a = document.getElementById('ts_');
                a.value = "";
                asm.addActivityDataPoint(newDataPoint);
            } else {
                window.alert("Please enter valid data. " +
                "Please make sure that you select a level for energy, stress, happiness; " +
                "and you enter an integer for the time spent." +
                "Thanks :D");
            }


        });

    };
    var isOnInput = 0;
    makeUI_input(asm);
    isOnInput = 1;
    add_submit_listener();

    var analysis_tab = document.getElementById("analysis_tab");
    var input_tab = document.getElementById("input_tab");
    input_tab.addEventListener('click',function(){
        analysis_tab.className = "btn btn-info";
        input_tab.className = "btn btn-info active";
        if(!isOnInput){
            makeUI_input(asm);
            isOnInput = 1;
            add_submit_listener();
        }

    });


    //ANALYSIS TAB


    var graph_model = new GraphModel();




    analysis_tab.addEventListener('click',function(){
        input_tab.className = "btn btn-info";
        analysis_tab.className = "btn btn-info active";
        if(isOnInput){
            makeUI_analysis(asm, graph_model);
            isOnInput = 0;
        }
    });


    //generateFakeData(new ActivityStoreModel(), 10);

    // Canvas Demo Code. Can be removed, later
    //var canvasButton = document.getElementById('run_canvas_demo_button');
    //canvasButton.addEventListener('click', function() {
    //    runCanvasDemo();
    //});
});




//
//var makeUI_input = function (asm){
//    var inputDiv = document.getElementById('input_div');
//    var inputPage = new asm.activityInput(inputDiv,asm);
//}

/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */

function getRate(level){
    var radios = document.getElementsByName(level);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return i ++;
        }
    }
}

function runCanvasDemo() {
    /*
    Useful references:
     http://www.w3schools.com/html/html5_canvas.asp
     http://www.w3schools.com/tags/ref_canvas.asp
     */
    var canvas = document.getElementById('canvas_demo');
    var context = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    console.log("Painting on canvas at: " + new Date());
    console.log("Canvas size: " + width + "X" + height);

    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'red';
    context.moveTo(0, 0);
    context.lineTo(width, height);
    context.stroke();
}
