export default {
    nav: {
        home: 'Strona główna',
        inventory: 'Samochody',
        about: 'O nas',
        contact: 'Kontakt',
        signIn: 'Zaloguj się',
        browseCars: 'Przeglądaj samochody',
        admin: 'Panel admina',
        logout: 'Wyloguj się',
        myAccount: 'Moje konto',
        profile: 'Mój profil',
        language: 'Język',
        theme: 'Motyw'
    },
    home: {
        hero: {
            badge: 'Zaufany partner motoryzacyjny',
            title: 'Znajdź swoje wymarzone auto',
            subtitle: 'Odkryj premium pojazdy z transparentnymi cenami i wyjątkową obsługą.',
            cta: 'Przeglądaj samochody',
            ctaSecondary: 'Skontaktuj się',
            searchMake: 'Dowolna marka',
            searchYear: 'Dowolny rok',
            searchBtn: 'Szukaj aut',
            stats: {
                cars: 'Samochodów w ofercie',
                brands: 'Marek',
                customers: 'Zadowolonych klientów',
                years: 'Lat doświadczenia',
                verified: 'Sprawdzonych pojazdów'
            }
        },
        featured: {
            tag: 'Nasza flota',
            label: 'Polecane',
            title: 'Polecane pojazdy',
            subtitle: 'Wybrane przez nasz zespół ekspertów — najlepsze oferty w najlepszych cenach.',
            viewAll: 'Zobacz wszystkie pojazdy',
            viewDetails: 'Zobacz szczegóły',
            badgeFeatured: 'Polecane',
            badgeNew: 'Nowa oferta',
            badgeDeal: 'Najlepsza cena'
        },
        why: {
            tag: 'Nasza obietnica',
            label: 'Dlaczego my',
            title: 'Dlaczego AM Automobile?',
            subtitle: 'Oferujemy nie tylko samochody, ale kompleksową obsługę zakupu pojazdu.',
            items: [
                { title: 'Zweryfikowana jakość', desc: 'Każdy samochód przechodzi 150-punktową kontrolę przez certyfikowanych mechaników przed wystawieniem.' },
                { title: 'Najlepsze ceny', desc: 'Transparentne ceny bez ukrytych opłat. Gwarantujemy najlepsze stawki rynkowe.' },
                { title: 'Gwarancja w cenie', desc: 'Wszystkie pojazdy mają minimum 12 miesięcy gwarancji dla Twojego spokoju.' },
                { title: 'Wsparcie ekspertów', desc: 'Nasz zespół ekspertów motoryzacyjnych poprowadzi Cię przez każdy etap zakupu.' }
            ]
        },
        how: {
            tag: 'Prosty proces',
            title: 'Jak to działa',
            steps: [
                { title: 'Przeglądaj', desc: 'Przeszukaj nasz rozległy inwentarz z zaawansowanymi filtrami, aby znaleźć idealne auto.' },
                { title: 'Wybierz', desc: 'Znajdź swój wymarzony pojazd i umów bezpłatną jazdę próbną w dogodnym terminie.' },
                { title: 'Jedź', desc: 'Dopełnij formalności, skorzystaj z finansowania jeśli potrzeba i wróć swoim nowym autem.' }
            ]
        },
        testimonials: {
            tag: 'Opinie',
            title: 'Co mówią nasi klienci',
            items: [
                { text: 'Niesamowita obsługa! Znalazłem wymarzone BMW w tydzień. Zespół był niesamowicie profesjonalny i sprawił, że cały proces przebiegał bezproblemowo.' },
                { text: 'Bardzo profesjonalny zespół. Pomogli mi znaleźć idealne Audi A4 w moim budżecie. Polecam każdemu szukającemu dobrego auta!' },
                { text: 'Najlepsze doświadczenie zakupu auta, jakie miałem. Brak presji, transparentne ceny i obsługa wszystkich formalności. Znakomicie!' }
            ]
        },
        cta: {
            title: 'Gotowy znaleźć wymarzone auto?',
            subtitle: 'Przeglądaj naszą ofertę ponad 500 zweryfikowanych pojazdów.',
            browse: 'Przeglądaj ofertę',
            contact: 'Skontaktuj się',
            primary: 'Przeglądaj samochody',
            secondary: 'Zadzwoń do nas'
        }
    },
    inventory: {
        title: 'Nasza oferta',
        subtitle: 'Przeglądaj nasz szeroki wybór pojazdów',
        searchPlaceholder: 'Szukaj marki, modelu...',
        filters: {
            title: 'Filtry',
            make: 'Marka',
            model: 'Model',
            yearFrom: 'Rok od',
            yearTo: 'Rok do',
            priceFrom: 'Cena od (PLN)',
            priceTo: 'Cena do (PLN)',
            fuelType: 'Rodzaj paliwa',
            transmission: 'Skrzynia biegów',
            bodyType: 'Typ nadwozia',
            apply: 'Zastosuj filtry',
            reset: 'Wyczyść',
            activeFilters: 'Aktywne filtry'
        },
        sort: {
            label: 'Sortuj',
            newest: 'Najnowsze',
            oldest: 'Najstarsze',
            priceAsc: 'Cena: rosnąco',
            priceDesc: 'Cena: malejąco',
            yearDesc: 'Rok: malejąco',
            yearAsc: 'Rok: rosnąco'
        },
        results: '{count} wyników',
        noResults: 'Brak wyników',
        noResultsDesc: 'Spróbuj zmienić kryteria wyszukiwania.',
        loading: 'Ładowanie samochodów...'
    },
    car: {
        viewDetails: 'Szczegóły',
        contactAbout: 'Zapytaj o ten samochód',
        addToFavorites: 'Dodaj do ulubionych',
        removeFromFavorites: 'Usuń z ulubionych',
        make: 'Marka',
        model: 'Model',
        year: 'Rok',
        price: 'Cena',
        mileage: 'Przebieg',
        fuelType: 'Paliwo',
        transmission: 'Skrzynia',
        bodyType: 'Nadwozie',
        color: 'Kolor',
        doors: 'Drzwi',
        seats: 'Miejsca',
        engine: 'Silnik',
        engineSize: 'Pojemność silnika',
        power: 'Moc',
        features: 'Wyposażenie',
        description: 'Opis',
        statusLabel: 'Status',
        status: {
            available: 'Dostępny',
            sold: 'Sprzedany',
            reserved: 'Zarezerwowany',
            archived: 'Zarchiwizowany',
            featured: 'Polecany'
        },
        fuel: {
            petrol: 'Benzyna',
            diesel: 'Diesel',
            electric: 'Elektryczny',
            hybrid: 'Hybryda',
            lpg: 'LPG'
        },
        trans: {
            manual: 'Manualna',
            automatic: 'Automatyczna',
            semiAuto: 'Sekwencyjna'
        },
        body: {
            sedan: 'Sedan',
            suv: 'SUV',
            hatchback: 'Hatchback',
            combi: 'Kombi',
            coupe: 'Coupe',
            cabrio: 'Cabrio',
            van: 'Van',
            pickup: 'Pickup'
        }
    },
    about: {
        title: 'O nas',
        subtitle: 'Poznaj AM Automobile',
        story: {
            label: 'Nasza historia',
            title: 'Pasja do samochodów od lat',
            text1: 'AM Automobile to rodzinny salon samochodowy z wieloletnim doświadczeniem na rynku motoryzacyjnym. Nasza misja to pomoc klientom w znalezieniu idealnego pojazdu w najlepszej cenie.',
            text2: 'Oferujemy szeroki wybór samochodów używanych i nowych, finansowanie, ubezpieczenia oraz serwis posprzedażowy. Stawiamy na transparentność i uczciwość w każdej transakcji.'
        },
        team: {
            label: 'Nasz zespół',
            title: 'Poznaj naszych ekspertów'
        },
        values: {
            label: 'Nasze wartości',
            title: 'Co nas wyróżnia'
        }
    },
    contact: {
        title: 'Kontakt',
        subtitle: 'Jesteśmy tu dla Ciebie',
        form: {
            title: 'Wyślij wiadomość',
            name: 'Imię i nazwisko',
            email: 'Adres email',
            phone: 'Numer telefonu',
            subject: 'Temat',
            message: 'Wiadomość',
            send: 'Wyślij wiadomość',
            sending: 'Wysyłanie...',
            success: 'Wiadomość wysłana! Skontaktujemy się wkrótce.',
            error: 'Błąd wysyłania. Spróbuj ponownie.'
        },
        info: {
            address: 'Adres',
            phone: 'Telefon',
            email: 'Email',
            hours: 'Godziny otwarcia',
            hoursVal: 'Pon–Pt 9:00–18:00, Sob 10:00–15:00'
        },
        map: {
            title: 'Nasza lokalizacja',
            directions: 'Jak dojechać'
        }
    },
    auth: {
        login: {
            title: 'Zaloguj się',
            subtitle: 'Witaj ponownie w AM Automobile',
            email: 'Adres email',
            password: 'Hasło',
            remember: 'Zapamiętaj mnie',
            forgotPass: 'Zapomniałeś hasła?',
            submit: 'Zaloguj się',
            submitting: 'Logowanie...',
            noAccount: 'Nie masz konta?',
            register: 'Zarejestruj się',
            error: 'Nieprawidłowy email lub hasło'
        },
        register: {
            title: 'Utwórz konto',
            subtitle: 'Dołącz do AM Automobile',
            name: 'Imię i nazwisko',
            email: 'Adres email',
            password: 'Hasło',
            confirmPass: 'Potwierdź hasło',
            submit: 'Utwórz konto',
            submitting: 'Rejestracja...',
            hasAccount: 'Masz już konto?',
            login: 'Zaloguj się',
            termsText: 'Rejestrując się akceptujesz nasz',
            terms: 'Regulamin',
            and: 'i',
            privacy: 'Politykę prywatności'
        },
        validation: {
            required: 'To pole jest wymagane',
            emailInvalid: 'Podaj prawidłowy adres email',
            passMin: 'Hasło musi mieć minimum 8 znaków',
            passMatch: 'Hasła nie są zgodne'
        }
    },
    admin: {
        title: 'Panel admina',
        dashboard: {
            title: 'Pulpit',
            totalCars: 'Łączna liczba samochodów',
            available: 'Dostępne',
            sold: 'Sprzedane',
            users: 'Użytkownicy',
            messages: 'Wiadomości',
            recentCars: 'Ostatnio dodane'
        },
        cars: {
            title: 'Zarządzanie samochodami',
            add: 'Dodaj samochód',
            addCar: 'Dodaj nowy samochód',
            editCar: 'Edytuj samochód',
            edit: 'Edytuj',
            delete: 'Usuń',
            deleteConfirm: 'Czy na pewno chcesz usunąć ten samochód?'
        },
        messages: {
            title: 'Wiadomości',
            from: 'Od',
            subject: 'Temat',
            date: 'Data',
            status: 'Status',
            markRead: 'Oznacz jako przeczytane',
            reply: 'Odpowiedz',
            statuses: {
                new: 'Nowa',
                read: 'Przeczytana',
                replied: 'Odpowiedziano'
            }
        },
        users: {
            title: 'Użytkownicy',
            name: 'Nazwa',
            email: 'Email',
            role: 'Rola',
            status: 'Status',
            active: 'Aktywny',
            inactive: 'Nieaktywny',
            toggle: 'Przełącz status'
        }
    },
    footer: {
        tagline: 'Twój zaufany partner motoryzacyjny od 2014 roku.',
        company: 'Firma',
        inventory: 'Oferta',
        support: 'Wsparcie',
        legal: 'Prawne',
        newsletter: {
            title: 'Bądź na bieżąco',
            subtitle: 'Otrzymuj powiadomienia o nowych ofertach i promocjach.',
            placeholder: 'Twój adres email',
            subscribe: 'Zapisz się'
        },
        links: {
            about: 'O nas',
            team: 'Nasz zespół',
            careers: 'Kariera',
            blog: 'Blog',
            allCars: 'Wszystkie samochody',
            byMake: 'Według marki',
            byType: 'Według typu',
            featured: 'Polecane',
            contact: 'Kontakt',
            faq: 'FAQ',
            financing: 'Finansowanie',
            testDrive: 'Jazda testowa',
            tos: 'Regulamin',
            privacy: 'Polityka prywatności',
            cookies: 'Pliki cookies'
        },
        copyright: '© {year} AM Automobile. Wszelkie prawa zastrzeżone.'
    },
    legal: {
        tos: {
            title: 'Regulamin',
            subtitle: 'Warunki korzystania z serwisu AM Automobile'
        },
        privacy: {
            title: 'Polityka prywatności',
            subtitle: 'Jak chronimy Twoje dane osobowe'
        },
        cookies: {
            title: 'Polityka plików cookies',
            subtitle: 'Informacje o plikach cookies używanych na naszej stronie'
        }
    },
    common: {
        noData: 'Brak danych',
        loading: 'Ładowanie...',
        error: 'Wystąpił błąd',
        retry: 'Spróbuj ponownie',
        save: 'Zapisz',
        cancel: 'Anuluj',
        close: 'Zamknij',
        confirm: 'Potwierdź',
        delete: 'Usuń',
        edit: 'Edytuj',
        add: 'Dodaj',
        search: 'Szukaj',
        filter: 'Filtruj',
        reset: 'Wyczyść',
        viewAll: 'Zobacz wszystkie',
        back: 'Wróć',
        next: 'Dalej',
        previous: 'Wróć',
        page: 'Strona',
        of: 'z',
        yes: 'Tak',
        no: 'Nie',
        km: 'km',
        pln: 'PLN',
        hp: 'KM',
        cc: 'cm³',
        saving: 'Zapisywanie...'
    },
    theme: {
        light: 'Jasny',
        dark: 'Ciemny',
        system: 'Systemowy'
    },
    profile: {
        nav: 'Nawigacja profilu',
        editProfile: 'Edytuj Profil',
        editProfileSub: 'Zaktualizuj swoje imię i adres email',
        security: 'Bezpieczeństwo',
        securitySub: 'Zmień hasło, aby zabezpieczyć swoje konto',
        dangerZone: 'Sesja',
        dangerZoneSub: 'Wyloguj się ze swojego konta',
        fullName: 'Imię i Nazwisko',
        fullNamePlaceholder: 'Twoje imię i nazwisko',
        email: 'Adres Email',
        emailPlaceholder: "twoj{'@'}email.com",
        saveChanges: 'Zapisz zmiany',
        currentPassword: 'Aktualne Hasło',
        currentPasswordPlaceholder: 'Wpisz aktualne hasło',
        newPassword: 'Nowe Hasło',
        newPasswordPlaceholder: 'Wpisz nowe hasło',
        confirmPassword: 'Potwierdź Nowe Hasło',
        confirmPasswordPlaceholder: 'Powtórz nowe hasło',
        updatePassword: 'Zmień Hasło',
        togglePassword: 'Pokaż/ukryj hasło',
        logout: 'Wyloguj się',
        logoutDesc: 'Zostaniesz wylogowany z bieżącej sesji.',
        memberSince: 'Członek od',
        accountId: 'ID konta',
        status: 'Status',
        statusActive: 'Aktywny',
        roleAdmin: 'Administrator',
        roleUser: 'Użytkownik',
        profileUpdated: 'Profil został zaktualizowany.',
        passwordUpdated: 'Hasło zostało zmienione.',
        nameRequired: 'Imię i nazwisko jest wymagane',
        nameTooShort: 'Imię musi mieć co najmniej 2 znaki',
        emailRequired: 'Adres email jest wymagany',
        emailInvalid: 'Podaj prawidłowy adres email',
        currentPasswordRequired: 'Aktualne hasło jest wymagane',
        newPasswordRequired: 'Nowe hasło jest wymagane',
        confirmPasswordRequired: 'Potwierdź nowe hasło',
        passwordMismatch: 'Hasła nie są zgodne',
        editProfileDesc: 'Zaktualizuj swoje imię i adres email',
        securityDesc: 'Zmień hasło, aby zabezpieczyć swoje konto',
        dangerZoneDesc: 'Działania w tej sekcji są nieodwracalne',
        signOut: 'Wyloguj się',
        signOutDesc: 'Zostaniesz wylogowany z bieżącej sesji na tym urządzeniu.',
        updateSuccess: 'Profil zaktualizowany pomyślnie.',
        updateError: 'Nie udało się zaktualizować profilu. Spróbuj ponownie.',
        passwordSuccess: 'Hasło zostało pomyślnie zmienione.',
        passwordError: 'Nie udało się zmienić hasła. Spróbuj ponownie.',
        changePassword: 'Zmień Hasło',
        strengthWeak: 'Słabe',
        strengthFair: 'Przeciętne',
        strengthGood: 'Dobre',
        strengthStrong: 'Silne',
        req8Chars: 'Co najmniej 8 znaków',
        reqUppercase: 'Co najmniej jedna wielka litera',
        reqNumber: 'Co najmniej jedna cyfra',
        navigation: 'Nawigacja profilu',
        accountInfo: 'Informacje o koncie',
        savedCars: 'Zapisane samochody',
        myFavorites: 'Moje ulubione',
        myFavoritesDesc: 'Samochody, które zapisałeś — przeglądaj i zarządzaj swoją listą życzeń.',
        favoritesCount: 'zapisane',
        loadingFavorites: 'Ładowanie ulubionych...',
        noFavorites: 'Brak zapisanych samochodów',
        noFavoritesDesc: 'Przeglądaj naszą ofertę i kliknij serce na dowolnym samochodzie, aby zapisać go tutaj.',
        browseCars: 'Przeglądaj samochody',
        removeFavorite: 'Usuń',
        settings: 'Ustawienia',
        settingsDesc: 'Personalizuj swoje doświadczenie — wybierz preferowany motyw i język.',
        settingsTheme: 'Motyw',
        settingsThemeDesc: 'Wybierz styl wizualny, który jest dla Ciebie najbardziej komfortowy.',
        settingsLanguage: 'Język',
        settingsLanguageDesc: 'Wybierz język, w którym chcesz wyświetlać witrynę.',
        settingsSaved: 'Preferencje zostały zapisane.',
        settingsSaveError: 'Nie udało się zapisać preferencji. Spróbuj ponownie.'
    }
}
