from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
import numpy as np
import cv2
import os

FONT_SIZE = 45
WIDTH = 64
HEIGHT = 64
BACKGROUND = 0
FONT_COLOUR = 255

DIRECTORY = "OUTPUT_PATH"
LIST_FILE = "LIST_PATH/2500-list.txt"


kanji_string = open(LIST_FILE, 'r', encoding='utf-8').read()

NUM_KANJI = len(kanji_string)

np.random.seed(123)

font_paths = [
    "font1",
    "font2",
    "etc"
]


fonts = []
font_tables = []
for i in range(len(font_paths)):
    path = font_paths[i]
    fonts.append(ImageFont.truetype(path, FONT_SIZE))

    # write the font tables so we dont have to do this thousands of times
    font_tables.append([])
    for cmap in TTFont(path)['cmap'].tables:
        if cmap.isUnicode():
            font_tables[i] += cmap.cmap

usable_fonts_per_kanji = []


def char_in_font(char, font_path):
    i = font_paths.index(font_path)
    if ord(char) in font_tables[i]:
        return True
    return False


for i in range(NUM_KANJI):
    usable_fonts_per_kanji.append([])
    for path in font_paths:
        if char_in_font(kanji_string[i], path):
            usable_fonts_per_kanji[i].append(ImageFont.truetype(path, FONT_SIZE))
        else:
            print("\r\r", end='')
            print("U+" + str(hex(ord(kanji_string[i]))).lstrip("0x") + " is missing from " + path)
    print("\rverifying fonts: " + str(100 * i / NUM_KANJI), end='')


for i in range(NUM_KANJI):
    text = kanji_string[i]
    name = str(hex(ord(text))).lstrip("0x")
    subpath = DIRECTORY + "u" + name + "/"
    f_avail = usable_fonts_per_kanji[i]
    for u in range(300):
        while True:
            image = Image.new("L", (WIDTH, HEIGHT), BACKGROUND)
            draw = ImageDraw.Draw(image)
            random_index = np.random.randint(low=0, high=len(f_avail))
            draw.text(((WIDTH - FONT_SIZE) / 2, 0), text, font=f_avail[random_index], fill=FONT_COLOUR)
            test_image = np.array(image)
            ret, test_image = cv2.threshold(test_image, 127, 255, cv2.THRESH_BINARY)
            if np.max(test_image) < 128:
                # the font is missing this character, so use a different font
                print("\r\r", end='')
                print("U+" + name + " is blank in " + f_avail[random_index].getname()[0])
                f_avail.pop(random_index)
            else:
                break

        image = image.transform((WIDTH, HEIGHT), Image.Transform.AFFINE, 0.45 * (np.random.rand(6) - 0.5) +
                                np.array([1, 0, 0, 0, 1, 0]))
        kernel = np.ones((2, 2), np.uint8)
        image = np.array(image)
        # image = cv2.blur(image, (3, 3))
        ret, image = cv2.threshold(image, 100, 255, cv2.THRESH_BINARY)
        # image *= np.random.randint(0, 10, (WIDTH, HEIGHT), dtype=np.uint8)
        if not os.path.exists(subpath):
            os.makedirs(subpath)
        cv2.imwrite(subpath + str(u) + ".png", image)

    print("\rwriting images: completed " + str(i) + " out of " + str(NUM_KANJI) + " (" +
          str(int(round(10000 * i / NUM_KANJI)) / 100) + "%)", end='')


print("\ndone")
