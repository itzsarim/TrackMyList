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
var loggedin = false;
   
    
function setUserName(name){
username=name;
//alert(name);
} 

function setLoginStatus(){

// set the loggedin variable in database to true.
loggedin = true;
//alert("status login set"+ loggedin);

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
    
//alert("logged in status"+ loggedin);
//check database for loggedin boolean
if (loggedin){
        
        	window.location.replace("#pair");
        
        }

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