# RFQ Management System

This project is a full-stack web application for managing Requests for Quotation (RFQs), Quotations, Purchase Orders (POs), and Invoices. It supports role-based access for **Admin**, **Client**, and **Employee**, offering customized dashboards and workflows for each role.

## 🚀 Features

- Role-based authentication and dashboards (Admin, Client, Employee)
- RFQ creation and management
- Quotation submissions and approvals
- PO assignment and tracking
- Invoice generation based on approved POs
- Admin dashboard metrics: Customer Count, Active Quotations, Pending RFQs, Monthly Revenue
- Responsive frontend with modern UI/UX

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT
- **Other Tools**: Axios, React Hook Form, dotenv

## 📁 Folder Structure (Brief)

```
├── backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── .env
├── package.json
├── README.md
```

## 📦 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/rfq-system.git
cd rfq-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file in the backend folder:

```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- You can also add environment variables (if needed) in a `.env` file.

## 🏃 Running the App

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm start
```

The app will be running at:  
- Frontend: `http://localhost:3000`  
- Backend: `http://localhost:5000`

## 📌 Usage

- **Client**: Can register/login, submit RFQs, and view status.
- **Admin**: Can manage all RFQs, Quotations, POs, Invoices, and assign tasks to employees.
- **Employee**: Can view assigned POs and submit deliverables.

## 📊 Future Enhancements

- Email notifications
- Payment integration
- File uploads (for deliverables)
- Mobile app version

---

Feel free to fork, star ⭐, and contribute!
