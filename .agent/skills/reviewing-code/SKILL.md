---
name: reviewing-code
description: Realiza revisiones de código estructuradas sobre archivos o cambios. Usar cuando el usuario pida revisar código, verificar un archivo, auditar calidad o buscar bugs. No usar para escribir código nuevo ni para refactorizar.
---

# Revisión Estructurada de Código

## Usar este skill cuando
- El usuario pide revisar un archivo o PR
- El usuario pide encontrar bugs o problemas en código
- El usuario pide verificar la calidad del código

## NO usar cuando
- El usuario quiere escribir o generar código nuevo
- El usuario quiere refactorizar código existente

## Proceso de Revisión
1. Leer el/los archivo(s) objetivo completamente
2. Analizar usando estas categorías:
   - **Bugs**: Errores de lógica, off-by-one, riesgos de null/undefined
   - **Seguridad**: SQL injection, XSS, secrets hardcodeados, input sin validar
   - **Performance**: Consultas N+1, loops innecesarios, índices faltantes
   - **Legibilidad**: Nombres confusos, tipos faltantes, código muerto
   - **Edge cases**: Arrays vacíos, acceso concurrente, valores límite
3. Para cada issue encontrado, proveer:
   - Severidad: 🔴 Crítico | 🟡 Advertencia | 🔵 Sugerencia
   - Archivo y línea de referencia
   - Qué está mal y por qué
   - Sugerencia concreta de fix con código

## Formato de Salida
Comenzar con un resumen de una línea: "X issues encontrados (N críticos, N advertencias, N sugerencias)"
Luego listar issues agrupados por severidad, los más graves primero.
Terminar con una observación positiva sobre el código.
