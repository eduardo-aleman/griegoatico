---
# El título se generará automáticamente a partir del nombre del archivo.
# Por ejemplo, "leccion-02.md" se convertirá en "Leccion 02".
title: "{{ replace .File.ContentBaseName "-" " " | title }}"

# La fecha se insertará automáticamente en el momento de la creación.
date: {{ .Date }}

# Todas las lecciones nuevas se crean como borradores para evitar publicarlas por accidente.
# Cámbialo a 'false' cuando la lección esté lista para ser publicada.
draft: true

# Una descripción breve de la lección.
description: ""

# La estructura de los ejercicios ya está lista para que la rellenes.
ejercicios:
  - pregunta: "Describe la primera declinación de los sustantivos."
  - pregunta: "Conjuga el verbo 'εἰμί' en presente de indicativo."
  - pregunta: ""
---

## Título de la Primera Sección
Introduce aquí el primer concepto de la lección. Puedes usar texto, listas, etc.

* Punto uno.
* Punto dos.

### Subsección si es necesaria
Más detalles aquí.

## Título de la Segunda Sección
Explica el segundo concepto principal aquí. Puedes añadir tablas o cualquier otro elemento de Markdown.

| Encabezado 1 | Encabezado 2 |
| :--- | :--- |
| Celda 1 | Celda 2 |
| Celda 3 | Celda 4 |