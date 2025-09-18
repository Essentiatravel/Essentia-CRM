
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '../../../../../../server/src/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // For development, return a mock user since we don't have full auth yet
    const mockUser = {
      id: '1',
      email: 'admin@turguide.com',
      firstName: 'Admin',
      lastName: 'TourGuide',
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(existingUser[0]);
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
      })
      .returning();

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
