---
title: "Linux Mainline en CHIP"
date: 2019-08-07T18:17:40-03:00
draft: false
---

En este texto cuento como fue el proceso que llevé a cabo para compilar
_linux mainline_ para la CHIP desde la primera vez que la enchufé.

CHIP es una computadora _single-board_ fabricada por Next Thing Co. (NTC),
lanzado como _open-source hardware_ corriendo _open-source software_.
Fue anunciado como "la primera computadora del mundo de $ 9". Mas info en
[Wikipedia](https://en.wikipedia.org/wiki/CHIP_(computer)).

{{< toc >}}

# Flasheando

La primera vez que alimenté a la CHIP los leds prendian, pero no tenía salida
de video. Usé el script de la siguiente guía para flashearla.

http://www.chip-community.org/index.php/Flash_from_command_line

Otra guía para flashear sin conexión y en español (por Alejandro Gaut):
https://gitlab.com/snippets/1866690

Luego de flashearla, los leds empezaron a parpadear,
pero seguía sin video, a prueba y error, descubrí que debía conectar la
salida de audio R del RCA (roja) a la entrada de video (amarilla).

Una vez que el Debian de NTC booteó, y luego de jugar un buen rato a
[Celeste Classic](https://www.youtube.com/watch?v=cP1x_EypI6Q),
empecé a compilar linux mainline.


## Compilar

Pasos sacados de [aqui](http://www.chip-community.org/index.php/Compile_the_Linux_kernel_for_CHIP).

Cross compiling toolchain:
```bash
sudo apt-get install gcc-arm-linux-gnueabihf binutils-arm-linux-gnueabihf
```

Linux Mainline:
```bash
git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
# sino sólo el último commit
git clone --depth 1 git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
```

Kernel config:
```bash
cp arch/arm/configs/sunxi_defconfig .config
```

Configurar kernel:
```bash
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf- menuconfig
```

No se si esto es tan importante:

> IMPORTANT: add a local version suffix. Follow the menus:
```none
    General setup  --->
    () Local version - append to kernel release
```

Compilar kernel:
```bash
make -j13 ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf-
```
> El parametro -j debería ser el numero de cores de tu procesador + 1.

Modulos (tal vez esto no sea necesario):
```bash
export WORKSPACE=./build
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf- INSTALL_MOD_PATH=$WORKSPACE modules_install
```
Esto instalará los modulos en `$WORKSPACE/lib` (después será copiado a la CHIP).

## Mover
Elimina los symlinks `build` y `source` de `lib/` porque `[s]cp -r` los seguirá.

```bash
export RELEASE=5.2.0-rc1vv1
unlink lib/modules/$RELEASE/build
unlink lib/modules/$RELEASE/source
```

Ahora tendrás que **configurar un servidor ssh en la CHIP**,
no debería ser muy complicado.

Copiá todo a un directorio temporal a la CHIP:
```bash
scp arch/arm/boot/dts/sun5i-r8-chip.dtb chip@chip:tmp
scp -r build/lib/modules/$RELEASE arch/arm/boot/zImage .config System.map chip@chip:tmp
```

Y luego movelo a donde corresponda:

| workspace source location        | destination on CHIP       |
| -------------------------------- | ------------------------- |
| arch/arm/boot/zImage             | /boot/vmlinuz-$RELEASE    |
| .config                          | /boot/config-$RELEASE     |
| System.map	                   | /boot/System.map-$RELEASE |
| lib/modules/$RELEASE             | /lib/modules/$RELEASE     |


# Conectando
Pasos sacado de [aquí](
http://www.chip-community.org/index.php/Chip9$_U-Boot:_how_to_test_a_new_kernel_(in_a_safe_way)#You_need_.28UART1.29_console_access.21).

Necesitamos un cable USB-UART y conectarlo como se debe. (TODO: Agregar foto)

* Ground pin 1
* TX pin 3
* RX pin 5

**CABLE ROJO NO, nada de +5v.**

Luego instalar screen:
```bash
sudo apt-get install screen
```

Conecta el lado del USB a la pc, y lanza screen:
```bash
screen /dev/ttyUSB0 115200
```
Chequeá la salida de `ls /dev/tty*` antes y despues de conectar la CHIP para
encontar el archivo correcto.

> Si te sale `screen is terminating error`, probá con:
```bash
sudo screen /dev/ttyUSB0 115200
```

Ahora bootea tu CHIP (conectala a la alimentación).

Tenes 3 segundos para parar el proceso de booteo y tener acceso a la shell de u-boot.

```none
U-Boot SPL 2016.01-00088-g99c771f (Dec 09 2016 - 22:29:06)
DRAM: 512 MiB
CPU: 1008000000Hz, AXI/AHB/APB: 3/2/2
Trying to boot from NAND


U-Boot 2016.01-00088-g99c771f (Dec 09 2016 - 22:29:06 +0000) Allwinner Technology

CPU:   Allwinner A13 (SUN5I)
I2C:   ready
DRAM:  512 MiB
NAND:  8192 MiB
video-mode 720x480-24@60 not available, falling back to 1024x768-24@60
Setting up a 720x480i composite-ntsc console (overscan 40x20)
In:    serial
Out:   serial
Err:   serial
Net:   usb_ether
starting USB...
No controllers found
Hit any key to stop autoboot:  0
=>
```

# Booteando

La memoria NAND MLC que tiene la CHIP no está soportada en Linux Mainline.
Por lo que lo siguiente va a tirar kernel panic porque no encuentra un `rootfs`.

Pero, técnicamente, Linux arranca.

La solución, es bootear con un rootfs a través de NFS por usb, en modo usb-device-ethernet,
que está en la siguiente sección.

Los pasos para bootear serían:

```shell
editenv bootcmd
# cambiar `for path in ${bootpaths}; do run boot_$path; done` por `run boot_noinitrd`
editenv boot_noinitrd
# cambiar el path del kernel `/boot/zImage` a `/boot/vmlinuz-$RELEASE`
run boot
```

Para copypastear (cambiá el valor de `$RELEASE`):

```shell
setenv bootcmd "run test_fastboot; if test -n ${fel_booted} && test -n ${scriptaddr}; then echo (FEL boot); source ${scriptaddr}; fi; run boot_noinitrd"
setenv boot_noinitrd "mtdparts; ubi part UBI; ubifsmount ubi0:rootfs; ubifsload $fdt_addr_r /boot/sun5i-r8-chip.dtb; ubifsload $kernel_addr_r /boot/vmlinuz-$RELEASE; bootz $kernel_addr_r - $fdt_addr_r"
run boot
```

## Rootfs

Usé debootstrap:
```bash
sudo apt install debootstrap
```

Generar el rootfs para la CHIP (armhf = 32bits):
```bash
mkdir /nfs/chip
cd /nfs/chip
debootstrap --arch armhf stable chip http://deb.debian.org/debian/
```

## NFS
Pasos sacados de [aquí](
http://www.chip-community.org/index.php/Booting_a_new_kernel_and_rootfs_via_NFS).

NFS server:
```bash
cat /etc/exports
/nfs/chip 192.168.0.0/16(rw,sync)
```

Iniciar el servidor
```bash
sudo systemctl restart nfs-server.service
```

## IPs

Bootear en Debian de NTC para chequear el servidor NFS.

Cuando conecto la CHIP, me aparece una nueva interfaz de red usb0,
que udev la renombra a enp3s0f0u1 (ver `dmesg | tail`).

En el server (_server~seven~7_):
```bash
sudo ip addr add 192.168.1.7/24 dev enp3s0f0u1
```

En la CHIP (_chip~two~2_):
```bash
sudo ip addr add 192.168.1.2/24 dev usb0
```

Chequear ping de una maquina a otra, y si va bien:
```bash
sudo mount 192.168.1.7:/nfs/chip tmp/
```

Nuestro servidor NFS está andando, ahora sólo hay que compilar nuestro Linux
con soporte usb ethernet (`g_ether`).

## Recompilar

Pasos sacados de [aquí](
https://developer.ridgerun.com/wiki/index.php/How_to_use_USB_device_networking).

Activar `USB_ETH` con `menuconfig`.
```none
Symbol: USB_ETH [=m]
   Prompt: Ethernet Gadget (with CDC Ethernet support)
     Defined at drivers/usb/gadget/Kconfig:628
     Depends on: <choice> && NET
     Location:
       -> Kernel configuration
         -> Device Drivers
           -> USB support (USB_SUPPORT [=y])
             -> USB Gadget Support (USB_GADGET [=y])
               -> USB Gadget Drivers (<choice> [=m])
```

Compilar, copiar y mover como antes.

## Bootear posta

Reiniciar la CHIP (`sudo reboot`) y parar U-Boot.

Con setenv definir:
```none
setenv g_ether.dev_addr de:ad:be:af:00:01
setenv g_ether.host_addr de:ad:be:af:00:00
setenv ip 192.168.1.2:192.168.1.7::255.255.255.0:chip:usb0:none
setenv nfsroot 192.168.1.7:/nfs/chip

setenv nfsload mtdparts; ubi part UBI; ubifsmount ubi0:rootfs; ubifsload $fdt_addr_r /boot/sun5i-r8-chip-ml.dtb; ubifsload $kernel_addr_r /boot/vmlinuz-$RELEASE
setenv nfsargs setenv bootargs root=/dev/nfs rw nfsroot=${nfsroot},v3 ip=${ip} rootfstype=nfs g_ether.dev_addr=${g_ether.dev_addr} g_ether.host_addr=${g_ether.host_addr} rootwait
setenv nfs_bootcmd "run nfsload ; run nfsargs ; bootz $kernel_addr_r - $fdt_addr_r"
```

> Podes guardar las variables permanentemente con `saveenv`.

Y finalmente, bootear con:

```none
run nfs_bootcmd
```

---

El log completo se encuentra [acá](/chip-mainline-kernel.log).