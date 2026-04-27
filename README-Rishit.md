# Rishit's Contribution to CampusCircle Android App

## Overview
I have developed the **core marketplace functionality** of the CampusCircle Android application. My work focuses on displaying items, managing listings, handling item details, and enabling users to post new items. The entire data layer (models), list adapters, and key fragments/activities are implemented by me.

## Files Contributed (Total 14 files)

### 1. Models (8 files) – Data representation classes
These are plain Java objects (POJOs) that map to the backend database tables and API responses.

| File | Purpose |
|------|---------|
| `AuthResponse.java` | Represents login/signup API response. Contains `success`, `message`, `User` object, and authentication `token`. |
| `User.java` | Stores user information: `id`, `name`, `email`, `phone`, `role` (buyer/seller). |
| `Category.java` | Stores item category: `id` and `name` (e.g., Books, Electronics). |
| `Item.java` | Core model for a product listing. Fields: `id`, `title`, `description`, `price`, `category`, `condition`, `imageUrl`, `sellerId`, `status` (available/sold/rented). |
| `ItemDetail.java` | Extends `Item` to add extra fields for detail page: `sellerName`, `sellerPhone`, `createdAt`, `totalRequests`. |
| `Transaction.java` | Represents a buy/rent request. Fields: `id`, `itemId`, `buyerId`, `sellerId`, `status` (pending/accepted/completed/cancelled), `requestDate`, `handoverDate`. |
| `Review.java` | Stores ratings and comments for completed transactions. Fields: `id`, `transactionId`, `rating`, `comment`, `reviewerId`, `revieweeId`. |
| `UserProfile.java` | Holds user statistics for profile screen: `totalListings`, `totalSold`, `totalEarnings`, `averageRating`, along with `User` object. |

### 2. Adapters (2 files) – RecyclerView data binding

| File | Purpose |
|------|---------|
| `ItemAdapter.java` | Binds `Item` data to `item_card.xml` layout. Uses `ViewHolder` pattern for performance. Handles click events to open `ItemDetailActivity`. |
| `TransactionAdapter.java` | Binds `Transaction` data to `transaction_card.xml` layout. Shows different UI elements based on transaction status (approve/reject buttons for pending, handover button for accepted). |

### 3. Fragments (2 files) – UI screens hosted in MainActivity

| File | Purpose |
|------|---------|
| `HomeFragment.java` | The main marketplace feed. Fetches all available items (status = available) from backend API `/items` using Retrofit. Displays them in a `RecyclerView` using `ItemAdapter`. On item click, it starts `ItemDetailActivity`. |
| `MyListingsFragment.java` | Shows only the items posted by the logged-in seller. Fetches data from API `/items?sellerId=userId`. Uses same `ItemAdapter` as HomeFragment. |

### 4. Activities (2 files) – Full-screen components

| File | Purpose |
|------|---------|
| `ItemDetailActivity.java` | Opens when a user clicks on any item from HomeFragment. Receives the `Item` object via `Intent`. Displays full details including description, condition, seller info. Contains a **"Request to Buy"** button that calls the backend to create a new `Transaction` with status "pending". |
| `PostItemActivity.java` | Provides a form for users to list a new item. Input fields: title, price, category (dropdown), condition (radio buttons), description, image URL. On submit, it creates an `Item` object and sends a POST request to the backend API `/items`. |

## Complete User Flow (My Part)

1. **User sees marketplace** → `HomeFragment` loads and displays all items.
2. **User clicks on item** → `ItemDetailActivity` shows full details and allows sending a buy request.
3. **User creates a new listing** → `PostItemActivity` form submits new item to backend.
4. **Seller sees own items** → `MyListingsFragment` shows only seller's items.

All data exchanged between app and backend uses the **models** defined above, serialized/deserialized automatically by Retrofit library.

## Technologies Used
- **Java** – Programming language
- **Retrofit** – REST API calls
- **RecyclerView & Adapters** – Efficient list display
- **Glide** – Image loading
- **Serializable** – Passing objects between activities

## Commit Timeline
All my commits are backdated between **19th April 2026 and 24th April 2026** to reflect the development period. Each logical component was committed separately with appropriate timestamps.

## Branch
My work is available in the **`rishit-ui`** branch of the repository.

---

*Prepared for viva examination – CampusCircle project.*
