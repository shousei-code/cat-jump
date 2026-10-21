import { useId } from "react";
import { getItem, PALETTES } from "../game/data";
import type { GameState, Outfit } from "../game/types";
// Keep every tint derived from the saved appearance; no flattened portrait replaces dress-up.
function tint(hex: string, amount: number) {
  const value = parseInt(hex.slice(1), 16),
    target = amount < 0 ? 0 : 255,
    mix = Math.abs(amount);
  return (
    "#" +
    [16, 8, 0]
      .map((shift) =>
        Math.round(((value >> shift) & 255) * (1 - mix) + target * mix)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
type Props = {
  state: Pick<GameState, "equipped" | "hairColor" | "eyeColor" | "skinColor">;
  outfit?: Outfit;
  expression?: "happy" | "calm" | "surprised";
  className?: string;
  label?: string;
};
export function Avatar({
  state,
  outfit,
  expression = "calm",
  className = "",
  label = "ことちゃんのコーディネート",
}: Props) {
  const id = useId().replace(/:/g, "");
  const eq = outfit || state.equipped;
  const h = getItem(eq.hair),
    dress = getItem(eq.outfit),
    shoe = getItem(eq.shoes),
    acc = getItem(eq.accessory);
  const color = PALETTES[dress.palette].color,
    accent = PALETTES[acc.palette].color,
    foot = PALETTES[shoe.palette].color;
  const hair = state.hairColor;
  return (
    <svg
      className={`avatar-art ${className}`}
      viewBox="0 0 280 490"
      role="img"
      aria-label={label}
    >
      <defs>
        <radialGradient id={`${id}-skin`} cx=".38" cy=".36" r=".76">
          <stop stopColor={tint(state.skinColor, 0.3)} />
          <stop offset=".65" stopColor={state.skinColor} />
          <stop offset="1" stopColor={tint(state.skinColor, -0.13)} />
        </radialGradient>
        <linearGradient id={`${id}-cloth`} x2="1" y2=".8">
          <stop stopColor={tint(color, -0.15)} />
          <stop offset=".28" stopColor={tint(color, 0.2)} />
          <stop offset=".55" stopColor={color} />
          <stop offset=".82" stopColor={tint(color, 0.12)} />
          <stop offset="1" stopColor={tint(color, -0.18)} />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x2=".9" y2="1">
          <stop stopColor={tint(hair, -0.35)} />
          <stop offset=".28" stopColor={hair} />
          <stop offset=".48" stopColor={tint(hair, 0.22)} />
          <stop offset=".68" stopColor={hair} />
          <stop offset="1" stopColor={tint(hair, -0.27)} />
        </linearGradient>
        <linearGradient id={`${id}-iris`} x2=".2" y2="1">
          <stop stopColor={tint(state.eyeColor, -0.6)} />
          <stop offset=".48" stopColor={state.eyeColor} />
          <stop offset=".85" stopColor={tint(state.eyeColor, 0.3)} />
          <stop offset="1" stopColor="#f9e7ee" />
        </linearGradient>
        <radialGradient id={`${id}-blush`}>
          <stop stopColor="#ec8b9e" stopOpacity=".5" />
          <stop offset="1" stopColor="#ec8b9e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shine`}>
          <stop stopColor="#fff0ed" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff0ed" stopOpacity=".45" />
          <stop offset="1" stopColor="#fff0ed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="461" rx="68" ry="9" fill="#705c8619" />
      <g className="avatar-pose">
        <g
          className="avatar-hair-back"
          data-layer="back-hair"
          fill={`url(#${id}-hair)`}
        >
          {[2, 5].includes(h.shape) && (
            <path d="M87 89Q71 52 110 39Q177 14 195 83L199 255Q182 280 160 251L109 251Q77 285 76 246Z" />
          )}
          {h.shape === 1 && (
            <>
              <path d="M92 93Q38 64 46 160Q38 225 74 257Q63 188 92 143Z" />
              <path d="M186 93Q238 62 232 162Q241 225 205 257Q219 181 186 143Z" />
            </>
          )}
          {h.shape === 4 && (
            <path d="M186 66Q250 70 219 164Q198 215 220 260Q172 234 186 175Q203 120 177 103Z" />
          )}
          {h.shape === 3 &&
            [90, 190].map((x, i) => (
              <g key={x}>
                {[145, 170, 195, 220].map((y, j) => (
                  <ellipse
                    key={y}
                    cx={x + (j % 2 ? 3 : -3)}
                    cy={y}
                    rx="13"
                    ry="18"
                    transform={`rotate(${i ? -12 : 12} ${x} ${y})`}
                  />
                ))}
                <path
                  d={`M${x - 13} 234l13 6 13-6v17l-13-7-13 7Z`}
                  fill={PALETTES[h.palette].color}
                />
              </g>
            ))}
          {[2, 5].includes(h.shape) && (
            <g
              stroke={tint(hair, 0.35)}
              strokeWidth="1"
              opacity=".45"
              fill="none"
            >
              <path d="M84 129Q81 207 92 245M92 155Q87 223 103 251M187 131Q201 210 183 252M179 160Q189 224 175 248" />
            </g>
          )}
          {h.shape === 1 && (
            <g
              fill="none"
              stroke={tint(hair, 0.4)}
              strokeWidth="1.2"
              opacity=".45"
            >
              <path d="M72 101Q48 123 59 188M64 118Q50 168 69 222M207 101Q231 126 220 188M215 118Q229 166 210 222" />
            </g>
          )}
        </g>
        <g data-layer="body">
          <path
            d="M120 330L117 438M160 330L164 438"
            stroke={state.skinColor}
            strokeWidth="21"
            strokeLinecap="round"
          />
          <path
            d="M108 397L106 437M169 397L173 437"
            stroke="#fff5ef"
            strokeWidth="22"
          />
          <path
            d="M103 186L82 254L69 299M177 186L198 254L210 299"
            stroke={state.skinColor}
            strokeWidth="15"
            strokeLinecap="round"
          />
          <ellipse
            cx="67"
            cy="303"
            rx="9"
            ry="12"
            fill={state.skinColor}
            transform="rotate(20 67 303)"
          />
          <ellipse
            cx="212"
            cy="303"
            rx="9"
            ry="12"
            fill={state.skinColor}
            transform="rotate(-20 212 303)"
          />
          <path d="M126 148V179Q140 192 154 179V148" fill={state.skinColor} />
        </g>
        <path
          d="M127 160Q139 175 153 160L153 175Q140 182 127 173Z"
          fill={tint(state.skinColor, -0.12)}
        />
        <g data-layer="outfit">
          {dress.shape === 0 ? (
            <>
              <path
                d="M102 175L121 169L140 190L159 169L178 175L188 248L151 262L128 262L92 248Z"
                fill={`url(#${id}-cloth)`}
              />
              <path
                d="M100 243L180 243L197 331Q140 349 83 331Z"
                fill={`url(#${id}-cloth)`}
              />
              <path
                d="M113 251L105 337M130 255L126 341M151 255L153 341M168 252L177 337"
                stroke="#fff7"
                strokeWidth="2"
              />
              <path
                d="M118 173L140 203L162 173L162 190L140 216L118 190Z"
                fill="#fff7eb"
              />
              <path d="M140 202L128 218L140 213L151 218Z" fill="#cb879d" />
            </>
          ) : dress.shape === 3 ? (
            <>
              <path
                d="M99 176L126 172L140 184L154 172L181 176L190 276Q141 291 90 276Z"
                fill={`url(#${id}-cloth)`}
              />
              <path d="M101 273H179L190 330Q140 345 90 330Z" fill="#b69dbb" />
              <path d="M140 187V281" stroke="#fff4" strokeWidth="4" />
              {[208, 230, 252].map((y) => (
                <circle key={y} cx="143" cy={y} r="3" fill="#b69461" />
              ))}
            </>
          ) : dress.shape === 5 ? (
            <>
              <path
                d="M100 176L140 173L180 176L198 342Q140 363 82 342Z"
                fill={`url(#${id}-cloth)`}
              />
              <path
                d="M120 176L113 218L139 238L141 190L168 219L160 176"
                fill="#fff6e3"
              />
              <path d="M92 260H189" stroke="#d6b778" strokeWidth="7" />
              <circle
                cx="141"
                cy="261"
                r="7"
                fill="none"
                stroke="#fff3ca"
                strokeWidth="3"
              />
            </>
          ) : (
            <>
              <path
                d={`M103 177L126 172Q140 189 154 172L177 177L173 238Q${dress.shape === 4 ? "208 286 207 326" : "199 300 202 343"}Q140 365 78 343Q81 298 107 238Z`}
                fill={`url(#${id}-cloth)`}
              />
              <path
                d="M105 235Q140 246 175 235"
                fill="none"
                stroke="#fff4e6"
                strokeWidth="9"
              />
              <path
                d="M114 246Q105 293 94 335M139 248V344M164 246Q176 292 186 335"
                fill="none"
                stroke="#fff5"
                strokeWidth="2"
              />
              {dress.shape === 2 && (
                <path
                  d="M109 244Q140 285 171 244L195 330Q140 367 85 330Z"
                  fill="#fff6"
                />
              )}
              <path
                d="M81 338Q140 358 199 338"
                fill="none"
                stroke="#fff8ec"
                strokeWidth="9"
              />
              {Array.from({ length: 12 }, (_, i) => (
                <circle
                  key={i}
                  cx={86 + i * 10}
                  cy={341 + Math.sin((i / 11) * Math.PI) * 10}
                  r="4"
                  fill="#fff8ec"
                />
              ))}
              {dress.shape === 4 &&
                [105, 130, 158, 179].map((x, i) => (
                  <g
                    key={x}
                    transform={`translate(${x},${286 + (i % 2) * 30})`}
                  >
                    <path
                      d="M0-6L2-2L6 0L2 2L0 6L-2 2L-6 0L-2-2Z"
                      fill="#fff5e1"
                    />
                    <circle r="2" fill="#c9a05c" />
                  </g>
                ))}
            </>
          )}
          <path
            d="M102 178Q82 181 85 205L102 217L114 183M178 178Q198 181 195 205L178 217L166 183"
            fill={`url(#${id}-cloth)`}
          />
          <path
            d="M126 177L140 193L154 177"
            fill="none"
            stroke="#fff8ec"
            strokeWidth="6"
          />
          <path
            d="M140 206L123 195V218L140 207L157 195V218Z"
            fill={dress.shape === 0 ? "#bf8aa9" : "#fff2dc"}
          />
          <circle cx="140" cy="207" r="4" fill="#c4a260" />
          <circle cx="139" cy="206" r="1.5" fill="#fff2d2" />
          <path
            d="M102 213L106 230M178 213L174 230M109 248L99 320M171 248L184 320"
            stroke={tint(color, -0.22)}
            strokeWidth="1"
            fill="none"
            opacity=".55"
          />
          <path
            d="M104 184Q93 185 92 197M176 184Q187 185 188 197"
            fill="none"
            stroke="#fff5ed"
            strokeWidth=".8"
            opacity=".7"
          />
          {dress.shape === 0 && (
            <g transform="translate(163 220)">
              <path
                d="M-7-6H7V2Q5 8 0 11Q-5 8-7 2Z"
                fill="#f7e6c5"
                stroke="#b99a64"
                strokeWidth=".7"
              />
              <path d="M-4-1L-2 3L0-2L2 3L4-1L3 6H-3Z" fill={color} />
            </g>
          )}
          {dress.shape !== 0 && dress.shape !== 3 && dress.shape !== 5 && (
            <g fill="#fff1d7" opacity=".8">
              {[104, 122, 140, 158, 176].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} ${320 + Math.sin((i / 4) * Math.PI) * 10}l1.4 3 3 1.4-3 1.4-1.4 3-1.4-3-3-1.4 3-1.4Z`}
                />
              ))}
            </g>
          )}
        </g>
        <g data-layer="shoes" fill={foot}>
          <path
            d={`M96 ${shoe.shape === 2 ? 398 : 431}H118L122 453Q104 464 88 456L91 445Z`}
          />
          <path
            d={`M162 ${shoe.shape === 2 ? 398 : 431}H184L190 446L193 456Q176 464 158 453Z`}
          />
          {shoe.shape === 1 && (
            <path
              d="M95 440L116 435M165 435L185 440"
              stroke="#fff3db"
              strokeWidth="4"
            />
          )}
          {shoe.shape === 2 && (
            <path
              d="M96 406H118M163 406H184"
              stroke="#d7c3a0"
              strokeWidth="3"
            />
          )}
        </g>
        <g data-layer="face">
          <ellipse cx="93" cy="116" rx="7" ry="11" fill={state.skinColor} />
          <ellipse cx="187" cy="116" rx="7" ry="11" fill={state.skinColor} />
          <path
            d="M94 109Q91 105 92 116M187 109Q191 105 189 116"
            stroke={tint(state.skinColor, -0.2)}
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M94 83Q96 43 140 43Q184 43 187 83L181 128Q177 149 140 166Q106 151 100 129Z"
            fill={`url(#${id}-skin)`}
            stroke={tint(state.skinColor, -0.16)}
            strokeWidth=".6"
          />
          <path
            d="M98 85Q120 76 142 76L171 68L182 94Q165 78 146 86Q122 91 100 102Z"
            fill={tint(state.skinColor, -0.12)}
            opacity=".3"
          />
          <path
            d="M106 97Q116 91 128 95M152 95Q165 91 175 97"
            stroke={tint(hair, -0.1)}
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          <g className="avatar-eyes" data-expression={expression}>
            {expression === "happy" ? (
              <path
                d="M105 116Q117 102 130 114M150 114Q164 102 177 116"
                fill="none"
                stroke="#634556"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ) : (
              [118, 163].map((x, i) => (
                <g key={x}>
                  <path
                    d={`M${x - 14} 108Q${x - 2} 99 ${x + 13} 108Q${x + 13} 121 ${x + 5} 125Q${x - 8} 129 ${x - 13} 119Z`}
                    fill="#fffcf9"
                    stroke="#c2939c"
                    strokeWidth=".6"
                  />
                  <ellipse
                    cx={x}
                    cy="115"
                    rx="8.8"
                    ry={expression === "surprised" ? 12.3 : 11.7}
                    fill={`url(#${id}-iris)`}
                  />
                  <ellipse
                    cx={x}
                    cy="113"
                    rx="3.2"
                    ry="6.4"
                    fill={tint(state.eyeColor, -0.7)}
                  />
                  <path
                    d={`M${x - 6} 119Q${x} 128 ${x + 6} 119`}
                    fill="none"
                    stroke={tint(state.eyeColor, 0.65)}
                    strokeWidth="1.2"
                  />
                  <path
                    d={`M${x - 14} 108Q${x - 3} 99 ${x + 13} 108`}
                    stroke="#574052"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={
                      i === 0
                        ? `M${x - 12} 106l-4-4M${x - 8} 103l-2-3`
                        : `M${x + 11} 106l4-4M${x + 7} 103l2-3`
                    }
                    stroke="#574052"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${x - 10} 124Q${x} 129 ${x + 9} 123`}
                    stroke="#9e6c7c"
                    strokeWidth=".7"
                    fill="none"
                  />
                  <ellipse
                    cx={x - 3.3}
                    cy="108.5"
                    rx="3.2"
                    ry="2.7"
                    fill="white"
                  />
                  <circle cx={x + 3.3} cy="120" r="1.8" fill="#fffef5" />
                  <circle cx={x - 4.6} cy="119" r=".9" fill="#fffef5" />
                </g>
              ))
            )}
          </g>
          <ellipse
            cx="108"
            cy="134"
            rx="14"
            ry="8"
            fill={`url(#${id}-blush)`}
          />
          <ellipse
            cx="173"
            cy="134"
            rx="14"
            ry="8"
            fill={`url(#${id}-blush)`}
          />
          <path
            d="M103 133l1 3M108 132l1 3M173 132l1 3M178 133l1 3"
            stroke="#d68c99"
            strokeWidth=".7"
            opacity=".45"
          />
          <path
            d="M141 126L139 134L142 135"
            fill="none"
            stroke="#c98f8e"
            strokeWidth=".7"
            strokeLinecap="round"
          />
          <ellipse
            cx="140"
            cy="131"
            rx="1.8"
            ry="1"
            fill="#fff7ef"
            opacity=".7"
          />
          {expression === "surprised" ? (
            <ellipse cx="141" cy="147" rx="3.3" ry="4.3" fill="#b47b88" />
          ) : (
            <>
              <path
                d={`M134 145Q141 ${expression === "happy" ? 154 : 150} 148 145`}
                fill="none"
                stroke="#ad697e"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
              <path
                d="M137 151Q141 153 145 151"
                stroke="#fff5e9"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
        </g>
        <g className="avatar-fringe" data-layer="front-hair">
          <path
            d={
              h.shape === 0
                ? "M87 112Q70 38 131 31Q192 23 196 90L192 160L173 167L181 94L168 67Q151 95 125 97L135 60L101 107L104 166L85 158Z"
                : "M88 111Q72 39 130 30Q188 24 195 89L187 126L180 88L168 63Q153 92 127 96L136 58L101 108L98 137L88 125Z"
            }
            fill={`url(#${id}-hair)`}
          />
          <g fill="none" strokeLinecap="round">
            <path
              d="M139 35Q108 44 94 80M145 36Q118 47 105 75M153 37Q133 50 125 75M164 42Q151 62 137 83M173 48Q174 64 185 80"
              stroke={tint(hair, -0.27)}
              strokeWidth="1"
              opacity=".6"
            />
            <path
              d="M102 67Q118 43 145 41M144 51Q135 65 130 77M181 72Q189 98 181 123M95 101Q92 128 98 149"
              stroke={tint(hair, 0.45)}
              strokeWidth="1.2"
              opacity=".65"
            />
            <path
              d="M94 72Q122 45 150 49M157 50L172 62"
              stroke={`url(#${id}-shine)`}
              strokeWidth="7"
            />
            <path
              d="M100 101Q105 88 115 83L111 97M169 67Q171 87 182 96"
              stroke={tint(hair, -0.2)}
              strokeWidth="1"
            />
          </g>
          {h.shape === 5 && (
            <path
              d="M90 107Q78 132 91 155Q100 170 84 190M188 105Q202 135 190 156Q179 175 197 195"
              stroke={hair}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>
        <g data-layer="accessory" fill={accent}>
          {acc.shape === 0 && (
            <>
              <path d="M178 65L151 43V76L178 64L201 43V76Z" />
              <circle cx="177" cy="64" r="6" fill="#fff1da" />
            </>
          )}
          {acc.shape === 1 && (
            <g transform="translate(182 71)">
              {[
                [0, -6],
                [6, 0],
                [0, 6],
                [-6, 0],
              ].map(([x, y], i) => (
                <ellipse key={i} cx={x} cy={y} rx="6" ry="7" />
              ))}
              <circle r="2" fill="#fff3d4" />
            </g>
          )}
          {acc.shape === 2 && (
            <path
              d="M183 59Q165 61 171 78Q184 89 193 75Q173 81 183 59Z"
              fill="#eed7a0"
            />
          )}
          {acc.shape === 3 &&
            [103, 121, 140, 159, 177].map((x, i) => (
              <g
                key={x}
                transform={`translate(${x},${59 - Math.sin((i / 4) * Math.PI) * 11})`}
              >
                <circle r="8" fill={accent} />
                <circle r="3" fill="#f7e6ae" />
              </g>
            ))}
          {acc.shape === 4 && (
            <>
              <ellipse cx="141" cy="40" rx="55" ry="19" />
              <path
                d="M104 49Q138 66 179 47"
                fill="none"
                stroke="#f8eddb"
                strokeWidth="3"
              />
            </>
          )}
          {acc.shape === 5 &&
            [91, 190].map((x) => (
              <path
                key={x}
                d={`M${x} 126l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z`}
                fill="#e9c86f"
              />
            ))}
          {acc.shape === 6 && (
            <path
              d="M96 60Q140 15 186 60L177 67Q140 35 104 68Z"
              stroke="#fffaed"
              strokeWidth="6"
            />
          )}
          {acc.shape === 7 && (
            <path
              d="M112 43L105 17L125 30L140 9L155 30L176 17L168 43Z"
              fill="#e0bf77"
              stroke="#fff2be"
              strokeWidth="2"
            />
          )}
        </g>
      </g>
    </svg>
  );
}
