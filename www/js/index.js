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

$(document).ready(function(){
    //Open database
    openDB();
    var newListName = null;
    //add new list into database
    $('#listnamesubmit').click(function(){
        newListName = $('input[name=listname]').val();
        
        $('input[name=listname]').val("");
        //$('#listBtn').remove();
        table_list = newListName;
        createTable(table_list,listFields,{"id":"primary key","item":"not null","list":"not null","bought":"not null"});
        //insertTable(table_list,listFields,insertP);
        
    });   
    
    

    //add items into new created list
    $('#additem').click(function(){
        var newItemName = $('input[name=itemname]').val();
        $('#itemslisting').append('<div class="item">' +itemID+'.'+newItemName + '</div>' );
        $('input[name=itemname]').val("");
        createPara(itemID,newItemName,newListName);
        itemID+=1;
        insertTable(table_list,listFields,insertP);
        
        
        select(table_list,"*","list=?",[newListName],function(rows){
            if(rows){
                var lastItem = rows.length-1;
            }
        });
    });


    
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

//load a list whose name is listid and all its items and then go into page listdetails
function clicklist(listid){
    clearlist();
    $('#listheader').append(listid);
    //alert($('#listheader').text());
    select(listid,"*","list=?",[listid],function(rows){
            if(rows){
                //row.length is the numbter of return rows
                //row.item(index).attribute is the data acquired from the rows, where index is the index of rows returned, attribute is the certain attribute in field 
                var len = rows.length;
                for(var i=0;i<len;i++){
                    var curritem = rows.item(i).item;
                    var bought = rows.item(i).bought;
                    $('#checkboxes').append('<input id="'+i+'" name="'+curritem+'" type="checkbox"> <label for="checkbox">'+curritem+'</label>');

                }
                
            }
        });
    
    document.location.href='#listdetails';
}

//add items in the listdetails page;
function additeminlist(){
    var currlistname=$('#listheader').text();
    //alert(currlistname);
    currlistname = currlistname.replace(/\ +/g,"");
    currlistname = currlistname.replace(/[\r\n]/g,"")
    //alert("lalalala"+currlistname);
    var rownum = $('#checkboxes label').length;
    var itemID = rownum+1;
    //alert(itemID);
    var newItemName = $('input[name=listdetailitemname]').val();
    $('#checkboxes').append('<input id="'+itemID+'" name="'+newItemName+'" type="checkbox"> <label for="checkbox">'+newItemName+'</label>');
    $('input[name=listdetailitemname]').val("");        
    createPara(itemID,newItemName,currlistname);
    insertTable(currlistname,listFields,insertP);
};