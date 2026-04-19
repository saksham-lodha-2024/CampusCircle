# Campus Circle — Project Structure & File Distribution

Below is the complete, detailed directory tree for the Campus Circle full-stack repository. It outlines the 3-tier architecture (MySQL Database, Node.js Backend, Android Frontend) along with specific team member assignments and the purpose of every file.

```text
CampusCircle-Final/
│
├── README.md                              [Saksham] Main project documentation & setup guide
├── demo_accounts.sql                      [Saksham] Resets passwords for 4 viva-demo users
│
├── CampusCircle-DBMS/                     [Pari] The complete CSE2021 Database Project
│   ├── 01_schema.sql                      Table definitions, PK/FK, CHECK constraints
│   ├── 02_seed.sql                        Sample users, items, and transactions
│   ├── 03_views.sql                       v_active_listings, v_seller_dashboard, etc.
│   ├── 04_procedures.sql                  sp_list_new_item, sp_create_transaction, etc.
│   ├── 05_triggers.sql                    Triggers for audit logs and status updates
│   ├── 06_queries.sql                     DQL catalogue (Joins, Subqueries)
│   ├── 07_transactions_demo.sql           TCL demo (Commit/Rollback/Savepoint)
│   ├── 08_indexing_demo.sql               EXPLAIN queries and B-Tree indexes
│   └── docs/09_normalization.md           1NF to 3NF proof document
│
├── backend/                               [Saksham] Node.js REST API Server
│   ├── package.json                       Dependencies (express, mysql2, dotenv, cors)
│   ├── server.js                          [Saksham] Express app entry point & middleware
│   ├── db.js                              [Saksham] MySQL2 connection pool setup
│   ├── .env.example                       [Saksham] Template for DB_PASSWORD
│   └── routes/
│       ├── auth.js                        [Saksham] Login/Signup API routing
│       ├── items.js                       [Saksham] Fetch listings and post new items API
│       ├── categories.js                  [Saksham] Fetch categories API
│       ├── transactions.js                [Saksham] Request to buy, approve, handover API
│       ├── reviews.js                     [Saksham] Submit review API
│       └── users.js                       [Saksham] Fetch user profile stats API
│
└── android/                               [Prerit] Android Studio (Java) Project Root
    ├── build.gradle                       [Prerit] Project-level Gradle config
    ├── settings.gradle                    [Prerit] Project module settings
    └── app/
        ├── build.gradle                   [Prerit] App-level Gradle (Retrofit, Glide deps)
        └── src/main/
            ├── AndroidManifest.xml        [Prerit] Core config, Internet permissions, Activity registry
            │
            ├── java/com/campuscircle/
            │   ├── MainActivity.java      [Gauri] Hosts Bottom Navigation & Fragments
            │   │
            │   ├── api/                   [Prerit] Retrofit Networking Layer
            │   │   ├── ApiClient.java     Retrofit instance & BASE_URL (10.0.2.2 or LAN IP)
            │   │   └── ApiService.java    Interface mapping Java methods to Node.js endpoints
            │   │
            │   ├── util/                  [Pari] Helper Classes
            │   │   └── SessionManager.java SharedPreferences for keeping user logged in
            │   │
            │   ├── models/                [Rishit & Pari] Java POJO Data Classes
            │   │   ├── User.java          Maps to users table
            │   │   ├── Item.java          Maps to items table / v_active_listings
            │   │   ├── Category.java      Maps to categories table
            │   │   ├── Transaction.java   Maps to transactions table
            │   │   └── Review.java        Maps to reviews table
            │   │
            │   ├── adapters/              [Rishit] RecyclerView List Managers
            │   │   ├── ItemAdapter.java   Binds Item.java data to item_card.xml
            │   │   └── TransactionAdapter.java Binds Transaction.java data to transaction_card.xml
            │   │
            │   ├── fragments/             [Gauri, Rishit, Prerit, Pari] Bottom Nav Screens
            │   │   ├── HomeFragment.java       [Rishit] Displays marketplace feed
            │   │   ├── MyListingsFragment.java [Rishit] Displays seller's active items
            │   │   ├── RequestsFragment.java   [Prerit] Buyer/Seller transaction dashboard
            │   │   └── ProfileFragment.java    [Pari] User dashboard, earnings, avg rating
            │   │
            │   └── activities/            [Team] Full Screen Android Activities
            │       ├── SplashActivity.java        [Gauri] App entry loading screen
            │       ├── LoginActivity.java         [Pari] Authentication login form
            │       ├── SignupActivity.java        [Pari] Account creation form
            │       ├── PostItemActivity.java      [Rishit] Form to list a new item for sale/rent
            │       ├── ItemDetailActivity.java    [Rishit] Expanded view of an item
            │       ├── RequestDetailActivity.java [Prerit] Seller screen to approve/reject requests
            │       ├── HandoverActivity.java      [Prerit] Buyer screen to mark as completed
            │       └── ReviewActivity.java        [Pari] Post-handover star rating screen
            │
            └── res/                       [Gauri] UI/UX, Layouts & Styling Resources
                ├── values/
                │   ├── colors.xml         App color palette from Figma
                │   ├── strings.xml        Hardcoded text values
                │   └── themes.xml         Material UI styles (CcButton, CcInput)
                │
                ├── drawable/
                │   ├── bg_card.xml        Rounded corner background for items
                │   ├── bg_chip.xml        Styling for category tags
                │   ├── ic_home.xml        Vector icon for nav bar
                │   ├── ic_list.xml        Vector icon for nav bar
                │   ├── ic_requests.xml    Vector icon for nav bar
                │   └── ic_profile.xml     Vector icon for nav bar
                │
                ├── menu/
                │   └── bottom_nav_menu.xml Links icons to the 4 main fragments
                │
                └── layout/                [Gauri & Team] XML UI Definitions
                    ├── activity_splash.xml        UI for SplashActivity
                    ├── activity_login.xml         UI for LoginActivity
                    ├── activity_signup.xml        UI for SignupActivity
                    ├── activity_main.xml          UI for MainActivity (contains BottomNav)
                    ├── activity_item_detail.xml   UI for ItemDetailActivity
                    ├── activity_post_item.xml     UI for PostItemActivity
                    ├── activity_request_detail.xml UI for RequestDetailActivity
                    ├── activity_handover.xml      UI for HandoverActivity
                    ├── activity_review.xml        UI for ReviewActivity
                    ├── fragment_home.xml          UI for HomeFragment (contains RecyclerView)
                    ├── fragment_my_listings.xml   UI for MyListingsFragment
                    ├── fragment_requests.xml      UI for RequestsFragment
                    ├── fragment_profile.xml       UI for ProfileFragment
                    ├── item_card.xml              Single row UI design for marketplace items
                    └── transaction_card.xml       Single row UI design for transaction history
```
