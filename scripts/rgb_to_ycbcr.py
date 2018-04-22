def rgb_to_ycbcr(img):
    out = {
        "y": [],
        "cb": [],
        "cr": [],
        "y_f": [],
        "cb_f": [],
        "cr_f": []
    }
    pixels = list(img.getdata())
    out["width"], out["height"] = img.size
    for px in pixels:
        r = px[0]
        g = px[1]
        b = px[2]
        y =        (.299 * r) + (.587 * g) + (.114 * b)
        cb = 128 - (.169 * r) - (.331 * g) + (.500 * b)
        cr = 128 + (.500 * r) - (.419 * g) - (.081 * b)
        out["y"].append(int(y))
        out["cb"].append(int(cb))
        out["cr"].append(int(cr))
        out["y_f"].append(y)
        out["cb_f"].append(cb)
        out["cr_f"].append(cr)
    return out

    return out

