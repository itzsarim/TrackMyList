/*
 * cordova.oauth2.js - v0.1.1
 * 
 * jQuery plugin to do Oauth2 login using either authorization code
 * grant or implicit grant method in a Cordova application
 * 
 * Usage:
 *   $.oauth2(options, successCallback, errorCallback);
 *
 *   $.oauth2({
 *        auth_url: '',         // required
 *        response_type: '',    // required
 *        token_url: '',        // required if response_type = 'code'
 *        logout_url: '',       // recommended if available
 *        client_id: '',        // required
 *        client_secret: '',    // required if response_type = 'code'
 *        redirect_uri: '',     // required - some dummy url
 *        other_params: {}      // optional params object for scope, state, display...
 *    }, function(token, response){
 *          // do something with token and response
 *    }, function(error){
 *          // do something with error
 *    });
 *
 *
 *
 *
*/
function setUserName(name){
    updateTable("userprofile",['username'],[name],"tablename=?",["userprofile"]);
    //alert("set username success");
} 
function setLoginStatus(status){
    updateTable("userprofile",['loggedin'],[status],"tablename=?",['userprofile']);
    //alert("set status success");
}

function oauth2_login() {
    $.oauth2({
        auth_url: 'https://accounts.google.com/o/oauth2/auth',           // required
        response_type: 'code',      // required - "code"/"token"
        token_url: 'https://accounts.google.com/o/oauth2/token',          // required if response_type = 'code'
        logout_url: '',         // recommended if available
        client_id: '378239996981-s1ne80smaduluv7lkdmpooa34ohkvsit.apps.googleusercontent.com',          // required
        client_secret: 'VWzAhGy8mpKxshuWA3TVhi-0',      // required if response_type = 'code'
        redirect_uri: 'http://localhost',       // required - some dummy url
        other_params: {scope:'https://www.googleapis.com/auth/plus.login'}        // optional params object for scope, state, display...
    }, function(token, response){
        // do something with token or response
        
        console.log('token',token);
        console.log('response',JSON.stringify(response));
        $.ajax({
                            url: 'https://www.googleapis.com/plus/v1/people/me' ,
                            data:'access_token='+token,
                            type: 'GET',
                            success: function(data){
                            var username = data['displayName'];
                            setUserName(username);
                            setLoginStatus(true);

                            window.location.replace("#pair");
                               
                            },
                            error: function(error){
                                errorCallback(error, error);
                            }
                        });
    }, function(error, response){
        // do something with error object
        alert('error',JSON.stringify(error));
    }); 
}

(function($){            
    $.oauth2 = function (options, successCallback, errorCallback) {
        
        // checks if all the required oauth2 params are defined
        var checkOauth2Params = function(options){
            var missing = "";
            if(!options.client_id) {missing += " client_id"}
            if(!options.auth_url) {missing += " auth_url"}
            if(!options.response_type) {missing += " response_type"}
            if(!options.client_secret && options.response_type == "code") {missing += " client_secret"}
            if(!options.token_url && options.response_type == "code") {missing += " token_url"}
            if(!options.redirect_uri) {missing += " redirect_uri"}  
            if(missing){
                var error_msg = "Oauth2 parameters missing:" + missing;
                errorCallback(error_msg, {error:error_msg});
                return false;
            } else {
                return true;
            }
        }
        
        // performs logout after oauth redirect
        var oauth2Logout = function(options){
            if(options.logout_url){
                var s = document.createElement("script");
                s.src = options.logout_url;
                $("head").append(s);
            }     
        }
        
        // String prototype to parse and get url params
        String.prototype.getParam = function( str ){
            str = str.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regex = new RegExp( "[\\?&]*"+str+"=([^&#]*)" );	
            var results = regex.exec( this );
            if( results == null ){
                return "";
            } else {
                return results[1];
            }
        }        
        
        // if params missing return
        if(!checkOauth2Params(options)) return;

        // build oauth login url
        var paramObj = {
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: options.response_type
        };
        $.extend(paramObj, options.other_params);
        var login_url = options.auth_url + '?' + $.param(paramObj);

        // open Cordova inapp-browser with login url
        var loginWindow = window.open(login_url, '_blank', 'location=yes');

        // check if redirect url has code, access_token or error 
        $(loginWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            
            // if authorization code method check for code/error in url param
            if(options.response_type == "code"){
                url = url.split("#")[0];   
                var code = url.getParam("code");
                var error = url.getParam("error");
                if (code || error){
                    loginWindow.close();
                    oauth2Logout(options);
                    if (code) {
                        $.ajax({
                            url: options.token_url,
                            data: {code:code, client_id:options.client_id, client_secret:options.client_secret, redirect_uri:options.redirect_uri, grant_type:"authorization_code"},
                            type: 'POST',
                            success: function(data){
                                var access_token;
                                if((data instanceof Object)){
                                    access_token = data.access_token;
                                } else {
                                    access_token = data.getParam("access_token");
                                }
                                successCallback(access_token, data);
                            },
                            error: function(error){
                                errorCallback(error, error);
                            }
                        });
                    } else if (error) {
                        errorCallback(error, url.split("?")[1]);
                    }
                }
            // if implicit method check for acces_token/error in url hash fragment
            } else if(options.response_type == "token") {
                var access_token = url.split("access_token=")[1];
                var error = url.split("error=")[1];
                if(access_token || error){
                    loginWindow.close();
                    oauth2Logout(options);
                    if(access_token){
                        successCallback(access_token, url.split("#")[1]);
                    } else if(error){
                        errorCallback(error, url.split("#")[1]);
                    }                   
                }
            }
        });
    }; 
}(jQuery));