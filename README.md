# BloodLink - Donor-Hospital Connection Platform

A modern web application that connects blood donors with hospitals in need, facilitating the lifesaving process of blood donation.

## Features

- **User Authentication:** Secure sign-up and login functionality
- **Role-based Access:** Different interfaces for donors and hospitals
- **Donor Dashboard:** Track your donation history and see impact metrics
- **Hospital Dashboard:** View available donors and manage blood requests
- **Real-time Updates:** Instant notifications for new donations and urgent requests
- **Mobile Responsive:** Works seamlessly on all device sizes

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Shadcn UI
- **Backend:** Supabase (Auth, Database, Storage, Real-time subscriptions)
- **State Management:** React Query, Context API
- **Styling:** TailwindCSS with custom theme
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd donor-hospital-linkup
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase tables:
   - Run the SQL commands from `database-setup.sql` in your Supabase SQL Editor
   - This will create the necessary tables and security policies

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Database Schema

The application uses two main tables:

### blood_donations
- `id`: UUID (Primary Key)
- `email`: TEXT (User's email)
- `name`: TEXT (Donor's name)
- `blood_group`: TEXT (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `age`: INTEGER (Donor's age)
- `phone_number`: TEXT (Donor's contact number)
- `created_at`: TIMESTAMP (When the donation was registered)

### blood_requests
- `id`: UUID (Primary Key)
- `email`: TEXT (Hospital's email)
- `name`: TEXT (Hospital's name)
- `address`: TEXT (Hospital's address)
- `blood_group`: TEXT (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `quantity`: INTEGER (Units of blood needed)
- `urgency`: TEXT (High, Medium, Low)
- `created_at`: TIMESTAMP (When the request was created)

## User Flow

1. **Authentication:**
   - Users sign up with email and password
   - Login directs to the appropriate dashboard

2. **Donor Experience:**
   - View dashboard with donation statistics
   - Submit blood donation information
   - See urgent blood requests from hospitals

3. **Hospital Experience:**
   - View dashboard with available donors
   - Create blood requests with urgency levels
   - Contact donors directly via email or phone

## Security

- Row Level Security (RLS) policies ensure users can only access and modify their own data
- All pages requiring authentication are protected with route guards
- Data validation is performed on both client and server sides

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Supabase](https://supabase.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
