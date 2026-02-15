import { NextRequest, NextResponse } from 'next/server';
import { ShoppingItem, ShoppingList, ShoppingCreate, ShoppingItemCreate } from '@/lib/contracts/food/shopping';

// In-memory storage (placeholder)
const shoppingLists: ShoppingList[] = [
  {
    id: '1',
    name: 'Weekly Shopping',
    items: [
      { id: '1', name: 'Milk', amount: 2, unit: 'liter', category: 'dairy', checked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: 'Bread', amount: 1, unit: 'piece', category: 'bakery', checked: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: 'Apples', amount: 500, unit: 'g', category: 'produce', checked: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  // TODO: Fetch from database
  return NextResponse.json(shoppingLists);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listId, item } = body;
    
    if (listId && item) {
      // Add item to existing list
      const list = shoppingLists.find(l => l.id === listId);
      if (!list) {
        return NextResponse.json({ error: 'List not found' }, { status: 404 });
      }
      
      const newItem: ShoppingItem = {
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        category: item.category,
        checked: false,
        recipeId: item.recipeId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      list.items.push(newItem);
      list.updatedAt = new Date().toISOString();
      // TODO: Persist
      
      return NextResponse.json(newItem, { status: 201 });
    }
    
    // Create new list
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const newList: ShoppingList = {
      id: Math.random().toString(36).substring(2, 11),
      name: body.name,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    shoppingLists.push(newList);
    // TODO: Persist
    
    return NextResponse.json(newList, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.itemId && body.checked !== undefined) {
      // Toggle item checked status
      for (const list of shoppingLists) {
        const item = list.items.find(i => i.id === body.itemId);
        if (item) {
          item.checked = body.checked;
          item.updatedAt = new Date().toISOString();
          list.updatedAt = new Date().toISOString();
          // TODO: Persist
          return NextResponse.json(item);
        }
      }
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const itemId = searchParams.get('itemId');
  
  if (itemId) {
    // Delete item from list
    for (const list of shoppingLists) {
      const index = list.items.findIndex(i => i.id === itemId);
      if (index !== -1) {
        list.items.splice(index, 1);
        list.updatedAt = new Date().toISOString();
        // TODO: Persist
        return NextResponse.json({ success: true });
      }
    }
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  
  if (id) {
    // Delete entire list
    const index = shoppingLists.findIndex(l => l.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }
    shoppingLists.splice(index, 1);
    // TODO: Persist
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'ID or itemId required' }, { status: 400 });
}
