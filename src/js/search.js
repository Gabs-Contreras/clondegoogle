/**
 * Funcionalidad de búsqueda para el clon de Google
 */

class GoogleSearch {
  constructor() {
    this.searchHistory = this.loadHistory();
    this.maxHistoryItems = 10;
  }

  /**
   * Valida que el término de búsqueda sea válido
   * @param {string} query - Término de búsqueda
   * @returns {object} - {isValid: boolean, error: string}
   */
  validateSearch(query) {
    if (typeof query !== 'string') {
      return { isValid: false, error: 'El término de búsqueda es requerido' };
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      return { isValid: false, error: 'El término de búsqueda no puede estar vacío' };
    }

    if (trimmedQuery.length > 500) {
      return { isValid: false, error: 'El término de búsqueda es demasiado largo' };
    }

    return { isValid: true, error: null };
  }

  /**
   * Sanitiza el término de búsqueda
   * @param {string} query - Término de búsqueda
   * @returns {string} - Término sanitizado
   */
  sanitizeQuery(query) {
    return query.trim().replace(/\s+/g, ' ');
  }

  /**
   * Construye la URL de búsqueda de Google
   * @param {string} query - Término de búsqueda
   * @returns {string} - URL de Google
   */
  buildSearchUrl(query) {
    const sanitized = this.sanitizeQuery(query);
    const encoded = encodeURIComponent(sanitized);
    return `https://www.google.com/search?q=${encoded}`;
  }

  /**
   * Construye la URL para "Voy a tener suerte"
   * @param {string} query - Término de búsqueda
   * @returns {string} - URL de Google con parámetro btnI
   */
  buildLuckyUrl(query) {
    const sanitized = this.sanitizeQuery(query);
    const encoded = encodeURIComponent(sanitized);
    return `https://www.google.com/search?q=${encoded}&btnI=1`;
  }

  /**
   * Guarda el término en el historial
   * @param {string} query - Término de búsqueda
   */
  saveToHistory(query) {
    const sanitized = this.sanitizeQuery(query);

    // Remover duplicados
    this.searchHistory = this.searchHistory.filter(item => item !== sanitized);

    // Agregar al inicio
    this.searchHistory.unshift(sanitized);

    // Limitar el tamaño
    if (this.searchHistory.length > this.maxHistoryItems) {
      this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
    }

    // Guardar en localStorage
    this.persistHistory();
  }

  /**
   * Carga el historial desde localStorage
   * @returns {Array} - Array de búsquedas previas
   */
  loadHistory() {
    try {
      const stored = localStorage.getItem('searchHistory');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Persiste el historial en localStorage
   */
  persistHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error al guardar el historial:', error);
    }
  }

  /**
   * Limpia el historial
   */
  clearHistory() {
    this.searchHistory = [];
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('Error al limpiar el historial:', error);
    }
  }

  /**
   * Obtiene el historial actual
   * @returns {Array} - Array de búsquedas previas
   */
  getHistory() {
    return [...this.searchHistory];
  }

  /**
   * Realiza la búsqueda (redirige a Google)
   * @param {string} query - Término de búsqueda
   * @param {boolean} lucky - Si es búsqueda con suerte
   * @returns {object} - {success: boolean, url: string, error: string}
   */
  performSearch(query, lucky = false) {
    const validation = this.validateSearch(query);

    if (!validation.isValid) {
      return { success: false, url: null, error: validation.error };
    }

    const url = lucky ? this.buildLuckyUrl(query) : this.buildSearchUrl(query);
    this.saveToHistory(query);

    return { success: true, url, error: null };
  }
}

// Inicialización cuando el DOM está listo
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const googleSearch = new GoogleSearch();
    const searchInput = document.querySelector('.main-input input');
    const searchButtons = document.querySelectorAll('.main-buttons button');

    if (searchInput && searchButtons.length >= 2) {
      const searchButton = searchButtons[0];
      const luckyButton = searchButtons[1];

      // Handler para búsqueda normal
      const handleSearch = (e) => {
        e.preventDefault();
        const query = searchInput.value;
        const result = googleSearch.performSearch(query, false);

        if (result.success) {
          window.location.href = result.url;
        } else {
          alert(result.error);
        }
      };

      // Handler para "Voy a tener suerte"
      const handleLucky = (e) => {
        e.preventDefault();
        const query = searchInput.value;
        const result = googleSearch.performSearch(query, true);

        if (result.success) {
          window.location.href = result.url;
        } else {
          alert(result.error);
        }
      };

      // Búsqueda con Enter
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          handleSearch(e);
        }
      });

      // Click en botones
      searchButton.addEventListener('click', handleSearch);
      luckyButton.addEventListener('click', handleLucky);
    }
  });
}

// Exportar para testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GoogleSearch };
}
