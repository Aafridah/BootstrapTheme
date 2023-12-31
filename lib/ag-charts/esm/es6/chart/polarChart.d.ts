import { Chart } from './chart';
import { Node } from '../scene/node';
import { Padding } from '../util/padding';
export declare class PolarChart extends Chart {
    static className: string;
    static type: "polar";
    padding: Padding;
    constructor(document?: Document);
    get seriesRoot(): Node;
    performLayout(): void;
}
