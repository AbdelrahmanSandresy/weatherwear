CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
CREATE TABLE "outfits"(
    "id" UUID NOT NULL,
    "outfit_name" VARCHAR(255) NOT NULL,
    "weather_condition" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "worn" BOOLEAN NOT NULL,
    "worn_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "user_id" UUID NOT NULL
);
ALTER TABLE
    "outfits" ADD PRIMARY KEY("id");
ALTER TABLE
    "outfits" ADD CONSTRAINT "outfits_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");