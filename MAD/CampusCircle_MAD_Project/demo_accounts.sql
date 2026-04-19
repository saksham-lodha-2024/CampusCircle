-- =====================================================================
-- Campus Circle — Demo Accounts reset
-- Run this ONCE after 02_seed.sql to set known login passwords on
-- four demo users.  Use these during the viva demo.
--
-- DEMO CREDENTIALS (all share the same password for simplicity):
--   ----------------------------------------------------------------
--   Name               | Email                                    | Password
--   ----------------------------------------------------------------
--   Saksham Lodha      | saksham.lodha.240626@bmu.edu.in          | demo@123
--   Gauri Pandey       | gauri.pandey.240959@bmu.edu.in           | demo@123
--   Rishit Rebant      | rishit.rebant.240608@bmu.edu.in          | demo@123
--   Prerit Shrivastava | prerit.shrivastava.240593@bmu.edu.in     | demo@123
--   ----------------------------------------------------------------
--
-- During the viva, log in as:
--   * SELLER view  →  Saksham  (has listings, gets buy requests)
--   * BUYER view   →  Rishit   (creates requests, reviews sellers)
--   * DUAL role    →  Gauri    (both sells and buys)
--   * REVIEWER     →  Prerit   (completes txn and writes review)
-- =====================================================================

USE campus_circle;

UPDATE users SET password = 'demo@123', is_verified = 1
 WHERE email IN (
    'saksham.lodha.240626@bmu.edu.in',
    'gauri.pandey.240959@bmu.edu.in',
    'rishit.rebant.240608@bmu.edu.in',
    'prerit.shrivastava.240593@bmu.edu.in'
 );

-- Make sure the 4 demo users have verified_by pointing at a real admin
UPDATE users SET verified_by = 1
 WHERE email IN (
    'saksham.lodha.240626@bmu.edu.in',
    'gauri.pandey.240959@bmu.edu.in',
    'rishit.rebant.240608@bmu.edu.in',
    'prerit.shrivastava.240593@bmu.edu.in'
 );

-- Quick sanity check
SELECT user_id, name, email, is_verified
  FROM users
 WHERE email LIKE '%240%@bmu.edu.in'
 ORDER BY user_id;
