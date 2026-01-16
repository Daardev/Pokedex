# Pokédex

Una aplicación web interactiva que consume la API de Pokémon (PokéAPI) para mostrar información de Pokémon con funcionalidades de búsqueda.

## Descripción

Este proyecto es una Pokédex que permite visualizar los primeros 9 Pokémon con sus características principales. La aplicación utiliza JavaScript moderno con clases (ES6+), promesas y async/await para consumir datos de la PokéAPI de forma eficiente.

## Características

- **Visualización de Pokémon**: Muestra una galería de 9 Pokémon con sus imágenes, nombres, IDs y tipos
- **Búsqueda en tiempo real**: Permite buscar Pokémon por nombre mientras escribes
- **Interfaz responsiva**: Diseño adaptable a diferentes tamaños de pantalla usando Bootstrap 5
- **Manejo de promesas**: Utiliza `Promise.all()` para gestionar múltiples peticiones a la API simultáneamente
- **Gestión de errores**: Incluye validaciones y manejo de errores en las peticiones
- **Feedback visual**: Indicadores de carga y mensajes de error

## Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS**: Bootstrap 5 CDN para estilos y componentes
- **JavaScript ES6+**:
  - Clases
  - Async/Await
  - Arrow functions
  - Métodos de array (map, filter, join)
  - Promesas
  - Destructuración

## Estructura del proyecto

```
pokeapi/
├── index.html                    # Página principal
└── assets/
    └── js/
        └── app.js               # Lógica principal de la aplicación
```

## Archivos principales

### `index.html`
- Estructura HTML con contenedor principal
- Barra de búsqueda
- Área de alertas para errores
- Indicador de carga
- Área de renderizado de tarjetas de Pokémon

### `app.js`
Contiene la clase `Pokemon` que gestiona:

#### Constructor
- Inicializa la URL base de la API
- Arrays para almacenar Pokémon
- Referencia al buscador
- Extrae los IDs de los Pokémon a cargar

#### Métodos principales

- **`init()`**: Método asincrónico que inicializa la aplicación
  - Carga los Pokémon
  - Renderiza en el DOM
  - Configura el buscador

- **`extraerId()`**: Crea un array de IDs del 1 al 9

- **`cargarPokemones()`**: Método principal que:
  - Construye las URLs de los Pokémon
  - Realiza peticiones fetch simultáneas
  - Convierte respuestas a JSON
  - Extrae información relevante (id, nombre, imagen, tipos)
  - Maneja errores

- **`configurarBuscador()`**: Configura el event listener del input de búsqueda

- **`buscarPokemon(terminoBusqueda)`**: Filtra Pokémon por nombre
  - Normaliza el término de búsqueda
  - Restaura la lista original si el término está vacío
  - Filtra los Pokémon que coinciden

- **`mostrarDom()`**: Renderiza las tarjetas de Pokémon en HTML
  - Valida si hay Pokémon para mostrar
  - Genera tarjetas Bootstrap con:
    - Imagen del Pokémon
    - Nombre
    - ID formateado
    - Tipos con badges

## Flujo de ejecución

1. Se instancia la clase `Pokemon`
2. Se llama al método `init()`
3. Se cargan los datos de la API mediante `cargarPokemones()`
4. Se renderizan los Pokémon en el DOM
5. Se configura el buscador para escuchar cambios en el input
6. El usuario puede buscar Pokémon por nombre

## API utilizada

[PokéAPI v2](https://pokeapi.co/) - API REST pública gratuita con información sobre Pokémon

Endpoint utilizado:
```
https://pokeapi.co/api/v2/pokemon/{id}/
```

## Características de la búsqueda

- **Búsqueda en tiempo real**: Se dispara con cada cambio en el input
- **Case-insensitive**: La búsqueda no distingue mayúsculas/minúsculas
- **Búsqueda parcial**: Coincide con cualquier parte del nombre del Pokémon
- **Restauración**: Al limpiar la búsqueda, muestra todos los Pokémon nuevamente

## Validaciones y manejo de errores

- Validación de respuesta HTTP en las peticiones fetch
- Manejo de promesas rechazadas con try/catch
- Mensaje de alerta cuando no hay resultados
- Indicador de carga durante la petición

## Cómo usar

1. Abre el archivo `index.html` en tu navegador
2. La página cargará automáticamente los primeros 9 Pokémon
3. Utiliza el campo de búsqueda para filtrar Pokémon por nombre
4. Abre la consola del navegador (F12) para ver los logs de depuración

## Datos extraídos de cada Pokémon

- **id**: Identificador numérico del Pokémon
- **nombre**: Nombre del Pokémon en inglés
- **imagen**: URL de la imagen oficial del Pokémon
- **tipos**: Array de tipos del Pokémon (ej: fire, water, etc.)

## Notas de desarrollo

- El código incluye comentarios detallados explicando cada paso del proceso
- Se utiliza `Promise.all()` para optimizar las peticiones a la API
- Los datos se mantienen en dos arrays: `pokemones` (actual) y `pokemonesOriginales` (copia original para búsquedas)
- Las tarjetas se renderizan usando template literals de JavaScript

## Mejoras futuras posibles

- Cargar más de 9 Pokémon
- Paginación o scroll infinito
- Filtrado por tipo
- Detalles expandibles de cada Pokémon
- Persistencia de datos en localStorage
- Historial de búsquedas

---

*Proyecto desarrollado como ejercicio de aprendizaje en JavaScript avanzado*
