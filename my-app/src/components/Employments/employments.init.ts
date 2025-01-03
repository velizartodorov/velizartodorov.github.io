import { Employment } from "./employment";
import { adm_solutions } from "./employments/adm_solutions";
import { continuum } from "./employments/continuum";
import { docbyte } from "./employments/docbyte";
import { desi as dsi } from "./employments/dsi";
import { erasmus_bikema } from "./employments/erasmus_bikema";
import { securex } from "./employments/securex";
import { telnet } from "./employments/telnet";
import { unified_post } from "./employments/unified_post";

export const employments: Employment[] = [
    docbyte,
    continuum,
    securex,
    unified_post,
    adm_solutions,
    erasmus_bikema,
    dsi,
    telnet
];