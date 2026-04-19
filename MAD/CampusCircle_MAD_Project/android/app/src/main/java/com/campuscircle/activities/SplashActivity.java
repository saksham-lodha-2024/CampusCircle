package com.campuscircle.activities;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.appcompat.app.AppCompatActivity;
import com.campuscircle.MainActivity;
import com.campuscircle.R;
import com.campuscircle.util.SessionManager;

/** Splash screen — waits 1 s and routes to Login or Main based on session. */
public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            SessionManager sm = new SessionManager(this);
            Intent i = sm.isLoggedIn()
                    ? new Intent(this, MainActivity.class)
                    : new Intent(this, LoginActivity.class);
            startActivity(i);
            finish();
        }, 1200);
    }
}
