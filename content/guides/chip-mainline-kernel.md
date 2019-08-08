---
title: "Chip Mainline Kernel"
date: 2019-08-07T18:17:40-03:00
draft: false
---

# Caso base:
La primera vez que alimenté a la CHIP los leds predian, pero no tenía salida
de video. Usé el script de la siguiente guía para flashearla.

http://www.chip-community.org/index.php/Flash_from_command_line#Thore_Krugs_Flasher_Script

Otra guía para flashear sin conexión y en español (por Alejandro Gaut):
https://gitlab.com/snippets/1866690

Luego de flashearla, los leds empezaron a parpadear,
pero seguía sin video, a prueba y error, descubrí que debía conectar la
salida de audio R del RCA (roja) a la entrada de video (amarrilla).

Una vez que el Debian de NTC booteó, y luego de jugar un buen rato a
[Celeste Classic](https://www.youtube.com/watch?v=cP1x_EypI6Q),
empecé a compilar linux mainline.

# Si k, entonces k+1

Fuente:
http://www.chip-community.org/index.php/Compile_the_Linux_kernel_for_CHIP

#### Compilando

Cross compiling toolchain:
```bash
sudo apt-get install gcc-arm-linux-gnueabihf binutils-arm-linux-gnueabihf
```

Linux Mainline:
```bash
git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git
# or
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
> Esto instalará los modulos en $WORKSPACE/lib (después será copiado a la CHIP).

#### Moviendo
> Elimina los symlinks `build` y `source` de `lib/` porque `[s]cp -r` los seguirá.

```bash
export RELEASE=5.2.0-rc1vv1
unlink lib/modules/$RELEASE/build
unlink lib/modules/$RELEASE/source
```

> Ahora tendrás que configurar un serivdor ssh en la chip,
> no debería ser muy complicado.

Copiá todo a un directorio temporal a la CHIP:
```bash
scp arch/arm/boot/dts/sun5i-r8-chip.dtb chip@192.168.43.21:tmp
scp -r build/lib/modules/$RELEASE arch/arm/boot/zImage .config System.map chip@192.168.43.21:tmp
```

Y luego lo movelo a donde corresponda:

| workspace source location        | destination on CHIP       |
| -------------------------------- | ------------------------- |
| arch/arm/boot/zImage             | /boot/vmlinuz-$RELEASE    |
| .config                          | /boot/config-$RELEASE     |
| System.map	                   | /boot/System.map-$RELEASE |
| lib/modules/$RELEASE             | /lib/modules/$RELEASE     |


#### Corriendo
Fuente:
http://www.chip-community.org/index.php/Chip9$_U-Boot:_how_to_test_a_new_kernel_(in_a_safe_way)#You_need_.28UART1.29_console_access.21

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

##### Rapido!
Tenes 3 segundos para parar el proceso de booteo y tener acceso a la shell de u-boot.

(TODO: Agregar log que aparece en pantalla)

Primero intenté bootear directamente:

(TODO: cambiar esto por el comando que setea directamente)
```shell
editenv bootcmd
# change `for path in ${bootpaths}; do run boot_$path; done` to `run boot_noinitrd`
editenv boot_noinitrd
# change the path to the kernel image `/boot/zImage` to `/boot/vmlinuz-$RELEASE`
run boot
```

Debería tirar kernel panic porque no encuentra un `rootfs`.
Pero, técnicamente, Linux bootea.

Como la memoria NAND MLC que tiene la CHIP no está soportada en Linux Mainline,
intenté bootear con NFS por usb, en modo usb-device-ethernet.

#### NFS rootfs
Fuente:
http://www.chip-community.org/index.php/Booting_a_new_kernel_and_rootfs_via_NFS

La fuente está realmente mal explicada.

NFS server:
```bash
mkdir /nfs/chip
cat /etc/exports
/nfs/chip 192.168.0.0/16(rw,sync)
```

Iniciar el servidor
```bash
sudo /etc/init.d/nfs-kernel-server restart
```

##### Configurar IPs:

Bootear en Debian de NTC para chequear el servidor NFS.

Cuando conecto la CHIP, me aparece una nueva interfaz de red usb0,
que udev la renombra a enp3s0f0u1 (ver `dmesg | tail`).

En el host (server):
```bash
sudo ifconfig enp3s0f0u1 192.168.3.11
```

En la CHIP:
```bash
sudo /sbin/ifconfig usb0 192.168.3.190
```

Chequear ping de una maquina a otra, y si va bien:
```bash
sudo mount 192.168.3.11:/nfs/chip tmp/
```

Nuestro servidor NFS está andando, ahora sólo hay que compilar Linux con soporte
usb ethernet (`g_ether`).

##### Recompilar...

Fuente: https://developer.ridgerun.com/wiki/index.php/How_to_use_USB_device_networking

Activar `USB_ETH` con `make menuconfig`.
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
¿TODO: `FEATURE_MOUNT_NFS`?

Compilar y mover como antes.

##### Bootear, de nuevo.

Reiniciar la CHIP (`sudo reboot`) y parar U-Boot.

Con setenv definir:
```none
g_ether.dev_addr=de:ad:be:af:00:01
g_ether.host_addr=de:ad:be:af:00:00
ip=192.168.3.190:192.168.3.11::255.255.255.0:chip:usb0:none
serverip=192.168.3.11
nfsroot=/nfs/chip/

nfsload=mtdparts; ubi part UBI; ubifsmount ubi0:rootfs; ubifsload $fdt_addr_r /boot/sun5i-r8-chip-ml.dtb; ubifsload $kernel_addr_r /boot/vmlinuz-$RELEASE
nfsargs=setenv bootargs root=/dev/nfs rw rootfstype=nfs g_ether.dev_addr=${g_ether.dev_addr} g_ether.host_addr=${g_ether.host_addr} ip=${ip} nfsroot=${serverip}:${nfsroot} rootwait
nfs_bootcmd=run nfsload ; run nfsargs ; bootz $kernel_addr_r - $fdt_addr_r
```
> TODO: Comandos para copypastear.

Podes guardar las variables permanentemente con `saveenv`.

Y finalmente, bootear con:

```none
run nfs_bootcmd
```

---

Hasta ahora, sigue tirando kernel panic al no poder cargar el rootfs a través
de NFS. Debo estar configurando algo mal.

Cosas que no probé y no sé si tienen efecto:

* MAC clonada en el server