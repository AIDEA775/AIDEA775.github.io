---
title: "Almanako"
date: 2022-02-18
draft: false
summary: Una web para imprimir calendarios
tags:
    - web
    - svelte
    - tailwind
---


En casa nos acostumbramos a usar un almanaque en papel para anotar recordatorios de todo tipo:
cumples, estudios, exámenes, pagos, etc.

Pero no todos los años encontrabamos almanaques que tengan espacio para escribir.
Hubo un año que mi madre tomó unas hojas A4 de impresora e hizo un almanque casero.

Resultó ser muy cómodo, tenía mucho espacio para anotar, y era compacto, no desperdiciaba
espacio con fotos u otra cosa. **Pero llevaba su tiempo hacerlo.**

Así nació [este proyecto](https://github.com/AIDEA775/py-cal), 
desde 2017, cada año retomaba el código que
había escrito el año pasado, lo volvía a entender, y lo mejoraba.

Empezó como un script en python que generaba imágenes en `.svg` usando la librería
[svgwrite](https://pypi.org/project/svgwrite/):

![2017](https://raw.githubusercontent.com/AIDEA775/py-cal/4ce5cf41a4c394dc4cc5038c8d8075495a65455f/preview.svg)

Luego lo reescribí usando la librería [Pillow](https://pypi.org/project/Pillow/)
para generar imágenes `.png` y me permitió año tras año ir mejorando y afinando el diseño:

|  |  |  |
| -- | -- | -- |
| {{< figure
src="preview-2019.png" title="2019" >}} | {{< figure
src="preview-2020.png" title="2020" >}} | {{< figure
src="preview-2021.png" title="2021" >}}

En 2022 pensé que era momento de pasar a `.pdf`, ya que es el formato ideal para
imprimir. Pero en vez de usar una librería para generar un pdf,
decidí aprovechar que los navegadores pueden imprimir las páginas webs y generar un pdf.

Así podría escribir el almanque en HTML y CSS, e incluso hacerlo responsivo para
distintos tipos de hoja.

Así nace formalmente [Almanako](https://aidea775.github.io/Almanako/) ([GitHub](https://github.com/AIDEA775/Almanako)), 
una web simple, para generar un archivo PDF con 12 hojas, uno por cada mes.

---

### Decisiones

Ya tenía algo de experiencia con [Tailwind](https://tailwindcss.com/),
lo cual no fué díficil de decidir el framework CSS.

La cantidad de lógica en Javascript era mínima, sólo lo necesario para
generar una lista de matrices (7x5) con los días de cada mese, y parsear archivos ICS para agregar los cumpleaños y
feriados.

Generar el HTML fué todo un desafío, empecé usando JS nativo, sin
ninguna librería, pero resultó ser muy verboso y complicado.

Luego de una investigación y unas pruebas, [Svelte](https://svelte.dev/) era lo que buscaba.
Simple, basado en componentes, sin ninguna carga innecesaria en runtime
que haga la web más pesada de lo que debería, ya que al final, era sólo HTML sin nada más:
nada de almacenamiento, ni api rest, ni cookies, ni navegación, etc.

### Aprendizajes

Más allá de aprender _Svelte_ sobre la marcha (y quedar fascinado por lo minimalista
que es) me topé con varios problemas que no esperaba:

1. Los navegadores renderizan de forma distinta:
    1. En Firefox siempre se vió todo correcto, pero al pasar a Chrome, de pronto
    aparecieron algunas lineas divisorias que no deberían estar ahí.

        **Eran errores de redondeo!**
        [Este post](https://www.palantir.net/blog/responsive-design-s-dirty-little-secret)
        lo explica con lujo de detalle este gran problema que tiene CSS.

    1. Aún cuando Tailwind quita todo el estilo que los navegadores personalizan, la posición y tamaño del puntito de los `<ul>` diferieren entre Firefox y Chrome.

        Para poder mantener consistencia visual, **tuve que no seguir las buenas prácticas del HTML** y en cambio usar el unicode bullet `• (U+2022)`.

1. Performance para la única animación que quería:

    Al presionar _OPTIONS_, se abre un menú que desplaza la vista previa de los
    meses hacía abajo.

    Al parecer esta decisión de diseño es muy mala, ya que **el navegador vuelve a renderizar los meses por cada frame**, eso es bastante costoso y provocaba _lag_ en la animación (pérdida de fotogramas), especialmente en un celular.

    Terminé leyendo sobre la propiedad CSS `will-change` para poder optimizar esa animación.

    > Aunque debería ser usada como última opción, no encontré otra forma para que el navegador no vuelva a renderizar los meses.
