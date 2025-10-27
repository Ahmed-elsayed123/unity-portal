@echo off
echo ========================================
echo Unity Portal Database Setup
echo ========================================
echo.

echo Setting up database...
echo.

echo Please enter your MySQL root password:
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS unity_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo.
echo Importing database schema...
mysql -u root -p unity_portal_db < quick_setup.sql

echo.
echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Test credentials:
echo Admin: admin@unity.edu / password123
echo Student: student@unity.edu / password123
echo Lecturer: lecturer@unity.edu / password123
echo.
echo You can now start the backend server:
echo cd backend
echo npm run dev
echo.
pause
