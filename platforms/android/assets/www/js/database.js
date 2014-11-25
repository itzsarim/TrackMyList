// This is a JavaScript file

$(document).ready(function(){
    
    
   console.log('document ready');

    
    
    openDB();
    showtable();
    checkProfile();
    getLoginStatus();
    //setTargetList();
    //setUserName("henry");
    //setLoginStatus("henry");
    //retrieveUser("henry");
});



/**
*database variables and functions
*/
var dbname='mydb';
var version='1.1';
var dbdesc='mydb';

var table_list='';

var dbsize=30000;
var db=null;




/**
 * Open database 'mydb';
 * @returns {Boolean}
 */
function openDB(callback){
    try{
    console.log('database open');
         if (!window.openDatabase) {
             console.log('your system doesn\'t support database!');
             return false;
         } 
		db = window.openDatabase(dbname, version, dbdesc, dbsize);
		return true;
	}catch(e){
		if(e==2){
			console.log("Invalid Database Version");
		}else{
			console.log("Error "+e+".");
		}
		return false;
	}
}

/**
 * exacuate sql
 * @param sql
 */
function execSql(sql,param,callback){
	if(db==null){openDB();}
	db.transaction(function(tx) {
		tx.executeSql(sql,param, function(tx, result) {
			if(typeof(callback) == 'function') {callback(true)}
			return true;
		}, function(tx, error) {
			if(typeof(callback) == 'function') {callback(false)}
			console.log(error);
			return false;
		});
	});
}
var profileFields=['username','loggedin','tablename','targetList','gcmId','cartId'];
var listFields=[
   'id',				
   'item',
   'list',
   'bought',
   'budget',
   'price'
  ];

var insertP = [];
var itemID = 1;
function createPara(id,itemName,listName){
    insertP[0]=id;
    insertP[1]=itemName;
    insertP[2]=listName;
    insertP[3]=false;
    insertP[4]=null;
    insertP[5]=0;
    return insertP;
}

/**
 * initialize database
 */
function initDB(){
	if(db==null){openDB();}
	createTable(table_list,listFields,{"id":"primary key","item":"not null","list":"not null","bought":"not null","budget":"not null","price":"not null"});
}

/**
 * create a table in a database
 * @param tableName
 * @param fields		databae field defined above;
 * @param constraint	constraint to the field,
 * 	format：{"id":"integer primary key autoincrement","app_flow_no":"not null"}
 */
function createTable(tableName,fields,constraint){

	if(db==null){openDB();}
    var drop = 'DROP TABLE IF EXISTS '+tableName;
    execSql(drop);
    var sql ='CREATE TABLE IF NOT EXISTS '+tableName+' (';
	for(i in fields){
		var key = "";
		if(typeof(constraint)!="undefined" && typeof(constraint[fields[i]]) !="undefined"){
			key = " "+constraint[fields[i]];
		}
		sql+=fields[i]+key+",";
	}
	sql = sql.substr(0,sql.length-1);
	sql += ")";
	console.log(sql);
	execSql(sql);
}


/**
 * update database
 * @param tableName	
 * @param setFields	the attribute array that needs updating
 * @param setParams	parameter array corresponding to attribute array
 * @param whereStr(optional)	where clause, note that its parameters should be occupied by "?", "where" itself isn't included. e.x. "id=?", "item=?","list=?"
 * @param wherParams(optional) parameter array of where clause
 */
function updateTable(tableName,setFields,setParams,whereStr,wherParams){
	var sql = "update "+tableName+" set ";
	for(i in setFields){
		sql+=setFields[i]+"=?,";
	}
	sql = sql.substr(0,sql.length-1);
	if(typeof(whereStr)!="undefined" && typeof(wherParams)!="undefined"
		&& whereStr!=""){
		sql += " where " + whereStr;
		setParams = setParams.concat(wherParams);
	}
	execSql(sql,setParams);
}

/**
 * insert row into table
 * @param tableName
 * @param insertFields
 * @param insertParams
 */
function insertTable(tableName,insertFields,insertParams){
	var sql = "insert into "+tableName+" (";
	var sql2 = " values(";
	for(i in insertFields){
		sql+=insertFields[i]+",";
		sql2 +="?,"
	}
	sql = sql.substr(0,sql.length-1);
	sql2 = sql2.substr(0,sql2.length-1);
	sql += ")";
	sql2 +=  ")";
    //alert(sql+sql2+insertParams[0]+", "+insertParams[1]+", "+insertParams[2]+", "+insertParams[3]+", "+insertParams[4]+", "+insertParams[5]);
	execSql(sql+sql2,insertParams);
}

/**
 * delete row from table
 * @param tableName
 * @param whereStr
 * @param wherParams
 */
function deleteRow(tableName,whereStr,wherParams){
	var sql = "delete from "+tableName;
	if(typeof(whereStr)!="undefined" && typeof(wherParams)!="undefined"
		&& whereStr!=""){
		sql += " where " + whereStr;
	}
	execSql(sql,wherParams);
}	

/**
 * query data from table
 * @param tableName
 * @param selectFields	select clause，param should be a string, use "*" if select all;
 * @param whereStr		where clause, note that its parameters should be occupied by "?", "where" itself isn't included. e.x. "id=?", "item=?","list=?"
 * @param wherParams	parameter array of where clause
 * @callback returned object will be parameter of callback function
 */
function select(tableName,selectFields,whereStr,wherParams,callback){
	if(db==null){openDB();}
	var sql = "SELECT "+selectFields+" FROM "+tableName;
	if(typeof(whereStr)!="undefined" && typeof(wherParams)!="undefined"
		&& whereStr!=""){
		sql += " where " + whereStr;
	}
    console.log(sql);
	 db.transaction(function(tx){
          tx.executeSql(sql,wherParams,function(tx,results){
        	  if(results.rows.length<1){
        		  if (typeof(callback) == 'function') {callback(false)} //no data
        	  }else{
              	  if(typeof(callback) == 'function') {callback(results.rows)}
        	  }
          },function(tx,error){
              return false;
          });
      });
}
 

