#!/bin/sh
# Revisa lo que salió antes de mostrarlo. Deja las imágenes en out/check/.
set -e
mkdir -p out/check
# Tres cuadros del MP4: entrada, mitad y final.
ffmpeg -v error -y -i out/review.mp4 -vf "select='eq(n,8)+eq(n,34)+eq(n,149)',scale=540:-1,tile=3x1" -frames:v 1 out/check/tres-cuadros.png
# Un cuadro del .mov sobre magenta: si se ve magenta alrededor de las letras, la transparencia existe.
ffmpeg -v error -y -ss 4 -i out/alpha.mov -filter_complex "color=c=magenta:s=16x16[c];[c][0:v]scale2ref[bg][fg];[bg][fg]overlay=format=auto:shortest=1" -frames:v 1 out/check/sobre-magenta.png
# Lo que dice el archivo. ffprobe muestra yuva444p12le aunque se pidió 10 bits: es normal.
ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,nb_frames -of default=nw=1 out/alpha.mov
echo "Abre out/check/tres-cuadros.png y out/check/sobre-magenta.png y míralos."
