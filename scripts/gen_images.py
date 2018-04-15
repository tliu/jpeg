from PIL import Image
from rgb_to_ycbcr import *
import sys
import struct

if len(sys.argv) > 2:
    print "usage: gen_images.py [bitmap]"
    exit(0)

def to_bytes(n, length, endianess='big'):
    h = '%x' % n
    s = ('0'*(len(h) % 2) + h).zfill(length*2).decode('hex')
    return s if endianess == 'big' else s[::-1]

src_file = sys.argv[1]
source = Image.open(src_file, "r")
width = source.size[0]
height = source.size[1]
src_file = src_file.split("/")[-1].split(".")[0]

pixels = list(source.getdata())
rgb_file = open("../frontend/out/%s-%dx%d.rgb" % (src_file, source.size[0], source.size[1]), "wb")
for px in pixels:
    rgb_file.write("".join(map(lambda x: chr(x), list(px))))

ycbcr = rgb_to_ycbcr(source)
print "Writing raw Y values..."
y_file = open("../frontend/out/%s-%dx%d.y" % (src_file, source.size[0], source.size[1]), "wb")
for px in ycbcr["y"]:
    y_file.write(chr(px))

print "Writing raw Cb values..."
cb_file = open("../frontend/out/%s-%dx%d.cb" % (src_file, source.size[0], source.size[1]), "wb")
for px in ycbcr["cb"]:
    cb_file.write(chr(px))

print "Writing raw Cr values..."
cr_file = open("../frontend/out/%s-%dx%d.cr" % (src_file, source.size[0], source.size[1]), "wb")
for px in ycbcr["cr"]:
    cr_file.write(chr(px))

print "Writing half scaled Y values..."
y_half_file = open("../frontend/out/%s-%dx%d.y.half" % (src_file, source.size[0] / 2, source.size[1] / 2), "wb")
for c in range(height):
    for r in range(width):
        if r % 2 == 1: 
            continue
        if c % 2 == 1:
            continue
        y_half_file.write(chr(ycbcr["y"][r + c * width]))


print "Writing half scaled Cb values..."
cb_half_file = open("../frontend/out/%s-%dx%d.cb.half" % (src_file, source.size[0] / 2, source.size[1] / 2), "wb")
for c in range(height):
    for r in range(width):
        if r % 2 == 1: 
            continue
        if c % 2 == 1:
            continue
        cb_half_file.write(chr(ycbcr["cb"][r + c * width]))

print "Writing half scaled Cr values..."
cb_half_file = open("../frontend/out/%s-%dx%d.cr.half" % (src_file, source.size[0] / 2, source.size[1] / 2), "wb")
for c in range(height):
    for r in range(width):
        if r % 2 == 1: 
            continue
        if c % 2 == 1:
            continue
        cb_half_file.write(chr(ycbcr["cr"][r + c * width]))
