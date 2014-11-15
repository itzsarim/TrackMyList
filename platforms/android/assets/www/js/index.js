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
 
var username;
    
    
function setUserName(name){
username=name;
//alert(name);
} 
 
 
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
        
        
       
        
        
        
        nfc.addTagDiscoveredListener(
        		function (nfcEvent) {
        			console.log(JSON.stringify(nfcEvent.tag.id[1]));
//        			$('#enter-number').text("Alok");
        			document.getElementById("enter-number").value = JSON.stringify(nfcEvent.tag.id);
        		},
        		function(){
        			console.log("waiting for tag");
        		},
        		function (error) {
        			console.log("Error");
        			console.log(error);
        		}
        );
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    


//prepare for page 4
$(document).on("pagebeforeshow","#alists",function(){
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            if (len == 1) {
            //here are no your tables currently
            alert("no list in the database");
            } else {
                for(var i=1;i<len;i++){
                    var name =result.rows.item(i).name;
                    //var drop = 'DROP TABLE IF EXISTS '+name;
                    //execSql(drop);
                    $('#listing').prepend('<li id="items" > <a data-transition="slide" id="'+name+'" onclick="clicklist(this.id)" class="ui-btn ui-btn-icon-right ui-icon-carat-r" >'+ name+'</a></li>');
                   
                }
                 
            }
        });
    });
});    
        
        
        
        
        

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var curlistname;
var currownum;

//add new list on page 5
function addnewlist(){
    var newListName = $('input[name=listname]').val().toLowerCase();
        
    $('input[name=listname]').val("");
    table_list = newListName;
    $('#namehead').append(newListName);
    createTable(table_list,listFields,{"id":"primary key","item":"not null","list":"not null","bought":"not null"});
}
//add new items on page 6
function addnewitem(){
    var newItemName = $('input[name=itemname]').val().toLowerCase();
    $('#itemslisting').append('<li class="ui-li-static ui-body-inherit">' +itemID+'.'+newItemName + '</li>' );
    $('input[name=itemname]').val("");
    createPara(itemID,newItemName,table_list);
    itemID+=1;
    insertTable(table_list,listFields,insertP);
}


//clear all lists on page 5
function clearlist(){
    $('#listing').empty();
}
//clear head and all items on page 6
function clearitem(){
    $('#namehead').empty();
    $('#itemslisting').empty();
    itemID=1;
}
//clear head and all items on page 7
function clearlistdetails(){
    $('#listheader').empty();
    $('#listingitems').empty();
}
//trigered to prepare page 7 and direct to page 7
function clicklist(listid){
    curlistname = listid;
    clearlist();

    $('#listheader').append(listid);
    //alert($('#listheader').text());
    select(listid,"*","list=?",[listid],function(rows){
            if(rows){
                console.log('list name',curlistname);
                //row.length is the numbter of return rows
                //row.item(index).attribute is the data acquired from the rows, where index is the index of rows returned, attribute is the certain attribute in field 
                var len = rows.length;
                currownum =len;
                for(var i=0;i<len;i++){

                    var curritem = rows.item(i).item;
                    var curbought = rows.item(i).bought;
                    var rowid = i+1;
                    //alert(bought);
                    $('#listingitems').append('<label><input class="boughtcheckbox" onclick="updatebought(this.name,this.checked)" id="'+curritem+'" name="'+curlistname+'$'+curritem+'$'+rowid+'" type="checkbox">'+curritem+'</label>');
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
    
    document.location.href='#listitems';
}

//update the database when check box changes on page 7
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
//add items and show them on page 7
function additeminlist(){
    currownum+=1;
    var newitem = $('input[name=listdetailitemname]').val().toLowerCase();
    //alert(newitem);
    $('#listingitems').append('<fieldset data-role="controlgroup">'+'<label><input id="'+newitem+'" onclick="updatebought(this.name,this.checked)"  name="'+curlistname+'$'+newitem+'$'+currownum+'" type="checkbox">'+newitem+'</label></fieldset>');
    $('input[name=listdetailitemname]').val("");        
    createPara(currownum,newitem,curlistname);
    insertTable(curlistname,listFields,[currownum,newitem,curlistname,false]);
};

//Global var to store all the table's name. initialized when document is ready,updated when adding new list
var tablelist;
//Global var to store item that customer puts into shopping cart and is pushed by gcm.
var currentitemname;
//triggered when customer puts item into shopping cart and then item's name is pushed by gcm.
//will direct to page #selectlist
function getTableNamesForItem(item){
    currentitemname = item.toLowerCase();
    window.location.replace='#selectlist';
}
//store all the table's names into tablelist
function showtable(){
    tablelist = [];
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            if (len == 1) {
            //here are no your tables currently
            alert("no list in the database");
            } else {
                for(var i=1;i<len;i++){
                    var name =result.rows.item(i).name;
                    tablelist.push(name);
                }
                 
            }
        });
    });
}

//update global var tablelist when adding new list 
$(document).on("pagebeforehide","#addlists",function(){
    showtable();
});
//configure page #selectlist 
$(document).on("pagebeforecreate","#selectlist",function(){
    var item = currentitemname;
    qlist = [];
    var len = tablelist.length;
    for(var i=0;i<len;i++){
        select(tablelist[i],"*","item=?",[item],function(rows){
            if(rows.length>0){
                var name = rows.item(0).list;
                //alert(name);
                qlist.push(name);
                //alert(qlist.length);
                popuplists(name,currentitemname)
            }
        });
    }
});

//help configure page #selectlist before page is created
function popuplists(list,item){
        var listanditem = list+"$"+item;
        $('#listoptions').append('<li id="items" > <a data-transition="slide" id="'+listanditem+'" onclick="selectlistanditem(this.id)" class="ui-btn ui-btn-icon-right ui-icon-carat-r" >'+ list+'</a></li>');
}

////also help configure page #selectlist before page is created
function selectlistanditem(name){
    var array = name.split("$");
    var listname = array[0];
    var itemname = array[1];
    updatebought(name,true);
    clicklist(listname);
}

//pair cart
function pairCart(){
	var cartid = document.getElementById("enter-number").value
	console.log("sending request to pair with cart " + cartid);
	
	$.get("http://mcprojectserver.appspot.com/paircart?cartid=" + cartid +  "&userid=" + username + "&gcmid=" + gApp.gcmregid, function(data, textStatus)
	        {
					window.location.replace('#alists');
	        })
	        .done(function(){
	        		console.log("Get Done");
			})
			.fail(function(){
				$("#pairError").append("Failed to pair. Check connection.");	
				console.log("Get Failed");
			});
}