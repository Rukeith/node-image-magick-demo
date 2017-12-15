#!/bin/bash
set -ex

src=${1:?'Must provide a source'}
from=${2:?'From who'}
to=${3:?'To who'}
out=${4:-'out.jpg'}
font=${5:-'./Enchanting-Celebrations.ttf'}

convert ${src} -font ${font} \
  -pointsize 36 -gravity West -annotate +50-50 ${from} \
  -pointsize 36 -gravity West -annotate +50+10 ${to} \
  ${out}