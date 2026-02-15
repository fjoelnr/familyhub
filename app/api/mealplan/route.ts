import { NextRequest, NextResponse } from 'next/server';
import { MealPlan, MealPlanCreate, Meal, MealType } from '@/lib/contracts/food/mealplan';

// In-memory storage (placeholder)
const mealPlans: MealPlan[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    meals: [
      { id: '1', type: 'breakfast', title: 'Oatmeal with fruits' },
      { id: '2', type: 'lunch', title: 'Salad with chicken' },
      { id: '3', type: 'dinner', recipeName: 'Spaghetti Carbonara', recipeId: '1' }
    ],
    notes: 'Grocery shopping needed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  let filtered = mealPlans;
  
  if (date) {
    filtered = mealPlans.filter(m => m.date === date);
  } else if (startDate && endDate) {
    filtered = mealPlans.filter(m => m.date >= startDate && m.date <= endDate);
  }
  
  // TODO: Fetch from database
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  try {
    const body: MealPlanCreate = await request.json();
    
    if (!body.date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }
    
    // Check if plan for date already exists
    const existing = mealPlans.find(m => m.date === body.date);
    if (existing) {
      return NextResponse.json({ error: 'Plan for this date already exists' }, { status: 409 });
    }
    
    const newPlan: MealPlan = {
      id: Math.random().toString(36).substring(2, 11),
      date: body.date,
      meals: body.meals || [],
      notes: body.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mealPlans.push(newPlan);
    // TODO: Persist
    
    return NextResponse.json(newPlan, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, ...updates } = body;
    
    if (!date && !body.id) {
      return NextResponse.json({ error: 'Date or ID is required' }, { status: 400 });
    }
    
    const plan = mealPlans.find(m => m.id === body.id || m.date === date);
    if (!plan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
    }
    
    if (updates.meals) {
      plan.meals = updates.meals;
    }
    if (updates.notes !== undefined) {
      plan.notes = updates.notes;
    }
    if (updates.date) {
      plan.date = updates.date;
    }
    
    plan.updatedAt = new Date().toISOString();
    // TODO: Update in database
    
    return NextResponse.json(plan);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const date = searchParams.get('date');
  
  if (!id && !date) {
    return NextResponse.json({ error: 'ID or date is required' }, { status: 400 });
  }
  
  const index = mealPlans.findIndex(m => m.id === id || m.date === date);
  if (index === -1) {
    return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 });
  }
  
  mealPlans.splice(index, 1);
  // TODO: Delete from database
  
  return NextResponse.json({ success: true });
}
