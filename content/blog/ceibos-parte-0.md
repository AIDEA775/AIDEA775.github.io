---
title: "CeibOS. Parte 0"
date: 2019-11-06T22:01:50-03:00
draft: false
summary: 
---

### Nunca entendí los _shortcuts_
###### y no los entendí porque no tienen sentido:

* Si estoy en un editor de texto, `Ctrl+c` copia el texto seleccionado.
* Pero si estoy en una terminal, `Ctrl+c` termina el proceso que esta corriendo.
* En cambio, `Ctrl+Shift+c` en una terminal copia el texto seleccionado.
* Pero, `Ctrl+Shift+c` en Chromium abre el inspector.
* ...
* En Visual Code, `Ctrl+x` corta la linea actual si no hay texto seleccionado.
* Pero en cualquier otro lado, `Ctrl+x` no hace nada si no hay texto seleccionado.
* ... TODO más y conectar


Es cierto hay otros que masomenos son estándar, como:

* `Ctrl+t`/`Ctrl+Shift+t` para abrir/reabrir pestañas.
* `Ctrl+w`/`Ctrl+q` para cerrar una pestaña/ventana.
* `Ctrl+o`/`Ctrl+s` para abrir/guardar un archivo.
* `Alt+1..9` para cambiar de pestaña.

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

Algunos son del entorno grafico, otros del programa, y otros del sistema operativo.

Pero es que nunca hubo una guía o un patrón, cada programa, cada _desktop environment_
y cada sistema operativo hace lo que quiere/puede.

Y hace falta eso, una guía de diseño que ponga reglas tipo:

* Locales a un proceso va con `Ctrl+algo`
* Si intervienen varios procesos va con `Meta+algo`.
* Si se agrega `Shift` hace lo mismo, pero mas grande/fuerte/"a lo bestia".
* Si se agrega `Alt` hace lo mismo, pero de forma _alternativa_.
* Si se agrega `¿?` hace justo lo opuesto.

---

Algunos axiomas:

* Los shortcuts no deben depender de la distribución del teclado, y deben ser pensados
en torno a su ubicación en el teclado, y no por la letra que representa en qwerty.

* Shortcut no usado, es un shortcut desperdiciado.

    Los shortcuts deben ser faciles de aprender y consultar en todo momento.
    Por ejemplo, con `Mod+?` en donde sea que estemos, se despliega la ayuda
    con un buscador donde poder filtrar los shortcuts disponibles, tanto los del
    entorno grafico como los del programa que tenga foco en ese momento.

* El sistema operativo nunca, nunca nunca, debe tomar decisiones sin el consentimiento
del usuario, y mucho menos hacer cosas a espaldas del usuario.

    Me estoy refiriendo a las actualizaciones en segundo plano,
    el usuario tiene el derecho de saber que el gestor de paquetes va a estar usando ancho de banda y ciclos de procesador.

    La recolección de datos estaría bien, si se mantiene informado al usuario de los datos
    que se enviaron o se están por enviar.

* Toda acción o decision del sistema operativo debe ser cancelable.

    Toda accion debe reportarse por medio de notificaciones.
    Desde conectarse a una red wifi, montar un dispositivo, apagar la pantalla, o buscar actualizaciones.
    Y por ejemplo, con `Mod+Esc` se cancela la acción que se está por hacer o que se acaba de hacer.

* La pantalla nunca debe parpadear, ni durante el _booteo_ ni cuando se conecta un monitor externo.

    En serio, es molesto.

* Las acciones rapidas deben cambiar muy poco el estado de la pantalla.

    Lanzar una app debe ser algo rapido si se sabe que es lo que uno quiere.
    Una forma de lograrlo es usando la busqueda, en menos de 3 letras uno encuentra la app que busca.
    Los lanzadores de apps en full screen hacen que **todo** el contenido de la pantalla
    cambie rapidamente dos veces, casi como un "parpadeo".

* El padding es bueno, pero tampoco la pavada.

    Cada pixel es valioso para mostrar información, pero tambien hay que separar una información de otra.
    El ruido visual es lo peor.

* Hay que darle funciones especiales al trackpoint de las Thinkpads.

    El pupito rojo es genial, pero no hay ningun entorno grafico que saque provecho de su ubicación.

---

El humano es muy bueno para ubicar objetos espacialmente,
incluso con los ojos cerrados vas a poder decir donde está tu celuar,
indicar en que dirección está la puerta de salida,
y recordar donde dejaste la taza de café.

Pero cuando tenes muchas ventanas/pestañas abiertas,
no es tan facil saber donde esta esa ventana/pestaña que necesitas,
_ni mucho menos cual es el camino para llegar a ella_.

> En los entornos gráficos normales, las ventanas son flotantes, pueden superponerse,
para cambiar entre ellas hay que recorrer una lista ordenada de alguna forma,
las ventanas están en un solo escritorio virtual, y estos se ubican en filas y columnas.

> Luego existen los _tiling managers_, donde las ventanas son mosaicos, no se superponen,
se van acomodando ocupando toda la pantalla, no hace falta recorrer una lista para cambiar de 
ventana ya que están todas a la vista.
los escritorios virtuales saben ser en una lista que puede ser dinamica (no tienen tamaño fijo).

> Y no me enteré de otra cosa, hay diferentes tiling managers que permiten ordenar los mosaicos
de distintas formas, algunos permiten transformar un mosaico en una ventana flotante,
de igual forma hay entornos que permiten acomodar las ventanas flotantes en una suerte de mosaico.

---

Meta: Usar la pc sin tener que mirar la pantalla

Caso de uso: Cuando te conectas a un proyector, y este está detras tuyo.

Imagino lo siguente:

* Las ventanas son flotantes, pero no se pueden superponer,
sino que se van acomodando donde haya espacio.

* Un escritorio es _scrolleable_.

* Cuando no haya espacio para una ventana, el escritorio se "expande" hasta que la ventana entre.

* El escritorio se puede scrollear o verticalmente u horizontalmente, pero no los dos a la vez.

* Los escritorios se superponen, cada uno con su dirección de scroll.

* Las aplicaciones se pueden recorrer a través de una vista previa del escritorio o scrolleandolo.

* Existen 3 escritorios: uno base, uno alterno, y uno superior (¿hace falta más?).

* Un escritorio se muestra a traves de todas las pantallas (un dibujo explicaría mejor esto).

    Si la segunda pantalla está a la izquierda o derecha:
    * Si el escritorio es scrolleable horizontalmente,
        entonces el escritorio se muestra en las dos pantallas.
    * Si en cambio es scrolleable verticalmente,
        entonces se muestra solamente en la pantalla principal.

* Se puede scrollear demás en caso que sea necesario (ver ejemplo de uso).

* Los escritorios tienen cierta cantidad de filas y columnas que las ventanas pueden ocupar,
independientemente de la resolución, así que pasar entre pantallas con resoluciones distintas
no debería ser un problema.

    Ya que si una app ocupaba 6 de 12 columnas en una pantalla 720p,
    cuando se scrollee y pase a la pantalla secundaria 1080p, 
    se redimensionará para seguir ocupando la mitad horizontal.

Ejemplo de caso de uso:

> TODO: Una animación acá seria mucho mas simple de entender.

1. Presentación de _slides_ con un proyector.
1. Pantalla principal es la pantalla interna de la notebook.
1. Pantalla secundaria es el proyector, y está a la izquierda de la principal.
1. Las N slides se abren **en orden** en N ventanas
que se ubican en el escritorio base que es scrolleable horizontalmente.
1. En la pantalla principal se encuentra la primera slide, y el resto a la derecha.
1. Se hace scroll hacia la derecha, la primera slide ahora es visible por el proyector
y en la pantalla principal se encuentra la segunda slide.
1. En caso que se requiera hacer un cambio o chequear otra cosa,
se superpone el escritorio alterno, que se configura para ser scrolleable verticalmente,
y por lo tanto, solo se ve en la pantalla principal,
se puede scrollear sin afectar lo que se ve en el proyector.
1. Si se quiere mostrar algo por arriba de la presentación, por ejemplo una demo,
se superpone el escritorio superior, se lo configura en espejo,
de modo que el o los programas del escritorio se vean en ambas pantallas,
mientras que la presentación sigue por debajo justo donde la dejaron.
1. Para volver a la presentacion, simplemente se des-superpone los escritorios.

Puede que no sea gran cosa, así que acá van las:

###### PROS

* En ningun momento se tuvo que hacer `Alt+Tab`, ni se vieron por el proyector las ventanas abiertas.
* Todo esta espacialmente ubicado, y no hay comportamientos erraticos del tipo fullscreen en
la pantalla principal en vez del proyector.
* Tampoco se tuvo que arrastar una ventana de una pantalla a otra.
* No se sacrificó una pantalla al poner la segunda en modo espejo.
* Las slides se controlan de la misma forma que se controla el entorno grafico,
nada de perder el foco y que de pronto la slide no avance.
* Poder superponer la demo por arriba de la slide es algo que no se puede hacer
sin sacar el full screen de la presentacion, perdiendo el estado y rompiendo todo.


---

# WIP

Una de las cosas que más me gustaron al usar `i3wm`, es abrir varias terminales
(usaba `urxvt`) y usar el _Windows Manager_ para acomodarlas en mosaico o pestañas
según quisiera.

El entorno grafico debe permitir hacer eso, administrar muchas ventanas.
Por lo que programas no deberían tener su propia gestion de tabs,
eso debería gestionarlo el propio compositor.

Las ventanas deben ser eficientes en mostrar una sola cosa conscisa.

Con esto lograríamos dar la sensacion de estar usando una sola aplicación que lo
tiene todo, y que con plugins (programas) podemos hacer mas cosas.

---

El log del kernel al bootear es lindo, no hay porqué esconderlo.
O tal vez ya lo he visto tantas veces que me acostumbré.

De todas formas, hay que agregarle más color.

---

La gestion de ventanas debe ser escalable, tanto en tamaño de monitor, resolución,
y cantidad de ventanas abiertas, nada se puede perder de vista ni mezclarse.

Debe ser intuitivo manejar las ventanas usando un proyector
(o sea, sin tener que girar la cabeza para ver que es lo que hay en la segunda pantalla).

Saltar entre dos ventanas, por mas lejos que estén, debe ser trivial.


---