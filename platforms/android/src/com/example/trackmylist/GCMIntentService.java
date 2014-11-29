package com.example.trackmylist; //Edit this to match the name of your application

import com.google.android.gcm.*;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import com.plugin.GCM.GCMPlugin;


public class GCMIntentService extends GCMBaseIntentService {

  public static final String ME="GCMReceiver";

  public GCMIntentService() {
    super("GCMIntentService");
  }
  private static final String TAG = "GCMIntentService";

  @Override
  public void onRegistered(Context context, String regId) {

    Log.v(ME + ":onRegistered", "Registration ID arrived!");
    Log.v(ME + ":onRegistered", regId);

    JSONObject json;

    try
    {
      json = new JSONObject().put("event", "registered");
      json.put("regid", regId);

      Log.v(ME + ":onRegisterd", json.toString());

      // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
      // In this case this is the registration ID
      GCMPlugin.sendJavascript( json );

    }
    catch( JSONException e)
    {
      // No message to the user is sent, JSON failed
      Log.e(ME + ":onRegisterd", "JSON exception");
    }
  }

  @Override
  public void onUnregistered(Context context, String regId) {
    Log.d(TAG, "onUnregistered - regId: " + regId);
  }

  @Override
  protected void onMessage(Context context, Intent intent) {
    Log.d(TAG, "onMessage - context: " + context);

    // Extract the payload from the message
    Bundle extras = intent.getExtras();
    if (extras != null) {
      try
      {
        Log.v(ME + ":onMessage extras ", extras.getString("message"));

        JSONObject json;
        json = new JSONObject().put("event", "message");


        // My application on my host server sends back to "EXTRAS" variables message and msgcnt
        // Depending on how you build your server app you can specify what variables you want to send
        //
        json.put("message", extras.getString("message"));
        //json.put("msgcnt", extras.getString("msgcnt"));

        Log.v(ME + ":onMessage ", json.toString());

        GCMPlugin.sendJavascript( json );
        // Send the MESSAGE to the Javascript application
      }
      catch( JSONException e)
      {
        Log.e(ME + ":onMessage", "JSON exception");
      }        	
    }

//    String message = extras.getString("message");
//    String title = extras.getString("title");
//    Notification notif = new Notification(android.R.drawable.btn_star_big_on, message, System.currentTimeMillis() );
//    notif.flags = Notification.FLAG_AUTO_CANCEL;
//    notif.defaults |= Notification.DEFAULT_SOUND;
//    notif.defaults |= Notification.DEFAULT_VIBRATE;
//     
//    Intent notificationIntent = new Intent(context, TrackMyList.class);
//    notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//    PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);
//     
//    notif.setLatestEventInfo(context, title, message, contentIntent);
//    String ns = Context.NOTIFICATION_SERVICE;
//    NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(ns);
//    mNotificationManager.notify(1, notif);

  }

  @Override
  public void onError(Context context, String errorId) {
    Log.e(TAG, "onError - errorId: " + errorId);
  }




}
