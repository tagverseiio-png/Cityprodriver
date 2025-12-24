# City Pro Drivers - Project Architecture & Context

## 1. Project Overview
**City Pro Drivers** is a web application that connects car owners with professional "acting drivers" (drivers who drive the customer's vehicle). The platform serves three distinct user roles:
- **Customers:** Book drivers for hourly, daily, or outstation trips.
- **Drivers:** Accept trips, manage their profile, and upload verification documents.
- **Admins:** Manage bookings, verify driver documents, and oversee platform operations.

## 2. Technology Stack
- **Frontend Framework:** React 18 with TypeScript (`.tsx`).
- **Build Tool:** Vite.
- **Styling:** Tailwind CSS with a custom design system (CSS variables in `index.css`).
- **UI Component Library:** shadcn/ui (Radix UI primitives).
- **Animations:** Framer Motion.
- **Icons:** Lucide React.
- **Routing:** React Router DOM.
- **State Management:** React Context API (`AuthContext`) and local state.
- **Backend / Database:** Supabase (PostgreSQL, Auth, Storage).
- **Maps/Location:** Leaflet (`react-leaflet`) with OpenStreetMap/Nominatim for geocoding.

## 3. Directory Structure
- **`src/components/ui`**: Reusable primitive components (buttons, inputs, dialogs) - mostly shadcn/ui.
- **`src/components/shared`**: Business-logic components used across pages (e.g., `ServiceCard`, `LocationPicker`).
- **`src/components/layout`**: `Header`, `Footer`, and the main wrapper `Layout`.
- **`src/contexts`**: Global state providers. Key provider: `AuthContext`.
- **`src/pages`**: Main route views (`Index`, `Booking`, `Dashboards`, etc.).
- **`src/lib`**: Utilities (`utils.ts`), Supabase client (`supabase.ts`), and static data (`tariffs.ts`).
- **`src/hooks`**: Custom hooks (e.g., `use-toast`, `use-mobile`).

## 4. Architecture & Data Flow

### A. Authentication Flow (`src/contexts/AuthContext.tsx`)
1.  **Provider:** `AuthContext` wraps the application.
2.  **Mechanism:** Supabase Auth is used.
    *   **Sign Up:** `signUpWithPassword` creates a user in Supabase Auth *and* triggers a profile creation in the `public.profiles` table.
    *   **Login:** `signInWithPassword`.
    *   **Verification:** `sendVerificationOtp` and `verifyEmailOtp` for email verification.
3.  **Session Persistency:** Handled automatically by Supabase client; `AuthContext` listens to `onAuthStateChange`.

### B. Database Schema (Inferred)
The application relies on two primary tables in Supabase:

#### 1. `profiles`
Links 1:1 with `auth.users`.
-   **Core:** `id` (UUID, PK), `email`, `name`, `phone`, `role` ('customer' | 'driver' | 'admin').
-   **Status:** `is_verified` (boolean), `profile_completion` (number), `is_online` (boolean, for drivers).
-   **Driver Details:** `experience`, `address`, `city`, `pincode`, `vehicleTypes`.
-   **Documents (Drivers):** `license_doc_url`, `aadhaar_doc_url`, `pan_doc_url`, `account_details_doc_url`, `photo_url`.
-   **Verification Flags:** `license_verified`, `aadhaar_verified`, `pan_verified`, `account_verified`, `documents_verified`.

#### 2. `bookings`
-   **Core:** `id` (UUID, PK), `created_at`.
-   **Customer:** `customer_id` (FK -> profiles), `customer_name`, `customer_phone`.
-   **Trip Details:** `service_type` (hourly/daily/outstation), `pickup_location`, `destination`, `pickup_date`, `pickup_time`, `car_type`.
-   **Duration:** `duration_hours`, `duration_days`.
-   **Status:** `status` ('pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled').
-   **Driver:** `driver_id` (FK -> profiles), `driver_name`.
-   **Financials:** `amount` (numeric), `payment_status`.

### C. Booking Workflow
1.  **Initiation:** User visits `/booking`.
2.  **Form Data:** Multi-step form collects Service Type -> Location (via Map/Text) -> Schedule -> Personal Info.
3.  **Calculation:** Tariff details are fetched from `src/lib/tariffs.ts` based on `car_type`.
4.  **Submission:** Data is inserted into `bookings` table with status `pending`.
5.  **Assignment:**
    *   **Admin:** Can manually assign via `/admin`.
    *   **Driver:** Can accept `pending` trips via `/driver/dashboard`.
6.  **Updates:** Status changes (Confirm, Complete, Cancel) update the `bookings` record.

### D. Driver Verification Workflow
1.  **Upload:** Drivers upload files via `/driver/dashboard`.
2.  **Storage:** Files go to Supabase Storage bucket `docs`.
3.  **Reference:** Public URLs are saved to the `profiles` table.
4.  **Verification:** Admin views docs in `/admin`, toggles verification flags (`license_verified`, etc.).
5.  **Approval:** When all flags are true, `documents_verified` becomes true, allowing the driver to accept trips.

## 5. UI/UX Guidelines
-   **Design System:** Use Tailwind classes.
    -   Primary Color: Amber/Yellow (`bg-primary`, `text-primary`).
    -   Backgrounds: Light/Dark mode supported via CSS variables (see `index.css`).
    -   Font: 'Plus Jakarta Sans' (Headings) and 'Inter' (Body).
-   **Components:** Always use primitives from `@/components/ui` (e.g., `<Button>`, `<Input>`, `<Card>`) rather than raw HTML elements to ensure consistency.
-   **Feedback:** Use `toast` (`@/hooks/use-toast`) for success/error messages.
-   **Loading States:** Use `lucide-react`'s `Loader2` with `animate-spin` for async operations.

## 6. Key Files for AI Context
-   `src/lib/tariffs.ts`: Contains the pricing logic and vehicle types. Edit this to change prices.
-   `src/lib/supabase.ts`: The database client configuration.
-   `src/contexts/AuthContext.tsx`: The source of truth for user roles and permissions.
-   `src/pages/Booking.tsx`: The complex multi-step form logic.
-   `src/pages/AdminDashboard.tsx`: Logic for platform management and data aggregation.

## 7. Instructions for Extending
-   **Adding a Page:** Create in `src/pages`, add route in `src/App.tsx`.
-   **New Database Field:** Add to Supabase Schema -> Update interfaces in `src/contexts/AuthContext.tsx` or local interfaces -> Update fetch/insert logic.
-   **Styling:** Adhere to `rounded-xl` or `rounded-2xl` for containers to match the "friendly/modern" aesthetic. Use `shadow-card` or `shadow-elevated`.
