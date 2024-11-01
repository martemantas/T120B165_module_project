# T120B165_module_project
Book club and reading tracker

Sprendžiamo uždavinio aprašymas

### Sistemos paskirtis

    Ši sistema skirta padėti knygų skaitytojams sekti bendrą knygų skaitymo progresą bei skatinti skaitymo bendruomenės narių interakciją dalinantis savo nuomone.
    Vartotojai šioje sistemoje galės:
    1. Palikti atsiliepimus ir įvertinimus apie knygas, pasirinktas iš išsamaus knygų sąrašo.
    2. Registruoti skaitomas knygas ir stebėti savo skaitymo progresą.
    3. Ieškoti norimos knygos pagal kategorijas.
    4. Peržiūrėti asmeninę skaitymo statistiką.
    
### Funkciniai reikalavimai
    1. Vartotojo registracija ir autentifikacija - 2laboratorinis darbas autentifikacija ir autorizacija naudojant JSON Web Tokens (JWT)
    2. Knygos kūrimas ir valdymas - taikomosios srities objekto pridėjimas ir ištrynimas (su admin role)
    3. Skaitymo progreso sekimas - knygas galima pridėti prie "skaitytų knygų" sąrašo, matoma bendra skaitymo statistika ir vartotojo progresas
    4. Įvertinimo ir komentaro palikimas - galimybė pateikti ir ištrinti komentarą bei įvertinimą apie atitinkamą knygą

### Pasirinktų technologijų aprašymas
Frontend:

    UI bus kuriamas naudojantis React biblioteka. React renkuosi dėl turimos patirties.

Backend:

    Darbui su serveriu renkuosi Node.js naudojant Express karkasą. Šis pasirinkimas puikiai tinka realaus laiko atnaujinimams ir RESTful APi kūrimui. Sprendimas gali būti keičiamas

Duomenų bazė:

    Duomenų bazė bus kuriama naudojantis MongoDB, projekte duomenys nebus griežtai struktūruoti, naudojant MongoDB lengvai galėsiu tvarkyti lentelių informaciją. Taip pat šis variantas siūlo gerą integraciją su Node.js per Mongoose ORM.
