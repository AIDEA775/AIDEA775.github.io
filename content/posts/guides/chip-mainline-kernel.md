---
title: "Chip Mainline Kernel"
date: 2019-08-07T18:17:40-03:00
draft: true
---

[Español]

### Caso base:
Flashee la CHIP porque no respondía, aunque los leds prendian,
no tenía salida de video:

http://www.chip-community.org/index.php/Flash_from_command_line#Thore_Krugs_Flasher_Script

Luego de flashear, los leds empezaron a parpadear cuando alimentaba la CHIP,
pero seguía sin video, a prueba y error, noté que debía conectar la
salida roja del RCA a la entrada del video (amarrilla).

### Si k, entonces k+1
Una vez que el Debian de NTC booteó, y luego de jugar un rato a _Celeste Classic_,
empecé a compilar linux mainline:

Pasos sacados de:
http://www.chip-community.org/index.php/Compile_the_Linux_kernel_for_CHIP

##### Compiling
Cross compiling toolchain:
```bash
apt-get install gcc-arm-linux-gnueabihf binutils-arm-linux-gnueabihf
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

Configure kernel:
```bash
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf- menuconfig
```

> No se si esto es tan importante:
IMPORTANT: add a local version suffix. Follow the menus:
```
    General setup  --->
    () Local version - append to kernel release
```
I set it to `vv1`, but when compiling, it is `vv1-gf49aa1de9`.

Compile kernel:
```bash
make -j13 ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf-
```
> The parameter -j should be set to the number of cores of your computer + 1.
> I have an 12-core (6 real cores + 6 SMT), so I use 13.

Modules:
```bash
export WORKSPACE=/somewhere/
make ARCH=arm CROSS_COMPILE=/usr/bin/arm-linux-gnueabihf- INSTALL_MOD_PATH=$WORKSPACE modules_install
```
> This will install modules in $WORKSPACE/lib (just to have a fake hierarchy to
> be copied to the CHIP).

##### Moving
> Don't forget to remove the symlinks to build and source in lib/ because [s]cp -r follows symlinks
> TODO: Poner alguna variable para que el copypaste no dependa de la version de linux.

```bash
unlink lib/modules/5.2.0-rc1vv1-gf49aa1de9/build
unlink lib/modules/5.2.0-rc1vv1-gf49aa1de9/source
```

> TODO: configure ssh

Copy everything to the CHIP:
```bash
scp arch/arm/boot/dts/sun5i-r8-chip.dtb chip@192.168.43.21:tmp
scp -r build/lib/modules/5.2.0-rc1vv1-gf49aa1de9 arch/arm/boot/zImage .config System.map chip@192.168.43.21:tmp
```

##### Running
Seguir ¿o copiar? algunos pasos de acá:
http://www.chip-community.org/index.php/Chip9$_U-Boot:_how_to_test_a_new_kernel_(in_a_safe_way)#You_need_.28UART1.29_console_access.21

Hasta que tengas acceso a la consola de UBoot.

Primero intenté bootear directamente:
```
TODO: Comandos para no tener que leer
```
> At the U-Boot prompt, enter editenv bootcmd and change the part that reads for
> path in ${bootpaths}; do run boot_$path; done to run boot_noinitrd.
> You need to do this because we have not generated an initrd for the new kernel,
> and the CHIP's U-Boot configuration (at time of writing, 21:31, 23 July 2016
> (CDT)) tries to boot with an initrd.
> Next, enter editenv boot_noinitrd and change the path to the kernel image
> /boot/zImage to /boot/vmlinuz-4.4.13rd235+.
> Finally, run boot to boot with your changes

Debería tirar kernel panic porque no encuentra un `rootfs`.
Pero, tecnicamente, Linux bootea.

##### Running with NFS rootfs
Fuente:
http://www.chip-community.org/index.php/Booting_a_new_kernel_and_rootfs_via_NFS

La fuente está realmente mal explicada.

NFS server:
```bash
$ cat /etc/exports
/nfs/chip 192.168.0.0/16(rw,sync)
```

Start the server
```bash
sudo /etc/init.d/nfs-kernel-server restart
```

Configurar IPs:

Bootear en Linux de NTC para chequear el servidor NFS.

Cuando conecto la CHIP, me aparece una nueva interfaz de red usb0,
que udev la renombra a enp3s0f0u1 (ver `dmesg | tail`).

En el host:
```bash
sudo ifconfig enp3s0f0u1 192.168.3.11
```

En la CHIP:
```bash
sudo /sbin/ifconfig usb0 192.168.3.190
```

Hace ping de una maquina a otra, y si va bien:
```bash
sudo mount 192.168.3.11:/nfs/chip tmp/
```

> TODO: Comprobar permisos de lectura y escritura?

Reiniciar la CHIP (`sudo reboot`) y parar U-Boot.

> TODO: Compilar modulo g_ether
>
> https://developer.ridgerun.com/wiki/index.php/How_to_use_USB_device_networking#Build_USB_Ethernet_network_gadget_driver

Con setenv definir:
```
g_ether.dev_addr=de:ad:be:af:00:01
g_ether.host_addr=de:ad:be:af:00:00
ip=192.168.3.190:192.168.3.11::255.255.255.0:chip:usb0:none
serverip=192.168.3.11
nfsroot=/nfs/chip/

nfsload=mtdparts; ubi part UBI; ubifsmount ubi0:rootfs; ubifsload $fdt_addr_r /boot/sun5i-r8-chip-ml.dtb; ubifsload $kernel_addr_r /boot/vmlinuz-5.2.0-rc1vv1-gf49aa1de9
nfsargs=setenv bootargs root=/dev/nfs rw rootfstype=nfs g_ether.dev_addr=${g_ether.dev_addr} g_ether.host_addr=${g_ether.host_addr} ip=${ip} nfsroot=${serverip}:${nfsroot} rootwait
nfs_bootcmd=run nfsload ; run nfsargs ; bootz $kernel_addr_r - $fdt_addr_r
```
> TODO: Comandos para copypastear?

Podes guardar las variables con `saveenv`

And finally, boot with `run nfs_bootcmd`.

---

Hasta ahora, sigue tirando kernel panic al no poder cargar el rootfs a través
de NFS.

Cosas que probé y no sé si tienen efecto:
* MAC clonada = de:ad:be:af:00:00 en el server