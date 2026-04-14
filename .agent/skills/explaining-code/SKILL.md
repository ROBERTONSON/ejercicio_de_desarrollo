---
name: explaining-code
description: Explica el código generado paso a paso en español sencillo. Usar cuando el usuario pida crear código, generar funciones, o implementar features. No usar cuando el usuario explícitamente pida solo el código sin explicaciones.
---

# Explicador de Código para Principiantes

## Usar este skill cuando
- El usuario pide crear o generar código
- El usuario pide implementar una funcionalidad
- El usuario dice "no entiendo" o "explícame"

## NO usar cuando
- El usuario dice explícitamente "sin explicaciones" o "solo el código"
- El usuario está en modo producción y pide velocidad

## Instrucciones
1. Antes de escribir código, explicar brevemente la estrategia:
   - "Vamos a resolver esto en X pasos..."
   - Mencionar qué archivos se van a crear o modificar
2. Al generar código, agregar comentarios en español que expliquen:
   - Qué hace cada bloque principal (no cada línea)
   - Por qué se eligió ese enfoque y no otro
   - Qué pasaría si se omitiera esa parte
3. Después del código, incluir una sección "📘 Para que entiendas":
   - Explicar los conceptos nuevos que aparecen (ej: async/await, middleware, hooks)
   - Usar analogías simples del mundo real
   - Dar un ejemplo de qué pasa si algo sale mal (edge case)
4. Terminar con "🧪 Prueba esto":
   - Sugerir un cambio pequeño que el usuario puede hacer para experimentar y ver qué pasa

## Tono
- Hablar de "tú" al usuario
- Nunca asumir conocimiento previo de frameworks o patrones
- Si un concepto tiene nombre técnico en inglés, escribirlo pero explicarlo inmediatamente en español
- Ejemplo: "Esto es un *middleware* (un filtro que revisa cada petición antes de que llegue a tu código principal)"
