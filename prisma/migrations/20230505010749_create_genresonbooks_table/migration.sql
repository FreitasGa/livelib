-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "genres_on_book" (
    "bookId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    PRIMARY KEY ("bookId", "genreId"),
    CONSTRAINT "genres_on_book_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "genres_on_book_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
