package com.example.camera;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraX;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureConfig;
import androidx.camera.core.Preview;
import androidx.camera.core.PreviewConfig;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Matrix;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.location.Location;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.util.Rational;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.example.camera.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;

public class MainActivity extends AppCompatActivity {
    public static final int UPDATE_INTERVAL = 1000;
    public static final int FASTEST_INTERVAL = 500;
    private static final int PERMISSIONS_FINE_LOCATION = 99;
    public static String KEY1 = "latitude";
    public static String KEY2 = "longditude";

    private static final String TAG = MainActivity.class.getSimpleName();
    private int REQUEST_CODE_PERMISSIONS = 101;
    private String[] REQUIRED_PERMISSIONS = new String[]{"android.permission.CAMERA",
            "android.permission.WRITE_EXTERNAL_STORAGE"};
    private  String imageFileName;
    TextureView textureView;
    TextView tv_lat, tv_lon;
    Switch sw1, locationSw;
    //Button btn;
    ImageButton btn;
    OkHttp newHttp;
    final Handler handler = new Handler();
    public static String API_URL = "http://192.168.0.107:3001/";

    FusedLocationProviderClient fusedLocationProviderClient;
    boolean updateOn = false; //variable to remember if we are tracking location on not
    LocationRequest locationRequest; // config file for all settings related to FusedLocationProviderClient
    LocationCallback locationCallBack;

    double latitude;
    double longditude;



    Location currentLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getSupportActionBar().hide();

        textureView = findViewById(R.id.view_finder);
        tv_lat = findViewById(R.id.lat);
        tv_lon = findViewById(R.id.lon);
        btn = findViewById(R.id.imageButton);
        sw1 = findViewById(R.id.switch1);
        locationSw = findViewById(R.id.locationSw);

        locationRequest = LocationRequest.create();

        locationRequest.setInterval(UPDATE_INTERVAL);

        locationRequest.setFastestInterval(FASTEST_INTERVAL);

        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

        locationCallBack = new LocationCallback() {
            @Override
            public void onLocationResult(@NonNull LocationResult locationResult) {
                super.onLocationResult(locationResult);

                Location location = locationResult.getLastLocation();
                updateUIValues(location);
            }
        };

        locationSw.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(locationSw.isChecked()){
                    // turn on location tracking
                    startLocationUpdates();
                    //updateGPS();
                }
                else{
                    //turn off tracking
                    stopLocationUpdates();
                }
            }
        });
        updateGPS();
        if(allPermissionGranted()){

            startCamera();
            sw1.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if(sw1.isChecked()){
                        handler.postDelayed(new Runnable() {
                            int i =1;
                            @Override
                            public void run() {
                                btn.performClick();
                                i++;
                                Log.i(TAG, "Primer"+i);
                                handler.postDelayed(this, 5000);
                            }
                        }, 10000);
                    }
                    else{
                        handler.removeCallbacksAndMessages(null);
                    }
                }
            });

        }
        else{

            ActivityCompat.requestPermissions(this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS);
        }
    }

    private void updateGPS() {
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(MainActivity.this);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            // user provided permission
            fusedLocationProviderClient.getLastLocation().addOnSuccessListener(this, new OnSuccessListener<Location>() {
                @Override
                public void onSuccess(Location location) {
                    // we got perrmissions. Put the values of location into UI
                    updateUIValues(location);


                }
            });
        }
        else {
            // permission not granted
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
                requestPermissions(new String[] {Manifest.permission.ACCESS_FINE_LOCATION}, PERMISSIONS_FINE_LOCATION);
            }
        }
    }

    private void stopLocationUpdates() {
        tv_lat.setText("X");
        tv_lon.setText("X");
        fusedLocationProviderClient.removeLocationUpdates(locationCallBack);
    }


    @SuppressLint("MissingPermission")
    private void startLocationUpdates() {
        fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallBack, null);
        updateGPS();
    }

    private void updateUIValues(Location location) {
        try{
            latitude = location.getLatitude();
            longditude = location.getLongitude();
            tv_lat.setText(String.valueOf(latitude));
            tv_lon.setText(String.valueOf(longditude));
        }
        catch (Exception e){
            Toast.makeText(this, "Location problem " + e, Toast.LENGTH_SHORT).show();
        }
    }

    private void startCamera() {

        CameraX.unbindAll();

        Rational aspectRatio = new Rational(textureView.getWidth(), textureView.getHeight());
        Size screen = new Size(textureView.getWidth(), textureView.getHeight());

        PreviewConfig pConfig = new PreviewConfig.Builder().setTargetAspectRatio(aspectRatio).setTargetResolution(screen).build();
        Preview preview = new Preview(pConfig);

        preview.setOnPreviewOutputUpdateListener(
                new Preview.OnPreviewOutputUpdateListener() {
                    @Override
                    public void onUpdated(Preview.PreviewOutput output) {
                        ViewGroup parent = (ViewGroup) textureView.getParent();
                        parent.removeView(textureView);
                        parent.addView(textureView, 0);

                        textureView.setSurfaceTexture(output.getSurfaceTexture());
                        updateTransform();
                    }
                });

        ImageCaptureConfig imageCaptureConfig = new ImageCaptureConfig.Builder().setCaptureMode(ImageCapture.CaptureMode.MIN_LATENCY)
                .setTargetRotation(getWindowManager().getDefaultDisplay().getRotation()).build();
        final ImageCapture imgCap = new ImageCapture(imageCaptureConfig);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                File[] aDirArray = ContextCompat.getExternalFilesDirs(MainActivity.this, null);
                String filepath = Environment.getExternalStorageDirectory().getPath();
                //File file = new File(filepath + "/DCIM");
                //File storageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                imageFileName = "JPEG_" + System.currentTimeMillis() + "_";
                //File file = File.createTempFile(imageFileName, ".jpg", storageDir);
                Context context = getApplicationContext();
                File file = new File(context.getFilesDir() + "/" + imageFileName + ".jpg");
                Toast.makeText(getBaseContext(), context.getFilesDir() + "/" + imageFileName + ".jpg", Toast.LENGTH_LONG).show();
                imgCap.takePicture(file, new ImageCapture.OnImageSavedListener() {
                    @Override
                    public void onImageSaved(@NonNull File file) {
                        String msg = "Pic captured at " + file.getAbsolutePath();
                        Toast.makeText(getBaseContext(), msg,Toast.LENGTH_LONG).show();
                        Context context = getApplicationContext();
                        newHttp = new OkHttp();
                        JSONObject jsonObject = new JSONObject();
                        String lat = String.valueOf(latitude);
                        try {
                            try {
                                jsonObject.put(KEY1, String.valueOf(latitude));
                                jsonObject.put(KEY2, String.valueOf(longditude));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }

                            newHttp.post(API_URL + "gps", jsonObject);
                            newHttp.doPostRequestFile(API_URL + "camera", file, imageFileName, jsonObject);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    @Override
                    public void onError(@NonNull ImageCapture.UseCaseError useCaseError, @NonNull String message, @Nullable Throwable cause) {
                        String msg = "Pic capture failed : " + message;
                        Toast.makeText(getBaseContext(), msg,Toast.LENGTH_LONG).show();
                        Context context = getApplicationContext();
                        if(cause != null){
                            cause.printStackTrace();
                        }
                    }
                });
            }
        });
        CameraX.bindToLifecycle((LifecycleOwner)this, preview, imgCap);
    }

    private void updateTransform(){

        Matrix mx = new Matrix();
        float w = textureView.getMeasuredWidth();
        float h = textureView.getMeasuredHeight();

        float cX = w / 2f;
        float cY = h / 2f;

        int rotationDgr;
        int rotation = (int)textureView.getRotation();

        switch(rotation){
            case Surface.ROTATION_0:
                rotationDgr = 0;
                break;
            case Surface.ROTATION_90:
                rotationDgr = 90;
                break;
            case Surface.ROTATION_180:
                rotationDgr = 180;
                break;
            case Surface.ROTATION_270:
                rotationDgr = 270;
                break;
            default:
                return;
        }

        mx.postRotate((float)rotationDgr, cX, cY);
        textureView.setTransform(mx);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {

        if(requestCode == REQUEST_CODE_PERMISSIONS){
            if(allPermissionGranted()){
                startCamera();
                updateGPS();
            } else{
                Toast.makeText(this, "Permissions not granted by the user.", Toast.LENGTH_SHORT).show();
                finish();
            }
        }
    }

    private boolean allPermissionGranted() {

        for(String permission : REQUIRED_PERMISSIONS){

            if(ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED){

                return false;
            }
        }
        return true;
    }
}