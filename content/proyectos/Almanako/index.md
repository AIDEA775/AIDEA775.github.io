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


En casa nos acostumbramos a tener un calendario en papel para anotar recordatorios de todo tipo: cumples, estudios, exámenes, pagos, etc.

Pero no todos los años encontrábamos almanaques que tengan espacio para escribir.
Hubo un año que mi madre tomó unas hojas A4 usadas e hizo un calendario casero.

Resultó ser muy cómodo, tenía mucho espacio para anotar, era compacto, y no desperdiciaba
espacio con fotos o publicidad. **Pero llevaba tiempo hacerlo.**

Así nació [este proyecto](https://github.com/AIDEA775/py-cal), 
desde 2017, cada año retomaba el código que
había escrito, y lo volvía a entender y lo mejoraba.

Empezó como un script en Python que generaba imágenes vectoriales en SVG usando la librería
[svgwrite](https://pypi.org/project/svgwrite/):

{{< figure
src="https://raw.githubusercontent.com/AIDEA775/py-cal/4ce5cf41a4c394dc4cc5038c8d8075495a65455f/preview.svg"
caption="Cero sentido de diseño en esos tiempos." >}}


Luego pasó a usar la librería [Pillow](https://pypi.org/project/Pillow/)
para generar imágenes PNG y año tras año fui mejorando de a poco el diseño
(y a medida que iba aprendiendo más cosas de UI/UX):

|  |  |  |
| -- | -- | -- |
| {{< figure
src="preview-2019.png" caption="2019" >}} | {{< figure
src="preview-2020.png" caption="2020" >}} | {{< figure
src="preview-2021.png" caption="2021" >}}

En 2022 pensé que era momento de pasar a PDF, ya que es un buen formato para
imprimir. Pero en vez de usar una librería en Python,
decidí aprovechar que los navegadores pueden imprimir las páginas webs y así que
esté disponible de forma muy práctica.

Además, podría escribir el almanaque en HTML y CSS, y hacerlo responsivo para
distintos tipos de hoja.

Así nace formalmente [Almanako](https://aidea775.github.io/Almanako/) ([GitHub](https://github.com/AIDEA775/Almanako)), 
una web simple, para generar un archivo PDF con 12 hojas, uno por cada mes.

---

### Decisiones

Ya tenía algo de experiencia con [Tailwind](https://tailwindcss.com/),
así que no fue difícil de elegirlo como framework CSS.

No había mucha lógica en JavaScript para implementar,
solo lo necesario para generar una lista de matrices (7x5) con los días de cada mes, y parsear archivos en formato ICS para agregar los cumpleaños y feriados.

Generar el HTML fue todo un desafío, intenté usar JS nativo, sin
ninguna librería, pero resultó ser muy verboso y complicado.

Luego de una investigación y unas pruebas, [Svelte](https://svelte.dev/) era lo que buscaba.
Simple, basado en componentes, sin ninguna carga innecesaria en runtime
que haga la web más pesada de lo que debería, ya que al final, era solo HTML sin nada más: Nada de almacenamiento, ni API REST, ni cookies, ni routing,
no necesito un DOM virtual.

### Aprendizajes

Más allá de aprender _Svelte_ sobre la marcha (y quedar fascinado por simple
que queda el código) me topé con varios problemas que no esperaba:

1. **Los navegadores renderizan de forma distinta**

    En Firefox siempre se vio todo correcto, pero al pasar a Chrome,
    aparecieron algunas líneas divisorias que no deberían estar ahí.

    ¡Eran errores de redondeo!

    [Este post](https://www.palantir.net/blog/responsive-design-s-dirty-little-secret)
    explica con lujo de detalle este GRAN problema que tiene CSS.

1. **Hay estilos que son difíciles de personalizar**

    Aun cuando Tailwind quita todo el estilo personalizado de los navegadores, la posición y tamaño del puntito de los `<ul>` difieren entre Firefox y Chrome.

    Para poder mantener consistencia visual, tuve que no seguir las mejores prácticas
    y usar el Unicode bullet `• (U+2022)` para dibujar el puntito.

1. **Performance para la única animación que había**

    Al presionar _OPTIONS_, se abre un menú que desplaza la vista previa de los
    meses hacia abajo.

    Al parecer esta decisión de diseño no es muy buena, ya que el navegador vuelve a renderizar los meses por cada frame, eso es bastante costoso y provoca _lag_ en la animación, especialmente en un celular.

    Terminé aprendiendo sobre la propiedad CSS `will-change` para poder optimizar esa animación.

    > Aunque debería ser usada como última opción, no encontré otra forma para que el navegador no vuelva a renderizar los meses.

{{< figure 
src="preview-2022.png"
caption="Lo sé, falta el 1º de marzo, me di cuenta recién en marzo." >}} 
