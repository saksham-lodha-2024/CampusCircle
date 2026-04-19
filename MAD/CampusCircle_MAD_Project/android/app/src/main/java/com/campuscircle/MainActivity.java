package com.campuscircle;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import com.campuscircle.fragments.*;
import com.google.android.material.bottomnavigation.BottomNavigationView;

/**
 * Host for the 4 main tabs: Home · My Listings · Requests · Profile.
 * Uses BottomNavigationView from Material (Lecture 9).
 */
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        BottomNavigationView nav = findViewById(R.id.bottomNav);

        // Default tab
        swap(new HomeFragment());

        nav.setOnItemSelectedListener(item -> {
            Fragment f;
            int id = item.getItemId();
            if (id == R.id.nav_home)           f = new HomeFragment();
            else if (id == R.id.nav_listings)  f = new MyListingsFragment();
            else if (id == R.id.nav_requests)  f = new RequestsFragment();
            else                               f = new ProfileFragment();
            swap(f);
            return true;
        });
    }

    private void swap(Fragment f) {
        getSupportFragmentManager()
            .beginTransaction()
            .replace(R.id.fragmentContainer, f)
            .commit();
    }
}
