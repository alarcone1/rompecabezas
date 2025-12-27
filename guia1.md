# Guía Didáctica: Nivel 1 (BEGINNER) - Fundamentos del Contexto Estático con AGENTS.md

## Introducción

Los agentes de IA (como Kilo Code, Cursor, Copilot Agent) a menudo cometen errores o generan código inconsistente por falta de contexto sobre el proyecto. Este problema es común y afecta la productividad de los desarrolladores.

AGENTS.md surge como la solución estándar y unificada para este problema, funcionando como un "README para los agentes de IA". Este archivo centraliza las instrucciones que antes estaban dispersas en múltiples archivos de configuración específicos de cada herramienta (como .cursor, kilocode, etc.).

El objetivo de este nivel es aprender a "reducir" la ambigüedad y guiar al agente con instrucciones estáticas y directas.

## Conceptos Clave

### ¿Qué es el Contexto Estático?

El Contexto Estático es el conjunto de reglas e información fundamental que no cambia frecuentemente y que el agente de IA debe conocer siempre al trabajar en el proyecto. Proporciona una base sólida para que el agente comprenda la estructura, propósito y convenciones del proyecto.

### ¿Qué es AGENTS.md?

AGENTS.md es un lugar predecible para que los agentes encuentren instrucciones, guías de estilo, comandos de compilación y prueba, y otras convenciones del proyecto. No tiene campos obligatorios y es simplemente un archivo Markdown estándar que cualquier agente de IA puede leer y comprender.

## Secciones Esenciales de un AGENTS.md para Principiantes

### Project overview

Un resumen conciso del propósito del proyecto. Esta sección es crucial porque proporciona al agente una comprensión general del objetivo del proyecto, permitiéndole generar código más relevante y alineado con la visión del proyecto.

### Build and test commands

Comandos exactos para instalar dependencias, iniciar el servidor y ejecutar pruebas. El agente intentará ejecutar estos comandos para verificar su trabajo, por lo que es importante que sean precisos y funcionales.

### Code style guidelines

Reglas de formato, convenciones de nomenclatura, y patrones preferidos (p. ej., "usar comillas simples, sin punto y coma"). Esta sección ayuda al agente a mantener la consistencia con el estilo de código existente.

### Tech Stack and Key Libraries

Lista de las tecnologías principales, frameworks y versiones importantes (p. ej., "React 18 con Vite, Material UI v5, MobX para el estado"). Esta información es vital para que el agente genere código compatible con las tecnologías utilizadas en el proyecto.

## Ejemplo Completo y Práctico

Imaginemos un proyecto simple: "Una aplicación web de lista de tareas (To-Do App) construida con React y TypeScript, utilizando pnpm como gestor de paquetes y estilizada con Tailwind CSS".

A continuación, un archivo AGENTS.md completo y bien documentado para este proyecto de ejemplo:

```markdown
# AGENTS.md - To-Do App

## Project overview

Esta es una aplicación simple de lista de tareas para gestionar actividades diarias. Permite a los usuarios crear, editar, eliminar y marcar tareas como completadas. La aplicación está diseñada para ser intuitiva, rápida y fácil de usar.

## Build and test commands

- Instalar dependencias: `pnpm install`
- Iniciar servidor de desarrollo: `pnpm dev`
- Ejecutar pruebas: `pnpm test`
- Construir para producción: `pnpm build`

## Code style guidelines

- Usar componentes funcionales de React con Hooks. Evitar componentes de clase.
- Utilizar TypeScript en modo estricto.
- Formato: comillas simples, sin punto y coma.
- Estilos: usar clases de utilidad de Tailwind CSS directamente en el JSX. No crear archivos CSS separados.
- Componentes: Crear cada componente en su propia carpeta dentro de `src/components/`.
- Nombres de archivos: usar kebab-case para archivos y PascalCase para componentes.
- Estado global: utilizar Context API para estado compartido entre componentes.

## Tech Stack and Key Libraries

- Framework: React 18
- Lenguaje: TypeScript 5.2
- Gestor de paquetes: pnpm 9
- Estilos: Tailwind CSS 3
- Pruebas: Vitest + React Testing Library
- Linting: ESLint con configuración personalizada
- Formateo: Prettier
```

## Cómo Empezar (Paso a Paso)

### Paso 1: Crear el archivo

Crea un archivo llamado `AGENTS.md` en la raíz de tu repositorio. Es importante que esté en la raíz para que los agentes de IA puedan encontrarlo fácilmente.

### Paso 2: Rellenar las secciones

Completa las secciones esenciales basándote en tu propio proyecto, usando el ejemplo anterior como modelo. Asegúrate de incluir información precisa y relevante para tu proyecto específico.

### Paso 3: Iterar y mejorar

Trata AGENTS.md como documentación viva, actualizándolo a medida que el proyecto evoluciona o cuando observes errores recurrentes en el agente. Si notas que el agente comete errores específicos repetidamente, considera añadir instrucciones claras para abordar esos casos.

## Conclusión y Próximos Pasos

Implementar un archivo AGENTS.md bien estructurado proporciona beneficios clave: resultados de IA más consistentes, menos repetición de instrucciones en los prompts y un flujo de trabajo más eficiente.

En el siguiente nivel (Nivel 2: Contexto Dinámico), aprenderás sobre el uso de comandos para cargar contexto específico de la tarea (context priming), para generar anticipación y mejorar aún más la precisión de los agentes de IA.