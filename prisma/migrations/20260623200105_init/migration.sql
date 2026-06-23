-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "programs" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" TEXT NOT NULL,
    "isCritical" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "programUsed" TEXT NOT NULL,
    "hasMixIn" BOOLEAN NOT NULL DEFAULT false,
    "mixInInstructions" TEXT
);

-- CreateTable
CREATE TABLE "FreezeTracker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pintaName" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readyAt" DATETIME NOT NULL,
    "isSpun" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "FreezeTracker_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
