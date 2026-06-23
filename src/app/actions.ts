'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface IngredientMeasure {
  name: string;
  quantity: number;
  unit: string;
}

export interface StepInstruction {
  stepNumber: number;
  instruction: string;
  tempMin: number | null;
  tempMax: number | null;
}

// Recupera tutti i dati iniziali necessari alla cucina
export async function getKitchenData() {
  const equipment = await prisma.equipment.findMany();
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
  });
  const recipes = await prisma.recipe.findMany();
  const activeTrackers = await prisma.freezeTracker.findMany({
    include: {
      recipe: true,
    },
    orderBy: {
      readyAt: 'asc',
    },
  });

  // Parsifica i campi JSON di Equipment e Recipe
  const parsedEquipment = equipment.map((eq) => ({
    ...eq,
    programs: JSON.parse(eq.programs as string) as string[],
  }));

  const parsedRecipes = recipes.map((rec) => ({
    ...rec,
    ingredients: JSON.parse(rec.ingredients as string) as IngredientMeasure[],
    steps: JSON.parse(rec.steps as string) as StepInstruction[],
  }));

  const parsedTrackers = activeTrackers.map((tr) => ({
    ...tr,
    recipe: {
      ...tr.recipe,
      ingredients: JSON.parse(tr.recipe.ingredients as string) as IngredientMeasure[],
      steps: JSON.parse(tr.recipe.steps as string) as StepInstruction[],
    },
  }));

  return {
    equipment: parsedEquipment,
    ingredients,
    recipes: parsedRecipes,
    trackers: parsedTrackers,
  };
}

// Aggiorna la quantità di un ingrediente in dispensa
export async function updateIngredientQuantity(id: string, quantity: number) {
  if (quantity < 0) quantity = 0;
  
  await prisma.ingredient.update({
    where: { id },
    data: { quantity },
  });

  revalidatePath('/');
  return { success: true };
}

// Aggiunge una nuova pinta al Freezer Tracker
export async function addPintToFreezer(recipeId: string, pintaName: string) {
  if (!pintaName.trim()) {
    throw new Error('Il nome della pinta non può essere vuoto.');
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
  });

  if (!recipe) {
    throw new Error('Ricetta non trovata.');
  }

  const now = new Date();
  // Il tempo di congelamento standard è esattamente di 24 ore
  const readyAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Se è la Nice Cream, non necessita di 24h di attesa!
  // Ma la Nice Cream è istantanea, creiamo comunque un tracker pronto subito o a breve
  const isIstantanea = recipe.category === 'NiceCream';
  const finalReadyAt = isIstantanea ? now : readyAt;

  const tracker = await prisma.freezeTracker.create({
    data: {
      pintaName: pintaName.trim(),
      recipeId,
      createdAt: now,
      readyAt: finalReadyAt,
      isSpun: false,
    },
  });

  // Sottrai opzionalmente gli ingredienti usati dalla dispensa
  const ingredientsUsed = JSON.parse(recipe.ingredients as string) as IngredientMeasure[];
  for (const item of ingredientsUsed) {
    const pantryItem = await prisma.ingredient.findFirst({
      where: {
        name: {
          contains: item.name.split(' (')[0], // matching flessibile (es. "Impact Whey Protein")
        },
      },
    });

    if (pantryItem) {
      const newQty = Math.max(0, pantryItem.quantity - item.quantity);
      await prisma.ingredient.update({
        where: { id: pantryItem.id },
        data: { quantity: newQty },
      });
    }
  }

  revalidatePath('/');
  return tracker;
}

// Esegue lo spin della pinta (la segna come completata)
export async function spinPint(id: string) {
  await prisma.freezeTracker.update({
    where: { id },
    data: { isSpun: true },
  });

  revalidatePath('/');
  return { success: true };
}

// Elimina una pinta dal tracker
export async function deleteTracker(id: string) {
  await prisma.freezeTracker.delete({
    where: { id },
  });

  revalidatePath('/');
  return { success: true };
}
