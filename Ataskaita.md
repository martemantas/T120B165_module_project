# Knygų Skaitymo Stebėjimo Sistema

## 1. Sprendžiamo Užduoties Aprašymas

### Sistemos Paskirtis
Ši sistema skirta knygų skaitytojams, siekiantiems stebėti savo skaitymo progresą ir aktyviai dalyvauti skaitymo bendruomenėje. Naudojant sistemą galima:

1. **Dalintis nuomone apie knygas** – Vartotojai gali palikti komentarus ir įvertinimus apie knygą pasirinktą iš knygų sąrašo.
2. **Registruoti skaitomas knygas** – Naudotojai gali pridėti knygas į savo skaitymo sąrašą ir stebėti pažangą.
3. **Nustatyti skaitymo tikslus** – Galimybė užsibrėžti asmeninius skaitymo tikslus.
4. **Peržiūrėti skaitymo statistiką** – Kiekvienas vartotojas gali peržiūrėti savo skaitymo pasiekimus.

### Funkciniai Reikalavimai
1. **Vartotojo registracija ir autentifikacija** – Naudojant OAuth2 technologiją, sistema užtikrina saugią vartotojų autentifikaciją.
2. **Knygos kūrimas ir valdymas** – Tik administratoriaus rolės vartotojai gali pridėti ir trinti knygas sistemoje.
3. **Skaitymo progreso sekimas** – Vartotojai gali knygas pridėti prie "skaitytų knygų" sąrašo, kur matoma bendra skaitymo statistika ir vartotojo progresas.
4. **Įvertinimo ir komentaro palikimas** – Galimybė vartotojams palikti ir ištrinti savo atsiliepimus.
5. **Skaitymo tikslų nustatymas** – Vartotojai gali nustatyti savo skaitymo tikslus ir stebėti jų įgyvendinimą.

## 2. Sistemos Architektūra
Sistemos architektūra paremta mikroservisų principais ir REST API naudojimu. Sistemos duomenys saugomi `MongoDB` duomenų bazėje. API aprašymas pateiktas `api-spec.yaml` faile pagal OpenAPI standartą.

## 3. Naudotojo Sąsajos Projektas

1. **Home puslapis** – Pagrindinis puslapis su animacija ir paieškos lauku. Paieškos skiltyje galima ieškoti knygų pagal pavadinimą, yra siūlomi variantai tų knygų kurių sutampa pavadinimo pradžia. Taip pat galima rinktis tik tas knygas kurios priklauso specifinei kategorijai.

   ![image](https://github.com/user-attachments/assets/123ebadf-dd36-4488-8840-ceb4a9d34e77)
   ![image](https://github.com/user-attachments/assets/754b5091-621e-43c6-bb1f-891d9fc6d534)
2. **Discover puslapis** – Vartotojai gali peržiūrėti visas knygas nepriklausomai nuo kategorijos.
   
   ![image](https://github.com/user-attachments/assets/fedeec67-c48a-4381-9312-b5f6c30ac50e)
3. **Category puslapis** – Leidžia peržiūrėti kategorijas, kurias galima peržiūrėti mygtukų pagalba paslenkant jas į kairę arba dešinę puses.
   
   ![image](https://github.com/user-attachments/assets/c811069c-0299-4aaa-a6ca-4b7688cc29e6)

   Pasirinkus norimą kategoriją atsidaro naujas puslapis su visomis tos kategorijos knygomis.

   ![image](https://github.com/user-attachments/assets/c43e1baa-d5f8-4883-8fe7-70e9845e8c5b)
4. **Book puslapis** – Rodo knygos informaciją ir leidžia matyti ir pridėti atsiliepimus.

   ![image](https://github.com/user-attachments/assets/aad87819-6055-4188-b37a-464121aa6185)
   ![image](https://github.com/user-attachments/assets/0fd04996-41d5-4fa3-8ebb-20551e2b4752)
5. **Registracijos puslapis** – Bandant įvykdyti funkciją kuriai reikia autentifikacijos (pvz. komentaro palikimas) vartotojo yra prašoma prisijungti.

   Neprisijungusiam vartotojui (svečiui) pasirinkus „My Library“ mygtuką yra išmetamas pranešimas prašantis prisijungti.

   ![image](https://github.com/user-attachments/assets/d1bcaa79-931e-4ee6-96fe-63cf89a17bdb)

   Paspaudus „OK“ yra įvykdoma navigaciją į puslapį ‚Login‘.

   ![image](https://github.com/user-attachments/assets/042cf84e-8e89-4a46-b97c-e5d95c10d7f6)

   Taip pat šiame puslapyje paspaudus ‚register‘ atsidaro registracijos forma.

   ![image](https://github.com/user-attachments/assets/0a7ab917-8e27-43c1-b1e5-3e01330a3529)
6. **My Library puslapis** – Prisijungusiems vartotojams rodomas mėgstamų knygų sąrašas ir skaitymo tikslai.

   ![image](https://github.com/user-attachments/assets/c84d421b-4936-42af-b201-5dc0ce1f123e)

## 4. API Specifikacija

API metodai pateikti su galimais atsako kodais ir panaudojimo pavyzdžiais.

### Galimi Atsako Kodai

- **200 OK** – Užklausa sėkminga.
- **201 Created** – Sukurta sėkmingai.
- **400 Bad Request** – Neteisingas užklausos formatas.
- **401 Unauthorized** – Neteisingi prisijungimo duomenys.
- **403 Forbidden** – Prieiga uždrausta (jei vartotojas neturi administratoriaus teisių).
- **404 Not Found** – Resursas nerastas.
- **422 Bad Request** – Neteisingi duomenys.
- **500 Internal Server Error** – Serverio klaida.

---

### 4.1 Autentifikacija
#### 4.1.1 Vartotojo Registracija

**POST** `{{URL}}/api/register`

**Request Body:**
```json
{
   "userName": "Full Name",
   "email": "name.surname@gmail.com",
   "password": "test",
   "role": ""
}
```
**Response:**
```json
{
    "message": "User registered successfully"
}
```

#### 4.1.2 Vartotojo Prisijungimas

**POST** `{{URL}}/api/login`

**Request Body:**
```json
{
   "email": "admin.admin@gmail.com",
    "password": "test"
}
```
**Response:**
```json
{
    "message": "Login successful",
    "user": {
        "_id": "671fddafab8c166ccc9409e4",
        "userName": "admin",
        "email": "admin.admin@gmail.com",
        "password": "$2b$10$ERDDPO7xuUMtO4TE0PsQUeWjsAFku4mM0HV4JNUf2WWrztFskj2/q",
        "role": "admin",
        "expTokenTime": "2024-11-02T15:21:42.926Z",
        "expRefreshTokenTime": "2024-11-03T14:21:42.926Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiaWQiOiI2NzFmZGRhZmFiOGMxNjZjY2M5NDA5ZTQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzA1NTczMDIsImV4cCI6MTczMDU2MDkwMn0.d1cF3A-VDYvQVcRE0VbO5cBew9a4MV5Hz-Lzz6EyxC8"
}
```

#### 4.1.3 Token Atnaujinimas

**POST** `{{URL}}/api/register`

**Response:**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWZkZGFmYWI4YzE2NmNjYzk0MDllNCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMDU1NzMyNiwiZXhwIjoxNzMwNTYwOTI2fQ.JilyMJKBpPhQTHCRpvJCWMn-xmfpi05o1Q5bNBsoBa8"
}
```

#### 4.1.4 Vartotojo Atsijungimas

**POST** `{{URL}}/api/register`

**Response:**
```json
{
    "message": "Logged out successfully"
}
```


#### 4.2.1 Naujos kategorijos sukūrimas

**POST** `{{URL}}/categories`

**Request Body:**
```json
{
    "topic": "Test",
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
```
**Response:**
```json
{
    "message": "Logged out successfully"
}
```

#### 4.2.2 Visų kategorijų gavimas

**GET** `{{URL}}/categories`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Successfully retrieved all categories",
    "data": [
        {
            "_id": "6725236f3494851c93cbff48",
            "topic": "Classic",
            "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/..."
            "__v": 0
        }
    ]
}
```

#### 4.2.3 Kategorijos gavimas pagal kategorijos ID

**GET** `{{URL}}/categories/{{categoryId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "successfully retrieved category by ID",
    "data": {
        "_id": "6725236f3494851c93cbff48",
        "topic": "Classic",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/..."
        "__v": 0
    }
}
```

#### 4.2.4 Kategorijos visų duomenų atnaujinimas

**PUT** `{{URL}}/categories/{{categoryId}}`

**Request Body:**
```json
{
    "topic": "Dystopian",
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "67263e0a60b751952335becc",
        "topic": "Dystopian",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
        "__v": 0
    }
}
```

#### 4.2.5 Kategorijos duomenų atnaujinimas
**PATCH** `{{URL}}/categories`

**Request Body:**
```json
{
    "topic": "Dystopian"
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "67263e0a60b751952335becc",
        "topic": "Not Dystopian",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
        "__v": 0
    }
}
```

#### 4.2.6 Kategorijos ištrinimas

**DELETE** `{{URL}}/categories/{{categoryId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully deleted",
    "data": {
        "_id": "67263e0a60b751952335becc",
        "topic": "Not Dystopian",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
        "__v": 0
    }
}
```


#### 4.3.1 Naujos knygos sukūrimas

**POST** `{{URL}}/categories/{{categoryId}}/books`

**Request Body:**
```json
{
    "title": "Test",
    "author": "Aldous Huxley",
    "description": "Long description here",
    "publishedYear": 1932,
    "totalReview": null,
    "category": [
        "{{categoryId}}"
    ],
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Book added successfully under category: Test",
    "data": {
        "title": "Test",
        "author": "Aldous Huxley",
        "description": "Long description here",
        "publishedYear": "1932",
        "category": "67263f2e60b751952335bed6",
        "totalReview": null,
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
        "_id": "67263f3060b751952335bed9",
        "__v": 0
    }
}
```

#### 4.3.2 Visų kategorijos knygų gavimas

**GET** `{{URL}}/categories/{{categoryId}}/books`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Successfully retrieved books for the category",
    "data": [
        {
            "_id": "67263f3060b751952335bed9",
            "title": "Test",
            "author": "Aldous Huxley",
            "description": "Long description here",
            "publishedYear": "1932",
            "category": "67263f2e60b751952335bed6",
            "totalReview": null,
            "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
            "__v": 0
        }
    ]
}
```

#### 4.3.3 Knygos gavimas pagal kategorijos ir knygos ID

**GET** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Successfully retrieved the book",
    "data": {
        "_id": "67263f3060b751952335bed9",
        "title": "Test",
        "author": "Aldous Huxley",
        "description": "Long description here",
        "publishedYear": "1932",
        "category": "67263f2e60b751952335bed6",
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
        "totalReview": null,
        "__v": 0
    }
}
```


#### 4.3.4 Knygos visų duomenų atnaujinimas

**PUT** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}`

**Request Body:**
```json
{
    "title": "War & Peace",
    "author": "Like I Would Remember", 
    "publishedYear": "2000", 
    "category": [
        "{{categoryId}}"
    ]
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "67263f3060b751952335bed9",
        "title": "War & Peace",
        "author": "Like I Would Remember",
        "description": "Long description here",
        "publishedYear": "2000",
        "category": "67263f2e60b751952335bed6",
        "totalReview": null,
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
        "__v": 0
    }
}
```

#### 4.3.5 Knygos duomenų atnaujinimas
**PATCH** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}`

**Request Body:**
```json
{
    "publishedYear": "Approx. 8th century BC"
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "67263f3060b751952335bed9",
        "title": "War & Peace",
        "author": "Like I Would Remember",
        "description": "Long description here",
        "publishedYear": "Approx. 8th century BC",
        "category": "67263f2e60b751952335bed6",
        "totalReview": null,
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
        "__v": 0
    }
}
```

#### 4.3.6 Knygos ištrinimas

**DELETE** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully deleted",
    "data": {
        "_id": "67263f3060b751952335bed9",
        "title": "War & Peace",
        "author": "Like I Would Remember",
        "description": "Long description here",
        "publishedYear": "Approx. 8th century BC",
        "category": "67263f2e60b751952335bed6",
        "totalReview": null,
        "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...",
        "__v": 0
    }
}
```


#### 4.4.1 Naujo komentaro sukūrimas

**POST** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews`

**Request Body:**
```json
{ 
    "reviewerName": "{{userName}}",
    "reviewText": "A phenomenal read with strong characters and an unforgettable storyline. Highly recommended!",
    "rating": 4,
    "book": "{{bookId}}",
    "createdAt": "2023-08-27"
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "new Review posted successfully",
    "data": {
        "reviewerName": "admin",
        "reviewText": "A phenomenal read with strong characters and an unforgettable storyline. Highly recommended!",
        "rating": 4,
        "book": "6726408560b751952335bee4",
        "createdAt": "2023-08-27T00:00:00.000Z",
        "_id": "6726408860b751952335bee7",
        "__v": 0
    }
}
```

#### 4.4.2 Visų knygos komentarų gavimas

**GET** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Successfully retrieved reviews for the book",
    "data": [
        {
            "_id": "6726408860b751952335bee7",
            "reviewerName": "admin",
            "reviewText": "A phenomenal read with strong characters and an unforgettable storyline. Highly recommended!",
            "rating": 4,
            "book": "6726408560b751952335bee4",
            "createdAt": "2023-08-27T00:00:00.000Z",
            "__v": 0
        }
    ]
}
```

#### 4.4.3 Komentaro gavimas pagal kategorijos, knygos ir komentaro ID

**GET** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews/{{reviewId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Successfully retrieved reviews for the book",
    "data": [
        {
            "_id": "6726408860b751952335bee7",
            "reviewerName": "admin",
            "reviewText": "A phenomenal read with strong characters and an unforgettable storyline. Highly recommended!",
            "rating": 4,
            "book": "6726408560b751952335bee4",
            "createdAt": "2023-08-27T00:00:00.000Z",
            "__v": 0
        }
    ]
}
```


#### 4.4.4 Knygos visų duomenų atnaujinimas

**PUT** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews/{{reviewId}}`

**Request Body:**
```json
{ 
    "reviewerName": "Lady Morgana",
    "reviewText": "Hated! Would not recommended!",
    "rating": 1,
    "book": "{{bookId}}",
    "createdAt": "2023-08-27"
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "6726408860b751952335bee7",
        "reviewerName": "Lady Morgana",
        "reviewText": "Hated! Would not recommended!",
        "rating": 1,
        "book": "6726408560b751952335bee4",
        "createdAt": "2023-08-27T00:00:00.000Z",
        "__v": 0
    }
}
```

#### 4.4.5 Knygos duomenų atnaujinimas
**PATCH** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews/{{reviewId}}`

**Request Body:**
```json
{
    "rating": 4
}
```
**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully updated",
    "data": {
        "_id": "6726408860b751952335bee7",
        "reviewerName": "Lady Morgana",
        "reviewText": "Hated! Would not recommended!",
        "rating": 4,
        "book": "6726408560b751952335bee4",
        "createdAt": "2023-08-27T00:00:00.000Z",
        "__v": 0
    }
}
```

#### 4.4.6 Knygos ištrinimas

**DELETE** `{{URL}}/categories/{{categoryId}}/books/{{bookId}}/reviews/{{reviewId}}`

**Response:**
```json
{
    "status": "SUCCESS",
    "message": "Record was successfully deleted",
    "data": {
        "_id": "6726408860b751952335bee7",
        "reviewerName": "Lady Morgana",
        "reviewText": "Hated! Would not recommended!",
        "rating": 4,
        "book": "6726408560b751952335bee4",
        "createdAt": "2023-08-27T00:00:00.000Z",
        "__v": 0
    }
}
```

## 5. Išvados

Projekto sistema sėkmingai sujungia vartotojo interaktyvumą, saugią prieigą ir įvairias funkcijas, leidžiančias efektyviai valdyti skaitymo įpročius ir dalintis nuomone apie knygas. 

Projektas pasiekė šiuos tikslus:

- **Skaitymo progreso stebėjimas ir motyvacija**: Sistema leidžia vartotojams stebėti savo skaitymo progresą ir pasiekimus, taip skatinant užsibrėžti ir pasiekti asmeninius skaitymo tikslus. Tai naudinga priemonė tiek kasdieniams skaitytojams, tiek tiems, kurie nori lavinti savo skaitymo įpročius.

- **Bendruomenės interaktyvumas**: Galimybė palikti atsiliepimus ir įvertinimus suteikia galimybę vartotojams dalintis savo nuomone apie knygas, taip skatindama bendruomenės narių bendravimą ir diskusijas. Vartotojai gali lengviau atrasti naujas knygas ir diskutuoti apie perskaitytą turinį.

- **Funkcionalumo plėtra**: Projektas siūlo ne tik bazines skaitymo stebėjimo funkcijas, bet ir papildomas galimybes, tokias kaip knygų kategorijų valdymas bei asmeninės statistikos peržiūra. Tai padidina sistemos vertę ir suteikia vartotojams daugiau kontrolės.

- **Saugumas ir patikimumas**: Integravus `OAuth2` autentifikacijos protokolą, sistema užtikrina saugų prisijungimą ir asmens duomenų apsaugą. Tai ypač svarbu, nes asmeninė vartotojų informacija, tokia kaip skaitymo įpročiai ir pomėgiai, yra jautri ir turi būti saugoma.

- **Paprasta ir intuityvi vartotojo sąsaja**: Sistemos dizainas leidžia lengvai naršyti ir greitai rasti reikiamą informaciją. Paieškos funkcionalumas, kategorijų naršymas ir lengva prieiga prie skaitytojo bibliotekos suteikia vartotojams intuityvią ir malonią patirtį.

Bendrai, ši sistema yra naudingas įrankis tiek pavieniams skaitytojams, tiek plačiai skaitymo bendruomenei. Ateityje šią platformą galima plėsti papildant ją naujais funkcionalumais, pvz., skaitymo rekomendacijų sistema, socialinių tinklų integracija ar pažangesniais skaitymo progreso analizės įrankiais, taip pat tobulinant saugumo sprendimus.

