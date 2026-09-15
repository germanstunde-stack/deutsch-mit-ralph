# Arredonda os contornos e MEDE o desvio que isso causa, em vez de supor que é
# seguro: path relativo acumula erro a cada segmento, então cortar casas
# decimais pode deslocar o fim do traço. Depois emite o módulo TypeScript.
import json, io, re

TOK = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)")
ARITY = {"M": 2, "L": 2, "T": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "A": 7, "Z": 0}

def pontos(d):
    toks = TOK.findall(d)
    pts, cur, start = [], (0.0, 0.0), (0.0, 0.0)
    cmd, nums = None, []
    def flush():
        nonlocal cur, start
        if cmd is None: return
        up = cmd.upper(); rel = cmd.islower(); k = ARITY[up]
        if up == "Z":
            cur = start; pts.append(cur); return
        j = 0
        while j + k <= len(nums):
            ch = nums[j:j+k]; j += k
            x, y = cur
            if up in ("M", "L", "T"): x, y = (x+ch[0], y+ch[1]) if rel else (ch[0], ch[1])
            elif up == "H":           x = x+ch[0] if rel else ch[0]
            elif up == "V":           y = y+ch[0] if rel else ch[0]
            elif up == "C":           x, y = (x+ch[4], y+ch[5]) if rel else (ch[4], ch[5])
            elif up in ("S", "Q"):    x, y = (x+ch[2], y+ch[3]) if rel else (ch[2], ch[3])
            elif up == "A":           x, y = (x+ch[5], y+ch[6]) if rel else (ch[5], ch[6])
            cur = (x, y); pts.append(cur)
            if up == "M": start = cur; up = "L"; k = 2
    for c, n in toks:
        if c: flush(); cmd, nums = c, []
        else: nums.append(float(n))
    flush()
    return pts

NUM = re.compile(r"-?\d*\.?\d+(?:[eE][-+]?\d+)?")
def arredonda(path, casas):
    def r(m):
        v = ("%.*f" % (casas, float(m.group(0))))
        if "." in v: v = v.rstrip("0").rstrip(".")
        return v or "0"
    return NUM.sub(r, path)

d = json.load(io.open("cantoes.json", encoding="utf-8"))
print("original: %.1f KB" % (sum(len(p["d"]) for p in d.values()) / 1024))
melhor = None
for casas in (1, 2, 3):  # do mais econômico pro mais preciso: fica o primeiro que passa
    tot, pior, qual = 0, 0.0, ""
    for code, p in d.items():
        novo = arredonda(p["d"], casas)
        tot += len(novo)
        a, b = pontos(p["d"]), pontos(novo)
        dv = max((((x1-x2)**2 + (y1-y2)**2) ** 0.5) for (x1, y1), (x2, y2) in zip(a, b))
        if dv > pior: pior, qual = dv, code
    print(f"  {casas} casas: {tot/1024:5.1f} KB   desvio máximo {pior:6.3f} px (em {qual})")
    # o mapa é desenhado num viewBox de 1000x700 e exibido a ~500px: meio pixel
    # de desvio na tela é 1 unidade aqui. Fico com o menor que respeite isso.
    if pior < 1.0 and melhor is None:
        melhor = casas

casas = melhor or 3
print("\nescolhido: %d casas" % casas)

CAB = '''// Contornos dos 26 cantões suíços.
//
// Origem: "Kantone der Schweiz.svg", de KarzA (2008), Wikimedia Commons —
// DOMÍNIO PÚBLICO ("I release this work into the public domain"), conferido no
// arquivo e não na categoria (a mesma categoria mistura PD com CC BY-SA, que
// imporia share-alike). Recusadas as fontes de geodado do BFS/GEOSTAT, que são
// de licença NÃO-COMERCIAL — este app tem contas e ranking.
// https://commons.wikimedia.org/wiki/File:Kantone_der_Schweiz.svg
//
// O arquivo original tem 3 MB e é desenhado em camadas (base, contornos, água,
// brasões), sem um polígono identificado por cantão. Estes 26 foram extraídos
// casando cada contorno com a sigla que o próprio arquivo já traz posicionada,
// por CONTENÇÃO (a etiqueta cai dentro da caixa do contorno) e não por
// distância — distância elegia um fragmento colado no rótulo, e Graubünden, o
// maior cantão do país, saía com 12 pontos. O resultado passou por dez
// conferências geográficas (GE a oeste, GR a leste, SH ao norte, AR abraçando
// AI...) e foi visto renderizado. Ver scratchpad/extrai_mapa.py.
//
// viewBox 1000x700, o mesmo do arquivo de origem.
export const MAP_VIEWBOX = "0 0 1000 700";

/** `d` de cada cantão, indexado pelo código oficial de duas letras. */
export const CANTON_PATHS: Record<string, string> = {
'''
linhas = [CAB]
for code in sorted(d):
    linhas.append('  %s: "%s",\n' % (code, arredonda(d[code]["d"], casas).replace('"', "'")))
linhas.append("};\n\n")
linhas.append("/** centro da caixa de cada cantão — onde a sigla é desenhada no mapa. */\n")
linhas.append("export const CANTON_CENTERS: Record<string, [number, number]> = {\n")
for code in sorted(d):
    linhas.append("  %s: [%.1f, %.1f],\n" % (code, d[code]["cx"], d[code]["cy"]))
linhas.append("};\n")

alvo = "C:/Users/cruz_/germanstunde/src/data/ch/cantonPaths.ts"
import os
os.makedirs(os.path.dirname(alvo), exist_ok=True)
io.open(alvo, "w", encoding="utf-8").write("".join(linhas))
print("escrito %s (%.1f KB)" % (alvo, os.path.getsize(alvo) / 1024))
