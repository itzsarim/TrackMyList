gApp = new Array();

gApp.deviceready = false;
gApp.gcmregid = '';

window.onbeforeunload  =  function(e) {

    if ( gApp.gcmregid.length > 0 )
    {
      // The same routines are called for success/fail on the unregister. You can make them unique if you like
      window.GCM.unregister( GCM_Success, GCM_Fail );      // close the GCM

    }
};




//Global var to store all the table's name. iniztialized when document is ready,updated when adding new list
var tablelist;
//Global var to store item that customer puts into shopping cart and is pushed by gcm.
var currentitemname;
//triggered when customer puts item into shopping cart and then item's name is pushed by gcm.
//will direct to page #selectlist

function startListNames(name , price , status){

// depending on the status add or remove the item from the database


//name has product name , do a match of items from this huge sentence of words
var string = name;
var result = string.match(/milk/i); //instead of milk put the database itemname to see if any of them matches to the name
//if it matches then check it with price displayed beside it, and total increased


 //window.location.replace("#selectlist"); replace to the current itemlist page
 
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
                    if(name!=="userprofile"){
                      tablelist.push(name);
                    }
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
//trigered to prepare page 7 and direct to page 7
function clicklist(listid){
    curlistname = listid;
    clearlist();

    $('#listheader').append(listid);
    //alert($('#listheader').text());
    select(listid,"*","list=?",[listid],function(rows){
            if(rows){
                console.log('list name',curlistname);
                curbudget = rows.item(0).budget;
                $('#dollar').append(curbudget);
                //row.length is the numbter of return rows
                //row.item(index).attribute is the data acquired from the rows, where index is the index of rows returned, attribute is the certain attribute in field 
                var len = rows.length;
                currownum =len-1;
                for(var i=1;i<len;i++){

                    var curritem = rows.item(i).item;
                    var curbought = rows.item(i).bought;
                    //var rowid = i+1;
                    //alert(bought);
                    $('#listingitems').append('<label><input class="boughtcheckbox" onclick="updatebought(this.name,this.checked)" id="'+curritem+'" name="'+curlistname+'$'+curritem+'$'+'" type="checkbox">'+curritem+'</label>');
                }
                for(var i=1;i<len;i++){
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





document.addEventListener('deviceready', function() {

  // This is the Cordova deviceready event. Once this is called Cordova is available to be used
  $("#app-status-ul").append('<li>deviceready event received</li>' );

  $("#app-status-ul").append('<li>calling GCMRegistrar.register, register our Sender ID with Google</li>' );


  gApp.DeviceReady = true;

  // Some Unique stuff here,
  // The first Parm is your Google email address that you were authorized to use GCM with
  // the Event Processing rountine (2nd parm) we pass in the String name
  // not a pointer to the routine, under the covers a JavaScript call is made so the name is used
  // to generate the function name to call. I didn't know how to call a JavaScript routine from Java
  // The last two parms are used by Cordova, they are the callback routines if the call is successful or fails
  //
  // CHANGE: your_app_id
  // TO: what ever your GCM authorized senderId is
  //
  window.plugins.GCM.register("378239996981", "GCM_Event", GCM_Success, GCM_Fail );

}, false );


function
GCM_Event(e)
{

  $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');


  switch( e.event )
  {
  case 'registered':
    // the definition of the e variable is json return defined in GCMReceiver.java
    // In my case on registered I have EVENT and REGID defined
    gApp.gcmregid = e.regid;
    if ( gApp.gcmregid.length > 0 )
    {
      //$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");


      // ==============================================================================
      // ==============================================================================
      // ==============================================================================
      //
      // This is where you would code to send the REGID to your server for this device
      //
      // ==============================================================================
      // ==============================================================================
      // ==============================================================================

    }

    break

  case 'message':

    // the definition of the e variable is json return defined in GCMIntentService.java
    // In my case on registered I have EVENT, MSG and MSGCNT defined

    // You will NOT receive any messages unless you build a HOST server application to send
    // Messages to you, This is just here to show you how it might work

    //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.message + '</li>');
    //{'Price': 3.76, 'productID': '14401160', 'productName': 'Parmalat 2% Reduced Fat Milk, 1 qt ( Pack of 2)', 'status': 'ADD'}



	  // Example e.message
	  //{'category': 'Food/Dairy, Eggs & Cheese/Milk & Cream', 'status': 'add', 'price': 3.7599999999999998, 'productName': 'Parmalat 2% Reduced Fat Milk, 1 qt ( Pack of 2)', 'productID': '14401160'}
    var parsed = JSON.parse(e.message);
    var price = parsed.price;
    var status = parsed.status;
    var name =parsed.productName //+ " " + parsed.category;

    startListNames(name , price , status);
    //console.log(name);
    //getTableNamesForItem();
    break;


  case 'error':

    $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');

    break;



  default:
    $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');

    break;
  }
}

function
GCM_Success(e)
{
  $("#app-status-ul").append('<li>GCM_Success -> We have successfully registered and called the GCM plugin, waiting for GCM_Event:registered -> REGID back from Google</li>');

}

function
GCM_Fail(e)
{
  $("#app-status-ul").append('<li>GCM_Fail -> GCM plugin failed to register</li>');

  $("#app-status-ul").append('<li>GCM_Fail -> ' + e.msg + '</li>');

}

