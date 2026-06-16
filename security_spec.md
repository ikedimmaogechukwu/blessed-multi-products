# Blessed Multi-Products Security Rules Specification

## 1. Data Invariants
- **Authentication Integrity**: Only authenticated users are allowed to retrieve or edit their specific order and profile information. General clients can read settings and products.
- **Admin Privilege Escapes**: Users cannot mark themselves as administrators (`isAdmin`). Setting `isAdmin` must only be done through trusted channels or bootstrapped admin emails.
- **Immutability of Key Fields**: `createdAt`, `userId`, `orderedItems` cannot be tampered with after creation in an order.
- **Price and Quantity Validation**: Prices must be numerical and strictly positive. Stock qualities must be positive numbers.
- **Strict Keys**: Document payloads for creations must strictly contain required properties without phantom fields.

## 2. The "Dirty Dozen" Payloads
These 12 scenarios describe operations that must be securely blocked by our rules:
1. **Unauthenticated User Profile Read**: Reading another user's personal profile document.
2. **Identity Spoofing**: Creating a user profile for user `victim_uid` with logged-in user `my_uid`.
3. **Privilege Escalation**: Modifying or creating a user profile with `isAdmin: true` by the user themselves.
4. **Unauthenticated order submission**: Setting up an order with dummy parameters without logging in (unless allowed as a checked guest order, but still must protect ownership).
5. **Editing Another User's Order**: Authenticated user trying to read or write an order owned by a different UID.
6. **Altering Already Paid Order State**: Bypassing transition validation to set an order status to "Delivered" on a non-admin client.
7. **Phantom Field Insertion on Products**: Creating/creating a product with unapproved field parameters like `isDiscountSuperSpecial: true`.
8. **Negative Product Pricing**: Setting the price of a laptop to `-999.00` to siphon funds.
9. **Zero-Stock Manipulation**: Updating stock counts manually by a regular customer to lock items.
10. **Unauthenticated Settings Modify**: Regular site visitors attempting to rewrite the company WhatsApp number or homepage promotional banner.
11. **Altering Wishlist Belonging to Others**: Creating or updating a wishlist document under another user's ID.
12. **Malicious ID poisoning**: Injecting a 2MB string as a ID parameter to trigger resource exhaust.

## 3. The Test Runner Definition
We will secure these gates by writing the rules inside `firestore.rules` and validating with the ESLint Firestore security plugin, ensuring zero update-gaps and zero privilege escalations.
Our admins will be validated using their Google UID or email matched with the bootstrapped admin email: `ogechukwublessing009@gmail.com`.
