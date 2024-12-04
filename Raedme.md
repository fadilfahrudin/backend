
# Project Setup Documentation

## **Getting Started**

Follow these steps to set up and run the project on your local machine.

---

## **1. Clone Repository**
Clone the repository from the source using the `git` command:

```bash
git clone https://github.com/fadilfahrudin/backend.git
```

Replace `https://github.com/fadilfahrudin/backend.git` with the URL of the repository.

---

## **2. Install Dependencies**
Navigate to the project folder and install all dependencies:

```bash
cd backend
npm install
```

---

## **3. Setup `.env` Configuration**
Create a `.env` file in the root folder of your project and add the following configuration:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_NAME=db_name
DB_USER=username
DB_PASSWORD=
DB_HOST=localhost

# JWT Configuration
SECRET_TOKEN_KEY=your-secret-token-key
REFRESH_TOKEN_KEY=your-refresh-token-key

```

### **Note:**
- Replace `yourpassword`, `yourdatabase`, `your-secret-token-key`, and `your-refresh-token-key` with your actual values.

---

## **4. Setup Database**
Ensure the MySQL database server is running. Create a new database matching the name specified in `DB_NAME` in the `.env` file.

---

## **5. Run Migrations**
Run the following command to apply migrations and create the necessary tables:

```bash
npx sequelize-cli db:migrate
```

Upon success, the required tables will be created in your database.

---

## **6. Run Seeder**
Use the following command to seed the database with dummy data:

```bash
npx sequelize-cli db:seed:all
```

### **Expected Output:**
- A user is added to the `Users` table with:
  - **Username:** `admin`
  - **Password:** `admin123` (hashed).

---

## **7. Start the Project**
Run the server using the following command:

```bash
npm run start
```

The server will start at the port specified in the `.env` file (default: `http://localhost:3000`).

---

## **8. Access API**
Use tools like **Postman** or **cURL** to access the provided API endpoints.

### Example Endpoints:

- **Login:**
  - **URL:** `POST /login`
  - **Body:**
    ```json
    {
      "username": "admin",
      "password": "admin123"
    }
    ```

- **Refresh Token:**
  - **URL:** `GET /refreshToken`
  - Use the `refreshToken` cookie.


- **Vendor:**
  - **Get All Vendor:** `GET /vendors`
  - **Create Vendor:** `POST /vendors`

---

## **9. Revert Migrations or Seeders (Optional)**

- To revert migrations:
  ```bash
  npx sequelize-cli db:migrate:undo
  ```

- To revert seeders:
  ```bash
  npx sequelize-cli db:seed:undo
  ```

