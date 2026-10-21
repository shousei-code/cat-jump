import { useId } from "react";
import { getItem, PALETTES } from "../game/data";
import type { GameState, Outfit } from "../game/types";
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
        <linearGradient id={`${id}-skin`} x2="1" y2="1">
          <stop stopColor={state.skinColor} />
          <stop offset="1" stopColor={state.skinColor} />
        </linearGradient>
        <linearGradient id={`${id}-cloth`} x2="1" y2="1">
          <stop stopColor="#ffffff" stopOpacity=".5" />
          <stop offset=".45" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x2=".7" y2="1">
          <stop stopColor={hair} />
          <stop offset=".6" stopColor={hair} />
          <stop offset="1" stopColor="#59445e" />
        </linearGradient>
        <linearGradient id={`${id}-iris`} x2="0" y2="1">
          <stop stopColor="#42344f" />
          <stop offset=".55" stopColor={state.eyeColor} />
          <stop offset="1" stopColor="#e8cbed" />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="461" rx="68" ry="9" fill="#705c8619" />
      <g data-layer="back-hair" fill={`url(#${id}-hair)`}>
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
                <g key={x} transform={`translate(${x},${286 + (i % 2) * 30})`}>
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
          <path d="M96 406H118M163 406H184" stroke="#d7c3a0" strokeWidth="3" />
        )}
      </g>
      <g data-layer="face">
        <ellipse cx="91" cy="113" rx="8" ry="13" fill={state.skinColor} />
        <ellipse cx="189" cy="113" rx="8" ry="13" fill={state.skinColor} />
        <path
          d="M91 83Q93 41 140 42Q189 41 190 83L183 129Q175 156 140 169Q105 156 97 129Z"
          fill={`url(#${id}-skin)`}
        />
        <path
          d="M107 96Q117 91 127 95M153 95Q164 91 174 96"
          stroke={hair}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {expression === "happy" ? (
          <path
            d="M106 114Q117 100 128 113M152 113Q164 100 175 114"
            fill="none"
            stroke="#694a67"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : (
          <>
            {[118, 163].map((x) => (
              <g key={x}>
                <path
                  d={`M${x - 13} 107Q${x} 98 ${x + 12} 108L${x + 10} 122Q${x} 130 ${x - 10} 122Z`}
                  fill="#fffdf8"
                />
                <ellipse
                  cx={x}
                  cy="115"
                  rx="8"
                  ry={expression === "surprised" ? 13 : 11}
                  fill={`url(#${id}-iris)`}
                />
                <ellipse cx={x} cy="114" rx="3.5" ry="7" fill="#45334f" />
                <circle cx={x - 3} cy="109" r="3" fill="white" />
                <circle cx={x + 3} cy="121" r="1.8" fill="white" />
                <path
                  d={`M${x - 14} 107Q${x} 98 ${x + 12} 107`}
                  stroke="#684764"
                  strokeWidth="2.8"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </>
        )}
        <ellipse cx="106" cy="135" rx="9" ry="4" fill="#ee9fac" opacity=".55" />
        <ellipse cx="176" cy="135" rx="9" ry="4" fill="#ee9fac" opacity=".55" />
        <path
          d="M140 123L138 134L142 135"
          fill="none"
          stroke="#cc9a91"
          strokeWidth="1"
        />
        {expression === "surprised" ? (
          <ellipse cx="141" cy="148" rx="4" ry="5" fill="#b47b88" />
        ) : (
          <path
            d={`M133 146Q140 ${expression === "happy" ? 156 : 151} 148 146`}
            fill="none"
            stroke="#b87787"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </g>
      <g data-layer="front-hair">
        <path
          d={
            h.shape === 0
              ? "M87 112Q70 38 131 31Q192 23 196 90L192 160L173 167L181 94L168 67Q151 95 125 97L135 60L101 107L104 166L85 158Z"
              : "M88 111Q72 39 130 30Q188 24 195 89L187 126L180 88L168 63Q153 92 127 96L136 58L101 108L98 137L88 125Z"
          }
          fill={`url(#${id}-hair)`}
        />
        <path
          d="M105 55Q133 36 164 49M98 65Q119 47 135 46"
          fill="none"
          stroke="#ffe9f066"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
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
    </svg>
  );
}
