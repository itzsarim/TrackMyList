/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    
    	console.log("in receivedEvent");
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        $('#listnamesubmit').click(listnamesubmitted());
        
        function listnamesubmitted(){
        var listname = $('#listname').val;
        console.log('listaname',listname);
        }
        
        
        

        console.log('Received Event: ' + id);
    }
};

app.initialize();
function addnewlist(){
    var newListName = $('input[name=listname]').val();
        
    $('input[name=listname]').val("");
    table_list = newListName;
    createTable(table_list,listFields,{"id":"primary key","item":"not null","list":"not null","bought":"not null"});
}

function addnewitem(){
    var newItemName = $('input[name=itemname]').val();
    $('#itemslisting').append('<div class="item">' +itemID+'.'+newItemName + '</div>' );
    $('input[name=itemname]').val("");
    createPara(itemID,newItemName,table_list);
    itemID+=1;
    insertTable(table_list,listFields,insertP);
}

$(document).ready(function(){
    //Open database
    openDB(); 
});

//show all lists in the database in the page alists when loading this page
$(document).on("pagebeforeshow","#alists",function(){
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            if (len == 1) {
            //here are no your tables currently
            alert("no list in the database");
            } else {
                for(var i=0;i<len;i++){
                    var name =result.rows.item(i).name;
                    //var drop = 'DROP TABLE IF EXISTS '+name;
                    //execSql(drop);
                    $('#listing').prepend('<li data-theme="c" > <a data-transition="slide" id="'+name+'" onclick="clicklist(this.id)" >'+ name+'</a></li>');
                }
            }
        });
    });
}); 

//clear all lists in the <div> where id=listing
function clearlist(){
    $('#listing').empty();
}

//clear all items in the <div> where id=itemslisting
function clearitem(){
    $('#itemslisting').empty();
    itemID=1;
}

//clear title of listdetails and all its items
function clearlistdetails(){
    $('#listheader').empty();
    $('#checkboxes').empty();
}
var curlistname;
var currownum;
//load a list whose name is listid and all its items and then go into page listdetails
function clicklist(listid){
    curlistname = listid;
    clearlist();
    $('#listheader').append(listid);
    //alert($('#listheader').text());
    select(listid,"*","list=?",[listid],function(rows){
            if(rows){
                //row.length is the numbter of return rows
                //row.item(index).attribute is the data acquired from the rows, where index is the index of rows returned, attribute is the certain attribute in field 
                var len = rows.length;
                currownum =len;
                for(var i=0;i<len;i++){
                    var curritem = rows.item(i).item;
                    var rowid = i+1;
                    //alert(bought);
                    $('#checkboxes').append('<input class="boughtcheckbox" onclick="updatebought(this.name,this.checked)" id="'+curritem+'" name="'+curlistname+'$'+curritem+'$'+rowid+'" type="checkbox"> <label for="checkbox">'+curritem+'</label>');
                }
                for(var i=0;i<len;i++){
                    //alert(i);
                    var curritem = rows.item(i).item;
                    var curbought = rows.item(i).bought;
                    var rowid = i+1;
                    //alert(curbought);
                    //alert(typeof(curbought));
                    if(curbought=="false"){
                        curbought=false;
                    }
                    if(curbought){
                        //alert("?");
                        $('#'+curritem).prop("checked",true);
                    };
                }
                
            }
        });
    
    document.location.href='#listdetails';
}

function updatebought(name,ischecked){
    var array = name.split("$");
    var listname = array[0];
    var itemname = array[1];
    var checked = ischecked;
    //alert(itemname);
    updateTable(listname,['bought'],[checked],"item=?",[itemname]);
    select(listname,"*","item=?",[itemname],function(rows){
        if(rows){
            var b = rows.item(0).bought;
            //alert(b);
        }
    })
}
// $(.boughtcheckbox).bind("click",function(){

//     var itemid = this.id;
//     alert(itemid);
//     var ischecked = this.checked;
//     alert(ischecked);
// });

//add items in the listdetails page;
function additeminlist(){
    // select(curlistname,"*","list=?",[curlistname],function(rows){
    //         if(rows){
    //             //row.length is the numbter of return rows
    //             //row.item(index).attribute is the data acquired from the rows, where index is the index of rows returned, attribute is the certain attribute in field 
    //             var len = rows.length;
    //             //currownum =len;
    //             for(var i=0;i<len;i++){
    //                 var curritem = rows.item(i).item;
    //                 var bought = rows.item(i).bought;
    //                 $('#checkboxes').append('<input id="'+i+'" name="'+curritem+'" type="checkbox"> <label for="checkbox">'+curritem+'</label>');

    //             }
                
    //         }
    //     });
    //alert(curlistname);
    //alert(currownum);
    currownum+=1;
    var newitem = $('input[name=listdetailitemname]').val();
    //alert(newitem);
    $('#checkboxes').append('<input id="'+newitem+'" onclick="updatebought(this.name,this.checked)"  name="'+curlistname+'$'+newitem+'$'+currownum+'" type="checkbox"> <label for="checkbox">'+newitem+'</label>');
    $('input[name=listdetailitemname]').val("");        
    createPara(currownum,newitem,curlistname);
    insertTable(curlistname,listFields,[currownum,newitem,curlistname,false]);
};