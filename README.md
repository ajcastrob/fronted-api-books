# Novelas del siglo XIX

Frontend para buscar novelas del siglo XIX. Consulta una API externa y muestra los resultados con una interfaz editorial.

## Tech stack

- JavaScript (Web Components)
- Vite
- CSS Modules + Lightning CSS
- pnpm

## Requisitos

- Node.js 20+
- pnpm 11+

## Instalación

```bash
pnpm install
```

## Scripts

| Comando        | Descripción                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Servidor de desarrollo en `:1234`    |
| `pnpm build`   | Genera la build en `dist/`           |
| `pnpm preview` | Previsualiza la build localmente     |
| `pnpm deploy`  | Publica en GitHub Pages              |
| `pnpm lint`    | Ejecuta oxlint                       |

## API

La app consume:

```
https://api-books-vqyf.onrender.com/books/{nombre-del-libro}
```

## Estructura

```
src/
├── api/           # Cliente HTTP
├── app/           # Lógica principal de la aplicación
├── components/    # Web Components (search-form, book-card, etc.)
├── styles/        # Estilos globales
└── utils/         # Utilidades y constantes
```

## Despliegue

El proyecto está configurado para GitHub Pages con base `/fronted-api-books/`. Para publicar:

```bash
pnpm build
pnpm deploy
```