# Tarea 4 — App de prueba con Expo

App móvil creada con Expo (React Native) para la clase de Programación Aplicada.
Autor: **Luis Fabio Cortorreal Marte**.

## Qué incluye

| Requisito | Dónde está |
| --- | --- |
| Pantalla Home con nombre y carnet | `app/(tabs)/index.tsx` |
| `FlatList` con 6 elementos hardcodeados | `app/(tabs)/lista.tsx` |
| Navegación entre las dos pantallas | botón "Ver la lista" / "Volver al inicio" (`router.push`) |
| `TextInput` + `Button` que muestra el texto | bloque "Formulario" en `app/(tabs)/index.tsx` |
| Estilos propios con `StyleSheet.create()` | ambas pantallas (más de 10 estilos) |

Los datos personales están en `constants/estudiante.ts` (nombre, carrera y carnet).

## Cómo correrlo

```bash
npm install
npx expo start
```

Luego escanea el QR con la app **Expo Go** del celular (la PC y el celular deben estar en
la misma red WiFi). También sirve `npm run android`, `npm run ios` o `npm run web`.

## Estructura

```
app/
  _layout.tsx        navegación raíz
  (tabs)/
    _layout.tsx      define las pestañas Inicio y Lista
    index.tsx        pantalla Home (carnet + formulario)
    lista.tsx        pantalla de lista (FlatList)
constants/
  estudiante.ts      datos del estudiante
```
