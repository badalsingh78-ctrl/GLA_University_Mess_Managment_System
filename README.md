# GLA UNIVERSITY MATHURA Mess Management Platform

This platform is tailored for GLA UNIVERSITY MATHURA to streamline mess management by providing distinct interfaces for mess supervisors and students. It offers efficient tools for managing daily operations and a user-friendly interface for meal selection and purchasing.

## Run locally

The frontend development server uses port 3000 and sends API requests to the backend on port 4000.

1. Install the backend dependencies from the project root: `npm install --ignore-scripts`.
2. Install the frontend dependencies: run `cd frontend`, then `npm install --ignore-scripts`.
3. Copy `config/config.env.example` to `config/config.env` and replace the placeholder values. A reachable MongoDB database and Google OAuth credentials are required to start the backend. Razorpay test credentials are needed to process payments.
4. In one terminal at the project root, run `npm start` to start the backend on port 4000.
5. In a second terminal, run `cd frontend` and then `npm start` to start the frontend on port 3000.

Set the Google OAuth redirect URI to `http://localhost:4000/api/auth/google/callback`. Keep `config/config.env` private; it is excluded by `.gitignore`.

## For MESS SUPERVISORS

The dedicated supervisor portal facilitates the following functions:

- **Weekly Menu Administration:**  
  Update and maintain the weekly meal offerings with ease.
- **Schedule Management:**  
  Adjust meal service timings to align with operational requirements.
- **Pricing Control:**  
  Configure and modify meal prices dynamically.
- **Demand Monitoring:**  
  Track the total number of meals to be prepared based on student selections.
- **QR Code Verification:**  
  Validate meal coupons by scanning unique QR codes to ensure authenticity.
- **Integrated Payment Processing:**  
  Leverage Razorpay integration for secure and efficient online transactions.

## For STUDENTS

The student interface is designed to deliver a seamless and intuitive experience:

- **Comprehensive Weekly Menu:**  
  Access detailed weekly menus, including meal timings and pricing information.
- **Effortless Meal Selection and Purchase:**  
  Select meals for the forthcoming week using an intuitive checkbox system, with automatic calculation of the total payable amount.
- **Order History Access:**  
  Review a complete history of purchased meal coupons covering both current and future weeks.
- **Unified QR Code System:**  
  Utilize a single, static QR code in lieu of traditional paper coupons; the option to regenerate the QR code is available in case of security concerns.

## Detailed Project Overview

### Student Interface

- **Homepage Display:**  
  The landing page exhibits mess timings and the weekly menu in a clear and easily navigable layout.  
  ![](/assets/time_menu.png)

- **Secure Authentication:**  
  Students are required to sign in using their Google accounts. Configure Google OAuth for the GLA University Mathura accounts authorized to use this deployment.
  ![](/assets/google_signin.png)

- **Meal Coupon Selection Process:**  
  An interactive interface allows students to select their preferred meals for the next week via checkboxes. The system computes the total cost in real time.  
  ![](/assets/purchase_page.png)

- **Payment Gateway Redirection:**  
  Upon clicking "Continue with Payment," students are seamlessly redirected to Razorpay’s secure payment gateway to complete the transaction.  
  ![](/assets/payment.png)

- **Order Management:**  
  A dedicated section maintains a detailed record of all purchased meal coupons, accessible for both current and forthcoming weeks.  
  ![](/assets/purchase_history.png)

- **QR Code Assignment:**  
  Each student is provided with a unique static QR code, which can be displayed on a smartphone or printed. The system supports QR code regeneration if necessary.  
  ![](/assets/qr_code.png)

### Supervisor Interface

- **Control Dashboard:**  
  The supervisor dashboard empowers administrative users to update meal prices, adjust service times, and manage the weekly menu in real time.  
  ![](/assets/admin_panel.png)

- **Meal Preparation Summary:**  
  A summarized view of meal orders is provided, detailing the total number of meals to be prepared based on current coupon purchases for the ongoing and upcoming weeks.  
  ![](/assets/total_meals.png)

- **QR Code Scanning and Validation:**  
  Supervisors can verify meal coupons with an integrated QR code scanning feature. Valid codes are confirmed with a check mark, while invalid or already redeemed codes are indicated with a cross.  
  A “Scan New” functionality facilitates uninterrupted scanning of successive codes.  
  ![](/assets/scan_qr.png)
