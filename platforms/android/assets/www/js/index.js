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

 var userName;
 var cartId;
 var gcmId;

//get global username and gcmid before pair page shows
 $(document).on("pagebeforeshow","#pair",function(){
    getUserName();
    getGCMId();
 });

function deletelist(list){
    var drop = 'DROP TABLE IF EXISTS '+list;
    execSql(drop);
}

function deleteitem(list,item){
    deleteRow(list,"item=?",[item]);
}
  
    


function getUserName(){
    var username;
    select("userprofile","*","tablename=?",['userprofile'],function(rows){
        if(rows){
            username = rows.item(0).username;
            userName = username;
        }else{
            console.log("error");
        }

    },
    function(){
        console.log("no userprofile found");
    });
    
}


//retrieve specific user
function getLoginStatus(){
    //alert("get login status called");
var loggedinstatus;
var name;
    select("userprofile","*","tablename=?",['userprofile'],function(rows){
        //alert("rows are"+rows);
        if(rows){
            //alert("success");
            loggedinstatus = rows.item(0).loggedin;
            name = rows.item(0).username;
            //alert(typeof(loggedinstatus));
            //alert(loggedinstatus);
            if(loggedinstatus=="true"){
                window.location.replace("#pair");
            }
        }else{
            alert("error");
        }

    },
    function(){
        alert("no userprofile found");
    });
   
}

function dropTable(name){
    var drop = 'DROP TABLE IF EXISTS '+name;
    execSql(drop);
}


function getGCMId(){
    var gcmid;
    select("userprofile","*","tablename=?",['userprofile'],function(rows){
        if(rows){
            gcmid = rows.item(0).gcmId;
            gcmId = gcmid;
            //alert(gcmid);
        }else{
            alert("error");
        }

    },
    function(){
        alert("no userprofile found");
    });
    
}

function setCartId(cartid){
    updateTable("userprofile",['cartId'],[cartid],"tablename=?",['userprofile']);
    //alert("set cart status success");
     //get the global variable cartId ready to be used during unpair
    getCartId();
}
function getCartId(){
    var cartid;
    select("userprofile","*","tablename=?",['userprofile'],function(rows){
        //alert("get cart status success");
        if(rows){
            cartid = rows.item(0).cartId;
            cartId = cartid;
            //alert(cartid);
        }else{
            alert("error");
        }

    },
    function(){
        alert("no userprofile found");
    });
    
}

 
function checkProfile(){
    var existProfile = false;
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            //alert(len);
            for(var i=1;i<len;i++){
                var name = result.rows.item(i).name;
                //alert("checkprofile name"+name);
                if(name=="userprofile") {
                    existProfile=true;
                    
                }       
            }
            if(existProfile==false){
                createTable("userprofile",profileFields,{"username":"primary key","loggedin":"not null","tablename":"not null"});
                insertTable("userprofile",profileFields,["default",false,"userprofile",null,null,null]);
            }
        });
    });
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
                    console.log('in nfc');
        			console.log(JSON.stringify(nfcEvent.tag.id));
        			console.log(byteArrayToLong(nfcEvent.tag.id));
        			document.getElementById("enter-number").value = byteArrayToLong(nfcEvent.tag.id);
        			
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
// var naming;
// naming = select("userprofile","*",);





//prepare for page 4
$(document).on("pagebeforeshow","#alists",function(){
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            if (len == 2) {
            //here are no your tables currently
            //alert("no list in the database");
            } else {
                for(var i=1;i<len;i++){
                    var name =result.rows.item(i).name;
                    //var drop = 'DROP TABLE IF EXISTS '+name;
                    //execSql(drop);
                    if(name!=="userprofile") {
                        $('#listing').prepend('<li id="items" > <a data-transition="slide" id="'+name+'" onclick="clicklist(this.id)" class="ui-btn ui-btn-icon-right ui-icon-carat-r" >'+ name+'</a></li>');
                    }
                }
                 
            }
        });
    });
});    
        
    // var drop = 'DROP TABLE IF EXISTS userprofile';
    // execSql(drop);
    // alert("dropped!");    
        
        
        

        console.log('Received Event: ' + id);
    }
};

app.initialize();

var curlistname;
var currownum;
var curbudget;

//add new list on page 5
function addnewlist(){
    var newListName = $('input[name=listname]').val().toLowerCase();
    curbudget = $('input[name=budget]').val();
    if(typeof(curbudget)=="number"){
    	curbudget =  parseFloat($('input[name=budget]').val());
    }else{
    	curbudget = 50;
    }
    //alert(curbudget);
    $('input[name=listname]').val("");
    $('input[name=budget]').val("");
    table_list = newListName;
    $('#namehead').append(newListName);
    createTable(table_list,listFields,{"id":"primary key","item":"not null","list":"not null","bought":"not null"});
    insertTable(table_list,listFields,[0,"budgetItem",table_list,false,curbudget,null]);
}
//add new items on page 6
function addnewitem(){
    var newItemName = $('input[name=itemname]').val().toLowerCase();
    $('#itemslisting').append('<li class="ui-li-static ui-body-inherit">' +itemID+'.'+newItemName + '</li>' );
    $('input[name=itemname]').val("");
    createPara(itemID,newItemName,table_list);
    itemID+=1;
    insertTable(table_list,listFields,insertP,null,0);
}

function byteArrayToLong(/*byte[]*/x) {
	var val = 0;
    for (var i = 0; i < x.length; ++i) {        
        val += x[i];        
        if (i < x.length-1) {
            val = val << 8;
        }
    }
    
    //convert val to positive if it is negative
    if(val < 0){
    	val = val * -1;
    }
    return val;
};


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
    $('#dollar').empty();
    $('#totalsum').empty();
}

function cleartargetlist(){
    $('#targetlist').empty();
}



//add items and show them on page 7
function additeminlist(){
	//alert(curbudget);
    currownum+=1;
    var newitem = $('input[name=listdetailitemname]').val().toLowerCase();
    //alert(newitem);
    //$('#listingitems').append('<fieldset data-role="controlgroup">'+'<label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off"><input id="'+newitem+'" onclick="updatebought(this.name,this.checked)"  name="'+curlistname+'$'+newitem+'$'+currownum+'" type="checkbox">'+newitem+'</label></fieldset>');
    $('#listingitems').append('<fieldset data-role="controlgroup">'+'<label><input id="'+newitem+'" onclick="updatebought(this.name,this.checked)"  name="'+curlistname+'$'+newitem+'$'+currownum+'" type="checkbox">'+newitem+'</label></fieldset>');
    $('input[name=listdetailitemname]').val("");  

    //createPara(currownum,newitem,curlistname);
    insertTable(curlistname,listFields,[currownum,newitem,curlistname,false,null,0]);
};

//pair cart
function pairCart(){
	var cartid = document.getElementById("enter-number").value
	console.log("sending request to pair with cart " + cartid);
    setCartId(cartid);
    //var cartid = getcartid()
    var username = userName;
    var gcmid = gcmId;

  
	
	$.get("http://mcprojectserver.appspot.com/paircart?cartid=" + cartid +  "&userid=" + username + "&gcmid=" + gApp.gcmregid, function(data, textStatus)
	        {
					window.location.replace('#workinglist');
	        })
	        .done(function(){
	        		console.log("Get Done");
			})
			.fail(function(){
				$("#pairError").append("Failed to pair. Check connection.");	
				console.log("Get Failed");
			});
}
function unpairCart(){
    
    
    var cartid = cartId;
    var username = userName;
    var gcmid = gcmId
    console.log("sending request to unpair with cart " + cartid);
    console.log("sending request to unpair with gcm " + gcmid);
    console.log("sending request to unpair with userName " + username);
    
    $.get("http://mcprojectserver.appspot.com/unpaircart?cartid=" + cartid +  "&userid=" + username + "&gcmid=" + gcmid, function(data, textStatus)
            {
                    window.location.replace('#pair');
            })
            .done(function(){
                    console.log("Get Done");
            })
            .fail(function(){

                console.log("Get Failed");
            });
}

function testTargetList(){
    //setTargetList();
    window.location.replace('#workinglist');
    

}

function setListName (id) {
    updateTable("userprofile",['targetList'],[id],"tablename=?",["userprofile"]);
    // body...

}
function setTargetList(){
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table'", [], function (tx, result) {
            var len = result.rows.length;
            for(var i=1;i<len;i++){
                var name =result.rows.item(i).name;
                if(name!=="userprofile"){
                    $('#targetlist').prepend('<li id="items" > <a data-transition="slide" id="'+name+'" onclick="setListName(this.id);clicklist(this.id);cleartargetlist()" class="ui-btn ui-btn-icon-right ui-icon-carat-r" >'+ name+'</a></li>');          
                }
            }
        });
    });
}
function logout () {
    setLoginStatus(false);
    window.location.replace('#tut1');
}
//$(document).on("pagebeforehide","#addlistitems",function(){
//	select(table_list,"*","list=?",[table_list],function(rows){
//		var b = rows.item(0).budget;
//		var p = rows.item(0).price;
//		var tb = typeof(b);
//		var tp = typeof(p);
//		alert(b);
//		alert(tb);
//		alert(p);
//		alert(tp);
//	});
//});