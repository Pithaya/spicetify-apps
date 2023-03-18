import { IBeatDrawData } from './beat-draw-data.interface';
import { IEdgeDrawData } from './edge-draw-data.interface';

export interface IGraphDrawData {
    beats: IBeatDrawData[];
    edges: IEdgeDrawData[];
}
