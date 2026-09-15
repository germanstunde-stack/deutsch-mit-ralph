# Extrai os 26 contornos de cantão do SVG de domínio público do Wikimedia e
# casa cada um com sua sigla, usando as etiquetas que o próprio arquivo já traz
# posicionadas. O resultado é verificável: se um contorno ficar sem sigla ou uma
# sigla sem contorno, o script grita.
import re, io, json, sys

SRC = "ch.svg"
s = io.open(SRC, encoding="utf-8").read()

def camada(nome):
    i = s.find('inkscape:label="%s"' % nome)
    if i < 0: return ""
    outras = [s.find('inkscape:label="%s"' % o) for o in
              ["Wasser","Wappen","Legende","Konturen","Hauptstaedte","Grundkarte","Abkuerzung"]]
    outras = [n for n in outras if n > i]
    return s[i:min(outras) if outras else len(s)]

# ---- 1. siglas com posição -------------------------------------------------
abk = camada("Abkuerzung")
labels = {}
# em dois passos: primeiro fecha a TAG de abertura, depois lê o miolo. Juntar as
# duas coisas num regex só fazia o atributo style entrar como se fosse texto.
for m in re.finditer(r"<text\b([^>]*)>(.*?)</text>", abk, re.S):
    attrs, body = m.group(1), m.group(2)
    mx = re.search(r'\bx="([-\d.]+)"', attrs) or re.search(r'\bx="([-\d.]+)"', body)
    my = re.search(r'\by="([-\d.]+)"', attrs) or re.search(r'\by="([-\d.]+)"', body)
    if not mx or not my:
        continue
    txt = re.sub(r"\s+", "", re.sub(r"<[^>]+>", "", body))
    if re.fullmatch(r"[A-Z]{2}", txt):
        labels[txt] = (float(mx.group(1)), float(my.group(1)))
print("siglas encontradas: %d — %s" % (len(labels), " ".join(sorted(labels))))

# Genebra não tem etiqueta no arquivo (o cantão é pequeno e o rótulo ficou de
# fora). A posição vem do canto sudoeste, que é geograficamente inequívoco.
if False:
    labels["GE"] = (past := (150.0, 470.0))
    print("  GE sem etiqueta no arquivo — posição fixada no extremo sudoeste")

# ---- 2. contornos ----------------------------------------------------------
grund = camada("Grundkarte")
TOK = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)")
# quantos números cada comando consome por repetição, e quais desses números são
# um par (x,y) que move a caneta
ARITY = {"M":2,"L":2,"T":2,"H":1,"V":1,"C":6,"S":4,"Q":4,"A":7,"Z":0}

def pontos(d):
    """Posições absolutas por onde a caneta passa.

    Comando em MINÚSCULA é RELATIVO: os números são deltas, não coordenadas.
    Tratar tudo como absoluto (o que eu fazia antes) produz um centro que não
    tem relação nenhuma com onde a forma está no mapa."""
    toks = TOK.findall(d)
    pts, cur, start = [], (0.0, 0.0), (0.0, 0.0)
    cmd, nums, i = None, [], 0
    def flush():
        nonlocal cur, start, cmd
        if cmd is None: return
        up = cmd.upper(); rel = cmd.islower(); k = ARITY[up]
        if up == "Z":
            cur = start; pts.append(cur); return
        j = 0
        while j + k <= len(nums):
            ch = nums[j:j+k]; j += k
            x, y = cur
            if up in ("M","L","T"):      x, y = (x+ch[0], y+ch[1]) if rel else (ch[0], ch[1])
            elif up == "H":              x = x+ch[0] if rel else ch[0]
            elif up == "V":              y = y+ch[1-1] if rel else ch[0]
            elif up == "C":              x, y = (x+ch[4], y+ch[5]) if rel else (ch[4], ch[5])
            elif up in ("S","Q"):        x, y = (x+ch[2], y+ch[3]) if rel else (ch[2], ch[3])
            elif up == "A":              x, y = (x+ch[5], y+ch[6]) if rel else (ch[5], ch[6])
            cur = (x, y); pts.append(cur)
            if up == "M":
                start = cur
                # depois do primeiro par, um M implícito vira L
                up = "L"; k = 2
    for c, n in toks:
        if c:
            flush(); cmd, nums = c, []
        else:
            nums.append(float(n))
    flush()
    return pts

paths = []
for m in re.finditer(r'<path[^>]*?\sd="([^"]+)"', grund):
    d = m.group(1)
    pts = pontos(d)
    if len(pts) < 8:            # lixo, marcador, fragmento
        continue
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    paths.append({"d": d, "cx": cx, "cy": cy, "bb": (x0, y0, x1, y1),
                  "area": (x1 - x0) * (y1 - y0), "n": len(pts)})

print("contornos candidatos: %d" % len(paths))

# ---- 3. casamento ----------------------------------------------------------
# cada contorno vai pra sigla mais próxima do seu centro
def dist(a, b): return ((a[0]-b[0])**2 + (a[1]-b[1])**2) ** 0.5

# O critério é CONTENÇÃO, não distância: o contorno de um cantão é aquele cuja
# caixa contém a etiqueta dele. Distância pura elegia um fragmento minúsculo
# colado no rótulo — Graubünden, o maior cantão do país, saía com 12 pontos.
#
# Entre os contornos que contêm a etiqueta fica o MAIOR (o polígono do cantão,
# não um lago dentro dele). E os cantões são resolvidos do mais restrito para o
# menos: AR abraça AI, então a etiqueta de AI cai dentro das duas caixas, mas a
# de AR só cai na de AR — resolver AR primeiro deixa AI com o que sobra.
MARGEM = 6.0
def contem(p, pos):
    x0, y0, x1, y1 = p["bb"]
    return x0 - MARGEM <= pos[0] <= x1 + MARGEM and y0 - MARGEM <= pos[1] <= y1 + MARGEM

cands = {code: sorted([k for k, p in enumerate(paths) if contem(p, pos)],
                      key=lambda k: -paths[k]["area"])
         for code, pos in labels.items()}
saida, usados = {}, set()
for code in sorted(cands, key=lambda c: len(cands[c])):
    for k in cands[code]:
        if k in usados: continue
        p = dict(paths[k]); p["dist"] = dist((p["cx"], p["cy"]), labels[code])
        saida[code] = p; usados.add(k); break

# Sobra: BS, SH e afins são pequenos demais e têm a etiqueta DESENHADA FORA do
# próprio contorno, então contenção não os acha. Para esses vale o vizinho mais
# próximo ainda livre.
for code, pos in labels.items():
    if code in saida: continue
    livres = [(dist((paths[k]["cx"], paths[k]["cy"]), pos), k) for k in range(len(paths)) if k not in usados]
    if not livres: continue
    dd, k = min(livres)
    p = dict(paths[k]); p["dist"] = dd
    saida[code] = p; usados.add(k)
    print(f"  {code}: etiqueta fora do contorno, casado pelo mais próximo ({dd:.0f}px)")

# Genebra não tem etiqueta neste arquivo. Ela é, sem ambiguidade, o cantão mais
# a OESTE do país — então é o contorno livre de menor x, e não um chute de
# coordenada. Fragmentos ficam de fora pelo piso de área.
if "GE" not in saida:
    piso = sorted(p["area"] for p in paths)[len(paths) // 2] * 0.15
    livres = [(paths[k]["cx"], k) for k in range(len(paths)) if k not in usados and paths[k]["area"] >= piso]
    if livres:
        _, k = min(livres)
        p = dict(paths[k]); p["dist"] = 0.0
        saida["GE"] = p; usados.add(k)
        print(f"  GE: sem etiqueta — tomado como o contorno livre mais a oeste, em x={p['cx']:.0f}")

print("\ncantões com contorno: %d de 26" % len(saida))
faltando = sorted(set(labels) - set(saida))
if faltando: print("  SEM CONTORNO:", faltando)

# Conferência geográfica: se a atribuição tiver embaralhado cantões, estas
# afirmações — que qualquer mapa da Suíça satisfaz — quebram.
def cx(c): return saida[c]["cx"]
def cy(c): return saida[c]["cy"]
checagens = [
    ("GE é o mais a oeste",            min(saida, key=cx) == "GE"),
    ("GR é o mais a leste",            max(saida, key=cx) == "GR"),
    ("SH é o mais ao norte",           min(saida, key=cy) == "SH"),
    # nada de "o mais ao sul": GE é compacto no extremo sudoeste e o centro da
    # caixa dele cai mais baixo que o de VS/TI, que são grandes e sobem pro
    # norte. Isso é geometria de caixa, não cantão trocado.
    ("TI está ao sul de ZH",           cy("TI") > cy("ZH")),
    ("VS está ao sul de BE",           cy("VS") > cy("BE")),
    ("GE está a oeste de VS",          cx("GE") < cx("VS")),
    ("TI está a leste de VS",          cx("TI") > cx("VS")),
    ("BS está ao norte de BE",         cy("BS") < cy("BE")),
    ("ZH está a leste de BE",          cx("ZH") > cx("BE")),
    ("AI está dentro do retângulo de AR", abs(cx("AI") - cx("AR")) < 60 and abs(cy("AI") - cy("AR")) < 60),
]
print()
for nome, ok in checagens:
    print(("  ok   " if ok else "  FALHA ") + nome)
print("  mais ao sul:", max(saida, key=cy), "y=%.0f" % cy(max(saida, key=cy)))
print("  mais ao norte:", min(saida, key=cy), "  mais a oeste:", min(saida, key=cx), "  mais a leste:", max(saida, key=cx))
for c in sorted(saida, key=lambda c: -cy(c))[:5]:
    print(f"     {c}: y={cy(c):.0f} x={cx(c):.0f} pts={saida[c]['n']}")
if not all(ok for _, ok in checagens):
    sys.exit("conferência geográfica falhou — a atribuição embaralhou cantões")

for code in sorted(saida):
    p = saida[code]
    print(f'  {code}  centro=({p["cx"]:6.1f},{p["cy"]:6.1f})  dist={p["dist"]:5.1f}  pts={p["n"]:>4}  {len(p["d"]):>6} chars')

json.dump({c: {"d": p["d"], "cx": p["cx"], "cy": p["cy"]} for c, p in saida.items()},
          io.open("cantoes.json", "w", encoding="utf-8"))
print("\nescrito cantoes.json (%d cantões)" % len(saida))
