from PIL import Image
import numpy

imarray = numpy.random.randint(8, size=(8,4))
c = [[0x24, 0x24, 0x24], [0x5c, 0x56, 0x53], [0xff, 0x77, 0x33], [0x7f, 0xe4, 0x20], [0x36, 0xa3, 0xd9], [0xa3, 0x7a, 0xcc], [0xff, 0x33, 0x33], [0xff, 0xff, 0xff]]

img = numpy.zeros(imarray.shape + (3,), dtype='uint8')
for x in range(len(img)):
	for y in range(len(img[0])):
		for z in range(3):
			img[x][y][z] = c[imarray[x][y]][z]
test = numpy.concatenate((img, numpy.flip(img, 1)), 1)
im = Image.fromarray(test).convert('RGBA')
im = im.resize((512, 512))
im.save('static/favicon.png')