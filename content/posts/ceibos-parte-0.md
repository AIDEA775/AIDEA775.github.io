---
title: "CeibOS. Parte 0"
date: 2019-11-06T22:01:50-03:00
draft: true
---

Nunca entendí los _shortcuts_, y no los entendí porque no tienen sentido:

* Si estoy en un editor de texto, `Ctrl+c` copia el texto seleccionado.
* Pero si estoy en una terminal, `Ctrl+c` termina el proceso que esta corriendo.
* En cambio, `Ctrl+Shift+c` en una terminal copia el texto seleccionado.
* Pero, `Ctrl+Shift+c` en Chromium abre el inspector.
* ...
* En Visual Code, `Ctrl+x` corta la linea actual si no hay texto seleccionado.
* Pero en cualquier otro lado, `Ctrl+x` no hace nada si no hay texto seleccionado.
* ... TODO más y conectar


Es cierto hay otros que masomenos son estándar, como `Ctrl+t`, `Ctrl+Shift+t`, `Ctrl+w`,
`Ctrl+q`, `Ctrl+o`, `Ctrl+s`, `Alt+1..9`.

Pero despues hay atajos como:

* `Ctrl+Alt+l` que bloquea la pantalla.
* `Ctrl+Alt+Der` en Visual Code parte el editor y pone la pestaña a la derecha.
* `Ctrl+Alt+Print` saca un screenshot de la ventana y lo pega en el _clipboard_.
* `Ctrl+Alt+F1..F7` cambia a la tty1..tty7.
* `Ctrl+Alt+A` activa la ventana que requiere atención.
* `Ctrl+Alt+t` lanza una terminal.
* `Ctrl+Alt+-` en Visual Code va hacia atrás.
* `Ctrl+Alt+Del` que mata al servidor X (!) (poweroff en GNOME).

Entonces, ¿qué relación hay entre los atajos que empiezan con `Ctrl+Alt`? Ninguna.

Pero es que nunca hubo una guía o un patrón, cada programa, cada _desktop environment_
y cada sistema operativo hace lo que quiere/puede.

Y hace falta eso, una guía de diseño que ponga reglas tipo:

* Locales a un proceso va con `Ctrl+algo`
* Si intervienen varios procesos va con `Meta+algo`.
* Si se agrega `Shift` hace lo mismo, pero mas grande/fuerte/"a lo bestia".
* Si se agrega `Alt` hace lo mismo, pero de forma _alternativa_.
* Si se agrega `¿?` hace justo lo opuesto.

---

Una de las cosas que más me gustaron al usar `i3wm`, es abrir varias terminales
(usaba `urxvt`) y usar el _Windows Manager_ para acomodarlas en mosaico o pestañas
según quisiera.

El entorno grafico debe permitir hacer eso, administrar muchas ventanas.
Por lo que programas no deberían tener su propia gestion de tabs,
eso debería gestionarlo el propio compositor.

Las ventanas deben ser eficientes en mostrar una sola cosa, concisa.

---

La pantalla nunca tiene que parpadear, ni durante el _booteo_ ni cuando se conecta
un monitor externo, es molesto.

---

El log del kernel al bootear es lindo, no hay porqué esconderlo.
O tal vez ya lo he visto tantas veces que me acostumbré.

De todas formas, hay que agregarle más color.

---

Para acciones rapidas (ej. abrir una app), tiene que cambiar muy poco 
lo que se ve en pantalla, o sea, lanzadores de apps en full screen no (GNOME).

---

La gestion de ventanas debe ser escalable, tanto en tamaño de monitor, resolución,
y cantidad de ventanas abiertas, nada se puede perder de vista ni mezclarse.

Debe ser intuitivo manejar las ventanas usando un proyector
(o sea, sin tener que girar la cabeza para ver que es lo que hay en la segunda pantalla).

Saltar entre dos ventanas, por mas lejos que estén, debe ser trivial.