const { GoogleSearch } = require('../src/js/search.js');

describe('GoogleSearch', () => {
  let googleSearch;

  beforeEach(() => {
    googleSearch = new GoogleSearch();
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('validateSearch', () => {
    test('debe validar búsqueda válida', () => {
      const result = googleSearch.validateSearch('javascript');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });

    test('debe rechazar búsqueda vacía', () => {
      const result = googleSearch.validateSearch('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda no puede estar vacío');
    });

    test('debe rechazar búsqueda con solo espacios', () => {
      const result = googleSearch.validateSearch('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda no puede estar vacío');
    });

    test('debe rechazar búsqueda null', () => {
      const result = googleSearch.validateSearch(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda es requerido');
    });

    test('debe rechazar búsqueda undefined', () => {
      const result = googleSearch.validateSearch(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda es requerido');
    });

    test('debe rechazar búsqueda no string', () => {
      const result = googleSearch.validateSearch(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda es requerido');
    });

    test('debe rechazar búsqueda demasiado larga', () => {
      const longQuery = 'a'.repeat(501);
      const result = googleSearch.validateSearch(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El término de búsqueda es demasiado largo');
    });

    test('debe aceptar búsqueda de 500 caracteres', () => {
      const query = 'a'.repeat(500);
      const result = googleSearch.validateSearch(query);
      expect(result.isValid).toBe(true);
      expect(result.error).toBe(null);
    });
  });

  describe('sanitizeQuery', () => {
    test('debe eliminar espacios al inicio y final', () => {
      const result = googleSearch.sanitizeQuery('  javascript  ');
      expect(result).toBe('javascript');
    });

    test('debe normalizar múltiples espacios a uno solo', () => {
      const result = googleSearch.sanitizeQuery('hello    world');
      expect(result).toBe('hello world');
    });

    test('debe manejar tabs y saltos de línea', () => {
      const result = googleSearch.sanitizeQuery('hello\t\nworld');
      expect(result).toBe('hello world');
    });

    test('debe mantener un solo espacio entre palabras', () => {
      const result = googleSearch.sanitizeQuery('  hello   world   test  ');
      expect(result).toBe('hello world test');
    });
  });

  describe('buildSearchUrl', () => {
    test('debe construir URL correcta para búsqueda simple', () => {
      const url = googleSearch.buildSearchUrl('javascript');
      expect(url).toBe('https://www.google.com/search?q=javascript');
    });

    test('debe encodear espacios correctamente', () => {
      const url = googleSearch.buildSearchUrl('hello world');
      expect(url).toBe('https://www.google.com/search?q=hello%20world');
    });

    test('debe encodear caracteres especiales', () => {
      const url = googleSearch.buildSearchUrl('c++');
      expect(url).toBe('https://www.google.com/search?q=c%2B%2B');
    });

    test('debe sanitizar antes de construir URL', () => {
      const url = googleSearch.buildSearchUrl('  hello   world  ');
      expect(url).toBe('https://www.google.com/search?q=hello%20world');
    });

    test('debe encodear caracteres especiales en español', () => {
      const url = googleSearch.buildSearchUrl('¿cómo estás?');
      expect(url).toContain('https://www.google.com/search?q=');
    });
  });

  describe('buildLuckyUrl', () => {
    test('debe construir URL con parámetro btnI', () => {
      const url = googleSearch.buildLuckyUrl('javascript');
      expect(url).toBe('https://www.google.com/search?q=javascript&btnI=1');
    });

    test('debe encodear espacios en URL lucky', () => {
      const url = googleSearch.buildLuckyUrl('hello world');
      expect(url).toBe('https://www.google.com/search?q=hello%20world&btnI=1');
    });

    test('debe sanitizar antes de construir URL lucky', () => {
      const url = googleSearch.buildLuckyUrl('  test  query  ');
      expect(url).toBe('https://www.google.com/search?q=test%20query&btnI=1');
    });
  });

  describe('History Management', () => {
    describe('saveToHistory', () => {
      test('debe guardar búsqueda en el historial', () => {
        googleSearch.saveToHistory('javascript');
        expect(googleSearch.getHistory()).toContain('javascript');
      });

      test('debe agregar nuevas búsquedas al inicio', () => {
        googleSearch.saveToHistory('primera');
        googleSearch.saveToHistory('segunda');
        expect(googleSearch.getHistory()[0]).toBe('segunda');
        expect(googleSearch.getHistory()[1]).toBe('primera');
      });

      test('debe eliminar duplicados', () => {
        googleSearch.saveToHistory('javascript');
        googleSearch.saveToHistory('python');
        googleSearch.saveToHistory('javascript');
        const history = googleSearch.getHistory();
        expect(history.length).toBe(2);
        expect(history[0]).toBe('javascript');
      });

      test('debe limitar el historial a maxHistoryItems', () => {
        for (let i = 0; i < 15; i++) {
          googleSearch.saveToHistory(`query${i}`);
        }
        expect(googleSearch.getHistory().length).toBe(10);
      });

      test('debe sanitizar antes de guardar', () => {
        googleSearch.saveToHistory('  test  query  ');
        expect(googleSearch.getHistory()[0]).toBe('test query');
      });
    });

    describe('loadHistory', () => {
      test('debe cargar historial vacío si no existe', () => {
        const newSearch = new GoogleSearch();
        expect(newSearch.getHistory()).toEqual([]);
      });

      test('debe cargar historial desde localStorage', () => {
        localStorage.setItem('searchHistory', JSON.stringify(['test1', 'test2']));
        const newSearch = new GoogleSearch();
        expect(newSearch.getHistory()).toEqual(['test1', 'test2']);
      });

      test('debe manejar JSON inválido en localStorage', () => {
        localStorage.setItem('searchHistory', 'invalid json');
        const newSearch = new GoogleSearch();
        expect(newSearch.getHistory()).toEqual([]);
      });
    });

    describe('persistHistory', () => {
      test('debe guardar historial en localStorage', () => {
        googleSearch.saveToHistory('test');
        const stored = localStorage.getItem('searchHistory');
        expect(JSON.parse(stored)).toEqual(['test']);
      });

      test('debe actualizar localStorage cuando cambia el historial', () => {
        googleSearch.saveToHistory('test1');
        googleSearch.saveToHistory('test2');
        const stored = localStorage.getItem('searchHistory');
        expect(JSON.parse(stored)).toEqual(['test2', 'test1']);
      });
    });

    describe('clearHistory', () => {
      test('debe limpiar el historial en memoria', () => {
        googleSearch.saveToHistory('test');
        googleSearch.clearHistory();
        expect(googleSearch.getHistory()).toEqual([]);
      });

      test('debe eliminar el historial de localStorage', () => {
        googleSearch.saveToHistory('test');
        googleSearch.clearHistory();
        expect(localStorage.getItem('searchHistory')).toBe(null);
      });
    });

    describe('getHistory', () => {
      test('debe retornar copia del historial', () => {
        googleSearch.saveToHistory('test');
        const history = googleSearch.getHistory();
        history.push('modificado');
        expect(googleSearch.getHistory().length).toBe(1);
      });

      test('debe retornar array vacío si no hay historial', () => {
        expect(googleSearch.getHistory()).toEqual([]);
      });
    });
  });

  describe('performSearch', () => {
    test('debe retornar success true para búsqueda válida', () => {
      const result = googleSearch.performSearch('javascript');
      expect(result.success).toBe(true);
      expect(result.url).toBe('https://www.google.com/search?q=javascript');
      expect(result.error).toBe(null);
    });

    test('debe retornar success false para búsqueda inválida', () => {
      const result = googleSearch.performSearch('');
      expect(result.success).toBe(false);
      expect(result.url).toBe(null);
      expect(result.error).toBe('El término de búsqueda no puede estar vacío');
    });

    test('debe usar buildLuckyUrl cuando lucky es true', () => {
      const result = googleSearch.performSearch('javascript', true);
      expect(result.success).toBe(true);
      expect(result.url).toBe('https://www.google.com/search?q=javascript&btnI=1');
    });

    test('debe guardar en historial cuando búsqueda es exitosa', () => {
      googleSearch.performSearch('javascript');
      expect(googleSearch.getHistory()).toContain('javascript');
    });

    test('no debe guardar en historial cuando búsqueda es inválida', () => {
      googleSearch.performSearch('');
      expect(googleSearch.getHistory().length).toBe(0);
    });

    test('debe manejar búsquedas con espacios', () => {
      const result = googleSearch.performSearch('  hello world  ');
      expect(result.success).toBe(true);
      expect(result.url).toBe('https://www.google.com/search?q=hello%20world');
      expect(googleSearch.getHistory()[0]).toBe('hello world');
    });
  });

  describe('Edge Cases', () => {
    test('debe manejar caracteres unicode', () => {
      const result = googleSearch.performSearch('你好世界');
      expect(result.success).toBe(true);
      expect(result.url).toContain('https://www.google.com/search?q=');
    });

    test('debe manejar emojis', () => {
      const result = googleSearch.performSearch('test 😀');
      expect(result.success).toBe(true);
      expect(result.url).toContain('https://www.google.com/search?q=');
    });

    test('debe manejar URL como query', () => {
      const result = googleSearch.performSearch('https://example.com');
      expect(result.success).toBe(true);
      expect(result.url).toContain('https://www.google.com/search?q=');
    });
  });
});

describe('DOM Integration', () => {
  let googleSearch;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <main>
        <section class="main-input">
          <div class="main-input-container">
            <input type="text">
          </div>
        </section>
        <section class="main-buttons">
          <div><button>Buscar con Google</button></div>
          <div><button>Voy a tener suerte</button></div>
        </section>
      </main>
    `;
    googleSearch = new GoogleSearch();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('debe existir el input de búsqueda', () => {
    const input = document.querySelector('.main-input input');
    expect(input).toBeInTheDocument();
  });

  test('debe existir el botón de búsqueda', () => {
    const button = document.querySelector('.main-buttons button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Buscar con Google');
  });

  test('debe existir el botón de suerte', () => {
    const buttons = document.querySelectorAll('.main-buttons button');
    expect(buttons.length).toBe(2);
    expect(buttons[1].textContent).toBe('Voy a tener suerte');
  });

  test('input debe aceptar texto', () => {
    const input = document.querySelector('.main-input input');
    input.value = 'test query';
    expect(input.value).toBe('test query');
  });
});
