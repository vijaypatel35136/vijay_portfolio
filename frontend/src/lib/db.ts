import { neon } from '@neondatabase/serverless';

const sql = neon(import.meta.env.VITE_DATABASE_URL);

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export async function saveContactMessage(data: Omit<ContactMessage, 'id' | 'created_at'>) {
  try {
    const result = await sql`
      INSERT INTO contact_messages (name, email, message)
      VALUES (${data.name}, ${data.email}, ${data.message})
      RETURNING id, created_at
    `;
    return result[0];
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw error;
  }
}

export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
