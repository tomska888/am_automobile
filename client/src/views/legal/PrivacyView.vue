<template>
  <div class="legal-page">
    <AppHeader />

    <main class="legal-main">
      <div class="container">
        <!-- Page Header -->
        <div class="legal-header">
          <div class="legal-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h1 class="legal-title">{{ $t('legal.privacy.title') }}</h1>
          <p class="legal-subtitle">{{ $t('legal.tos.lastUpdated') }}: 1 marca 2025</p>
        </div>

        <!-- Content -->
        <div class="legal-content">
          <div class="legal-toc">
            <h3>Spis treści</h3>
            <ol>
              <li><a href="#controller">Administrator danych</a></li>
              <li><a href="#data-collected">Jakie dane zbieramy</a></li>
              <li><a href="#purpose">Cel przetwarzania</a></li>
              <li><a href="#legal-basis">Podstawa prawna</a></li>
              <li><a href="#retention">Okres przechowywania</a></li>
              <li><a href="#rights">Twoje prawa</a></li>
              <li><a href="#sharing">Udostępnianie danych</a></li>
              <li><a href="#security">Bezpieczeństwo</a></li>
              <li><a href="#cookies-ref">Pliki cookies</a></li>
              <li><a href="#contact">Kontakt z DPO</a></li>
            </ol>
          </div>

          <div class="legal-highlight">
            <i class="fas fa-info-circle"></i>
            <p>
              Niniejsza Polityka Prywatności wyjaśnia, w jaki sposób AM Automobile sp. z o.o.
              przetwarza Twoje dane osobowe zgodnie z Rozporządzeniem Parlamentu Europejskiego i
              Rady (UE) 2016/679 (RODO).
            </p>
          </div>

          <section id="controller" class="legal-section">
            <h2>1. Administrator danych osobowych</h2>
            <p>Administratorem Twoich danych osobowych jest:</p>
            <div class="legal-contact-info">
              <p><strong>AM Automobile sp. z o.o.</strong></p>
              <p><i class="fas fa-map-marker-alt"></i> ul. Przykładowa 123, 00-001 Warszawa</p>
              <p><i class="fas fa-building"></i> NIP: 123-456-78-90, KRS: 0000123456</p>
              <p><i class="fas fa-envelope"></i> privacy@amautomobile.pl</p>
              <p><i class="fas fa-phone"></i> +48 22 123 45 67</p>
            </div>
          </section>

          <section id="data-collected" class="legal-section">
            <h2>2. Jakie dane osobowe zbieramy</h2>

            <h3>Dane podawane dobrowolnie:</h3>
            <ul>
              <li>Imię i nazwisko</li>
              <li>Adres e-mail</li>
              <li>Numer telefonu</li>
              <li>Treść wiadomości i zapytań</li>
            </ul>

            <h3>Dane zbierane automatycznie:</h3>
            <ul>
              <li>Adres IP i dane o lokalizacji przybliżonej</li>
              <li>Typ przeglądarki i systemu operacyjnego</li>
              <li>Strony i sekcje odwiedzane w Serwisie</li>
              <li>Czas i data wizyty</li>
              <li>Dane z plików cookies (szczegóły w Polityce Cookies)</li>
            </ul>

            <h3>Dane konta użytkownika (opcjonalnie):</h3>
            <ul>
              <li>Login (adres e-mail)</li>
              <li>Hasło (przechowywane wyłącznie w postaci zaszyfrowanej)</li>
              <li>Historia aktywności w Serwisie</li>
            </ul>
          </section>

          <section id="purpose" class="legal-section">
            <h2>3. Cel przetwarzania danych</h2>
            <p>Twoje dane przetwarzamy w następujących celach:</p>
            <ul>
              <li>
                <strong>Realizacja usług</strong> – odpowiadanie na zapytania, umawianie spotkań,
                obsługa sprzedaży pojazdów
              </li>
              <li>
                <strong>Prowadzenie konta użytkownika</strong> – umożliwienie logowania i
                korzystania z funkcji Serwisu
              </li>
              <li>
                <strong>Marketing bezpośredni</strong> – przesyłanie informacji o ofertach,
                wyłącznie po uzyskaniu zgody
              </li>
              <li>
                <strong>Analiza i statystyki</strong> – ulepszanie Serwisu i dostosowanie treści do
                potrzeb użytkowników
              </li>
              <li>
                <strong>Wypełnienie obowiązków prawnych</strong> – prowadzenie dokumentacji
                rachunkowej i podatkowej
              </li>
            </ul>
          </section>

          <section id="legal-basis" class="legal-section">
            <h2>4. Podstawa prawna przetwarzania</h2>
            <ul>
              <li>
                <strong>Art. 6 ust. 1 lit. a RODO</strong> – zgoda osoby, której dane dotyczą
                (marketing, cookies analityczne)
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. b RODO</strong> – niezbędność do wykonania umowy lub
                podjęcia działań przed jej zawarciem
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. c RODO</strong> – obowiązek prawny (przepisy podatkowe,
                rachunkowe)
              </li>
              <li>
                <strong>Art. 6 ust. 1 lit. f RODO</strong> – prawnie uzasadniony interes
                administratora (bezpieczeństwo, statystyki, dochodzenie roszczeń)
              </li>
            </ul>
          </section>

          <section id="retention" class="legal-section">
            <h2>5. Okres przechowywania danych</h2>
            <ul>
              <li>
                <strong>Dane z formularza kontaktowego:</strong> 3 lata od ostatniego kontaktu
              </li>
              <li>
                <strong>Dane konta użytkownika:</strong> do czasu usunięcia konta + 1 rok
              </li>
              <li><strong>Dane marketingowe:</strong> do wycofania zgody</li>
              <li><strong>Dane księgowe:</strong> 5 lat od końca roku obrotowego</li>
              <li><strong>Logi systemowe:</strong> do 12 miesięcy</li>
            </ul>
          </section>

          <section id="rights" class="legal-section">
            <h2>6. Twoje prawa</h2>
            <p>Na podstawie RODO przysługują Ci następujące prawa:</p>
            <ul>
              <li>
                <strong>Prawo dostępu</strong> – możesz zażądać informacji o przetwarzanych danych
              </li>
              <li>
                <strong>Prawo do sprostowania</strong> – możesz poprawić nieprawidłowe dane
              </li>
              <li>
                <strong>Prawo do usunięcia</strong> – „prawo do bycia zapomnianym" w określonych
                przypadkach
              </li>
              <li>
                <strong>Prawo do ograniczenia przetwarzania</strong> – możesz ograniczyć zakres
                przetwarzania
              </li>
              <li>
                <strong>Prawo do przenoszenia danych</strong> – otrzymanie danych w formacie
                ustrukturyzowanym
              </li>
              <li>
                <strong>Prawo sprzeciwu</strong> – sprzeciw wobec przetwarzania na podstawie
                prawnie uzasadnionego interesu
              </li>
              <li>
                <strong>Prawo do wycofania zgody</strong> – w dowolnym momencie, bez wpływu na
                legalność wcześniejszego przetwarzania
              </li>
            </ul>
            <p>
              Aby skorzystać z powyższych praw, skontaktuj się z nami: privacy@amautomobile.pl.
              Odpowiemy w ciągu 30 dni. Masz również prawo złożyć skargę do Prezesa UODO
              (uodo.gov.pl).
            </p>
          </section>

          <section id="sharing" class="legal-section">
            <h2>7. Udostępnianie danych</h2>
            <p>Twoje dane mogą być przekazywane:</p>
            <ul>
              <li>
                <strong>Dostawcom usług IT</strong> – hosting, poczta e-mail, systemy CRM (na
                podstawie umów powierzenia danych)
              </li>
              <li>
                <strong>Organom publicznym</strong> – wyłącznie na podstawie przepisów prawa
              </li>
              <li>
                <strong>Partnerom finansowym</strong> – w zakresie oferowania finansowania, za
                Twoją zgodą
              </li>
            </ul>
            <p>
              Nie sprzedajemy danych osobowych podmiotom trzecim. Nie przekazujemy danych poza
              Europejski Obszar Gospodarczy bez odpowiednich zabezpieczeń.
            </p>
          </section>

          <section id="security" class="legal-section">
            <h2>8. Bezpieczeństwo danych</h2>
            <p>Stosujemy następujące środki bezpieczeństwa:</p>
            <ul>
              <li>Szyfrowanie transmisji danych (SSL/TLS)</li>
              <li>Hashowanie haseł algorytmem bcrypt</li>
              <li>Kontrola dostępu oparta na rolach (RBAC)</li>
              <li>Regularne audyty bezpieczeństwa</li>
              <li>Procedury postępowania w przypadku naruszenia danych</li>
            </ul>
          </section>

          <section id="cookies-ref" class="legal-section">
            <h2>9. Pliki cookies</h2>
            <p>
              Szczegółowe informacje o plikach cookies znajdziesz w naszej
              <RouterLink to="/polityka-cookies">Polityce Cookies</RouterLink>. Możesz zarządzać
              ustawieniami cookies w swojej przeglądarce lub za pomocą naszego panelu preferencji.
            </p>
          </section>

          <section id="contact" class="legal-section">
            <h2>10. Kontakt z Inspektorem Ochrony Danych</h2>
            <p>
              W sprawach dotyczących ochrony danych osobowych możesz skontaktować się z naszym
              Inspektorem Ochrony Danych:
            </p>
            <div class="legal-contact-info">
              <p><i class="fas fa-envelope"></i> iod@amautomobile.pl</p>
              <p><i class="fas fa-map-marker-alt"></i> ul. Przykładowa 123, 00-001 Warszawa</p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
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
  margin-bottom: var(--space-8);
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

.legal-highlight {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.2);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  margin-bottom: var(--space-10);
}

.legal-highlight i {
  color: var(--primary-500);
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.legal-highlight p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
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

  .legal-highlight {
    flex-direction: column;
  }
}
</style>
