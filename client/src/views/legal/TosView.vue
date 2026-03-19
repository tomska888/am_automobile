<template>
  <div class="legal-page">
    <AppHeader />

    <main class="legal-main">
      <div class="container">
        <!-- Page Header -->
        <div class="legal-header">
          <div class="legal-icon">
            <i class="fas fa-file-contract"></i>
          </div>
          <h1 class="legal-title">{{ $t('legal.tos.title') }}</h1>
          <p class="legal-subtitle">{{ $t('legal.tos.lastUpdated') }}: 1 marca 2025</p>
        </div>

        <!-- Content -->
        <div class="legal-content">
          <div class="legal-toc">
            <h3>Spis treści</h3>
            <ol>
              <li><a href="#acceptance">Akceptacja warunków</a></li>
              <li><a href="#services">Opis usług</a></li>
              <li><a href="#account">Konto użytkownika</a></li>
              <li><a href="#prohibited">Zabronione działania</a></li>
              <li><a href="#liability">Ograniczenie odpowiedzialności</a></li>
              <li><a href="#intellectual">Własność intelektualna</a></li>
              <li><a href="#privacy">Prywatność</a></li>
              <li><a href="#changes">Zmiany warunków</a></li>
              <li><a href="#contact">Kontakt</a></li>
            </ol>
          </div>

          <section id="acceptance" class="legal-section">
            <h2>1. Akceptacja warunków</h2>
            <p>
              Korzystając z serwisu AM Automobile (dalej: „Serwis"), dostępnego pod adresem
              <strong>amautomobile.pl</strong>, potwierdzasz, że przeczytałeś, zrozumiałeś i
              zgadzasz się być związany niniejszymi Warunkami Korzystania z Usług. Jeśli nie
              zgadzasz się z którymkolwiek z poniższych warunków, prosimy o niekorzystanie z naszego
              Serwisu.
            </p>
            <p>
              Niniejsze Warunki stanowią prawnie wiążącą umowę między Tobą a AM Automobile sp. z o.o.
              z siedzibą w Warszawie, Polska.
            </p>
          </section>

          <section id="services" class="legal-section">
            <h2>2. Opis usług</h2>
            <p>AM Automobile świadczy następujące usługi:</p>
            <ul>
              <li>Przeglądanie oferty pojazdów dostępnych w naszym salonie</li>
              <li>Wyszukiwanie i filtrowanie samochodów według różnych kryteriów</li>
              <li>Kontaktowanie się z naszym zespołem sprzedaży</li>
              <li>Umawianie spotkań i jazd próbnych</li>
              <li>Dostęp do informacji o finansowaniu i ubezpieczeniu</li>
            </ul>
            <p>
              Serwis ma charakter informacyjny. Prezentowane ceny, specyfikacje i dostępność pojazdów
              mogą ulec zmianie bez uprzedniego powiadomienia. Ostateczne warunki transakcji są
              ustalane indywidualnie z przedstawicielem handlowym.
            </p>
          </section>

          <section id="account" class="legal-section">
            <h2>3. Konto użytkownika</h2>
            <p>
              Rejestracja konta w Serwisie jest opcjonalna, ale umożliwia dostęp do dodatkowych
              funkcji, takich jak zapisywanie ulubionych pojazdów czy historia zapytań.
            </p>
            <h3>Obowiązki użytkownika konta:</h3>
            <ul>
              <li>Podanie prawdziwych, dokładnych i aktualnych danych podczas rejestracji</li>
              <li>Zachowanie poufności hasła i danych logowania</li>
              <li>Niezwłoczne powiadomienie nas o nieautoryzowanym dostępie do konta</li>
              <li>Odpowiedzialność za wszelkie działania wykonane na koncie</li>
            </ul>
            <p>
              Zastrzegamy sobie prawo do zawieszenia lub usunięcia konta w przypadku naruszenia
              niniejszych Warunków lub podejrzenia nieuczciwych działań.
            </p>
          </section>

          <section id="prohibited" class="legal-section">
            <h2>4. Zabronione działania</h2>
            <p>Korzystając z Serwisu, zobowiązujesz się do niepodejmowania następujących działań:</p>
            <ul>
              <li>Kopiowania, reprodukowania lub dystrybuowania treści Serwisu bez naszej zgody</li>
              <li>Używania automatycznych narzędzi do pobierania danych (web scraping)</li>
              <li>Podszywania się pod inne osoby lub podawania fałszywych informacji</li>
              <li>Próby włamania lub naruszenia bezpieczeństwa Serwisu</li>
              <li>Spamowania lub wysyłania niechcianych wiadomości</li>
              <li>Działań naruszających prawa autorskie lub inne prawa własności intelektualnej</li>
              <li>
                Używania Serwisu w celach niezgodnych z prawem polskim lub międzynarodowym
              </li>
            </ul>
          </section>

          <section id="liability" class="legal-section">
            <h2>5. Ograniczenie odpowiedzialności</h2>
            <p>
              AM Automobile dokłada wszelkich starań, aby informacje prezentowane w Serwisie były
              aktualne i dokładne. Jednakże nie gwarantujemy kompletności ani bezbłędności
              prezentowanych danych.
            </p>
            <p>
              W maksymalnym zakresie dozwolonym przez prawo, AM Automobile nie ponosi
              odpowiedzialności za:
            </p>
            <ul>
              <li>Bezpośrednie lub pośrednie straty wynikające z korzystania z Serwisu</li>
              <li>Przerwy w dostępie do Serwisu lub błędy techniczne</li>
              <li>Decyzje podjęte na podstawie informacji zamieszczonych w Serwisie</li>
              <li>Treści zewnętrznych stron internetowych, do których prowadzą linki</li>
            </ul>
          </section>

          <section id="intellectual" class="legal-section">
            <h2>6. Własność intelektualna</h2>
            <p>
              Wszystkie treści zamieszczone w Serwisie, w tym teksty, grafiki, logo, zdjęcia,
              oprogramowanie i inne materiały, są własnością AM Automobile lub podmiotów
              udzielających nam licencji i są chronione prawem autorskim, znakami towarowymi oraz
              innymi przepisami dotyczącymi własności intelektualnej.
            </p>
            <p>
              Zezwalamy na przeglądanie i drukowanie fragmentów Serwisu wyłącznie na użytek osobisty
              i niekomercyjny. Wszelkie inne użycie wymaga naszej pisemnej zgody.
            </p>
          </section>

          <section id="privacy" class="legal-section">
            <h2>7. Prywatność</h2>
            <p>
              Przetwarzanie Twoich danych osobowych opisuje nasza
              <RouterLink to="/polityka-prywatnosci">Polityka Prywatności</RouterLink>, która
              stanowi integralną część niniejszych Warunków. Zachęcamy do zapoznania się z jej
              treścią.
            </p>
          </section>

          <section id="changes" class="legal-section">
            <h2>8. Zmiany warunków</h2>
            <p>
              Zastrzegamy sobie prawo do zmiany niniejszych Warunków w dowolnym momencie.
              O istotnych zmianach poinformujemy poprzez:
            </p>
            <ul>
              <li>Zamieszczenie zaktualizowanej wersji w Serwisie</li>
              <li>Wysłanie powiadomienia e-mail do zarejestrowanych użytkowników</li>
              <li>Wyświetlenie bannera informacyjnego w Serwisie</li>
            </ul>
            <p>
              Dalsze korzystanie z Serwisu po opublikowaniu zmian oznacza akceptację
              zaktualizowanych Warunków.
            </p>
          </section>

          <section id="contact" class="legal-section">
            <h2>9. Kontakt</h2>
            <p>W przypadku pytań dotyczących niniejszych Warunków, prosimy o kontakt:</p>
            <div class="legal-contact-info">
              <p><strong>AM Automobile sp. z o.o.</strong></p>
              <p><i class="fas fa-map-marker-alt"></i> ul. Przykładowa 123, 00-001 Warszawa</p>
              <p><i class="fas fa-envelope"></i> prawny@amautomobile.pl</p>
              <p><i class="fas fa-phone"></i> +48 22 123 45 67</p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

onMounted(() => {
  document.title = 'Regulamin – AM Automobile'
})
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

.legal-main {
  padding: var(--space-20) 0 var(--space-16);
}

.legal-header {
  text-align: center;
  margin-bottom: var(--space-12);
  padding-top: var(--space-8);
}

.legal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
}

.legal-icon i {
  font-size: 2rem;
  color: white;
}

.legal-title {
  font-size: var(--text-4xl);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.legal-subtitle {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.legal-content {
  max-width: 860px;
  margin: 0 auto;
}

.legal-toc {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  margin-bottom: var(--space-10);
}

.legal-toc h3 {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.legal-toc ol {
  margin: 0;
  padding-left: var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.legal-toc a {
  color: var(--primary-500);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color 0.2s;
}

.legal-toc a:hover {
  color: var(--primary-600);
  text-decoration: underline;
}

.legal-section {
  margin-bottom: var(--space-10);
  padding-bottom: var(--space-10);
  border-bottom: 1px solid var(--border-color);
}

.legal-section:last-child {
  border-bottom: none;
}

.legal-section h2 {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.legal-section h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: var(--space-6) 0 var(--space-3);
}

.legal-section p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: var(--space-4);
}

.legal-section ul,
.legal-section ol {
  color: var(--text-secondary);
  line-height: 1.8;
  padding-left: var(--space-6);
  margin-bottom: var(--space-4);
}

.legal-section li {
  margin-bottom: var(--space-2);
}

.legal-section a {
  color: var(--primary-500);
  text-decoration: underline;
}

.legal-contact-info {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-500);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  margin-top: var(--space-4);
}

.legal-contact-info p {
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.legal-contact-info i {
  color: var(--primary-500);
  width: 16px;
}

@media (max-width: 768px) {
  .legal-toc ol {
    grid-template-columns: 1fr;
  }

  .legal-title {
    font-size: var(--text-3xl);
  }
}
</style>
