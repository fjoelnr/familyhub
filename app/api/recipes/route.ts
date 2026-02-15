import { NextRequest, NextResponse } from 'next/server';
import { Recipe, RecipeCreate, RecipeResponse } from '@/lib/contracts/food/recipe';

// In-memory storage (placeholder - TODO: connect to PostgreSQL)
const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish',
    ingredients: [
      { name: 'Spaghetti', amount: 400, unit: 'g' },
      { name: 'Eggs', amount: 4, unit: 'piece' },
      { name: 'Pancetta', amount: 200, unit: 'g' },
      { name: 'Parmesan', amount: 100, unit: 'g' },
      { name: 'Black Pepper', amount: 1, unit: 'tsp', optional: true }
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Fry pancetta until crispy',
      'Mix eggs with parmesan',
      'Combine hot pasta with egg mixture',
      'Add pancetta and pepper'
    ],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    category: 'dinner',
    tags: ['italian', 'pasta', 'quick'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  // TODO: Fetch from database
  return NextResponse.json(recipes);
}

export async function POST(request: NextRequest) {
  try {
    const body: RecipeCreate = await request.json();
    
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const newRecipe: Recipe = {
      id: Math.random().toString(36).substring(2, 11),
      title: body.title,
      description: body.description,
      ingredients: body.ingredients || [],
      instructions: body.instructions || [],
      prepTime: body.prepTime,
      cookTime: body.cookTime,
      servings: body.servings,
      category: body.category,
      tags: body.tags,
      sourceUrl: body.sourceUrl,
      imageUrl: body.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    recipes.push(newRecipe);
    // TODO: Persist to database
    
    return NextResponse.json(newRecipe, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const index = recipes.findIndex(r => r.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    
    recipes[index] = { 
      ...recipes[index], 
      ...body, 
      updatedAt: new Date().toISOString() 
    };
    // TODO: Update in database
    
    return NextResponse.json(recipes[index]);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
  }
  
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }
  
  recipes.splice(index, 1);
  // TODO: Delete from database
  
  return NextResponse.json({ success: true });
}
